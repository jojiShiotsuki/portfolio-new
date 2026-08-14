import React from 'react';
import type { ProposalOption, ProposalSignature } from '../../lib/proposals/types';
import { submitSignature } from '../../lib/proposals/sign';

interface SignatureBlockProps {
  slug: string;
  signature: ProposalSignature;
  options: ProposalOption[];
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
}

type SubmitState = 'idle' | 'submitting' | 'done' | 'error';

/** A point on the pad, stored as a fraction of the pad's width and height. */
interface Point {
  x: number;
  y: number;
}

type Stroke = Point[];

interface Palette {
  ink: string;
  paper: string;
  family: string;
}

/* The pad is drawn at this many device pixels per CSS pixel when it is exported, so the
   PNG in the record is legible at print size rather than at screen size. */
const EXPORT_SCALE = 2;
const LINE_WIDTH = 2;

/* Used only if the pad has never been laid out, which happens if a print stylesheet
   hides it. Keeping a sane default means the export is still a readable image. */
const FALLBACK_SIZE = { w: 600, h: 170 };

/*
  The pad's pixels are read back once per stroke to decide whether there is real ink on it,
  and Chrome warns in the console when a canvas is read without this flag. The console of a
  page a client is about to sign is not the place for a browser telling us off, and the
  pad is 634 by 192, so the software rendering path this asks for costs nothing.

  The attributes only take effect on the FIRST getContext call for a canvas: every later
  call returns the context that already exists and ignores what is passed. So this same
  object goes to every call site rather than only to the one that reads.
*/
const CANVAS_OPTIONS: CanvasRenderingContext2DSettings = { willReadFrequently: true };

/*
  Colours come out of the design tokens, read off the live element, so this file contains
  no colour of its own and dark mode needs no special case. --ink and --paper are declared
  on .mono and inherit down to the canvas.
*/
const readPalette = (el: HTMLElement): Palette => {
  const styles = getComputedStyle(el);
  return {
    ink: styles.getPropertyValue('--ink').trim() || styles.color,
    paper: styles.getPropertyValue('--paper').trim() || styles.backgroundColor,
    family: styles.fontFamily,
  };
};

/* Strokes are stored, not just painted, which is what makes the pad survive a resize and
   a device pixel ratio change: the ink is replayed rather than rescaled, so nothing is
   ever lost and the client never has to be told it was. */
const paintStrokes = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strokes: Stroke[],
  ink: string,
): void => {
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;

  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    if (stroke.length === 1) {
      // A tap with no movement is still a mark, and a person dotting an i expects it.
      ctx.beginPath();
      ctx.arc(stroke[0].x * width, stroke[0].y * height, LINE_WIDTH / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(stroke[0].x * width, stroke[0].y * height);
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x * width, stroke[i].y * height);
    }
    ctx.stroke();
  }
};

/* Whether the pad actually has ink on it, asked of the pixels rather than of a flag. A
   pointer event fires when someone rests a finger on the pad and takes it off again
   without moving, and a proposal should not count that as a signature. */
const canvasHasInk = (canvas: HTMLCanvasElement): boolean => {
  const ctx = canvas.getContext('2d', CANVAS_OPTIONS);
  if (!ctx || canvas.width === 0 || canvas.height === 0) return false;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) return true;
  }
  return false;
};

const EMAIL_SHAPE = /^\S+@\S+\.\S+$/;

const SignatureBlock: React.FC<SignatureBlockProps> = ({
  slug,
  signature,
  options,
  selectedOptionId,
  onSelectOption,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const strokesRef = React.useRef<Stroke[]>([]);
  const drawingRef = React.useRef(false);
  const sizeRef = React.useRef({ ...FALLBACK_SIZE });
  /* The ink colour for the stroke in progress. Cached because getComputedStyle forces a
     style recalculation, and a pointermove handler runs on every reported position. */
  const inkRef = React.useRef('');
  const mountedRef = React.useRef(true);

  const [hasInk, setHasInk] = React.useState(false);
  const [useTypedSignature, setUseTypedSignature] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [roleTitle, setRoleTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<SubmitState>('idle');
  const [reference, setReference] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const locked = state === 'submitting' || state === 'done';

  /*
    The setup half matters as much as the cleanup half.

    An effect that only returns a cleanup runs mount, cleanup, mount again under
    StrictMode, and the second mount has nothing to undo the first cleanup. The ref then
    reads false for the rest of the component's life, and the guard after the network
    call swallows the success: the client presses Sign, the record is written, and the
    button says "Signing" forever. Setting it true on the way in costs one line.
  */
  React.useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  /* Size the backing store by the device pixel ratio and scale the context to match, or
     the line lands away from the cursor on a retina screen. Then replay the ink. */
  const setupCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      // Assigning width or height wipes the backing store and resets the transform. The
      // strokes are held separately for exactly this reason.
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d', CANVAS_OPTIONS);
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;
    sizeRef.current = { w: rect.width, h: rect.height };

    inkRef.current = readPalette(canvas).ink;
    ctx.clearRect(0, 0, rect.width, rect.height);
    paintStrokes(ctx, rect.width, rect.height, strokesRef.current, inkRef.current);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(canvas);
    setupCanvas();
    return () => observer.disconnect();
  }, [setupCanvas]);

  /* Ink drawn in one theme is invisible in the other, so a theme change repaints it in
     the new token colour. The class carries no colour of its own, so this is the only
     place that has to know the theme can move. */
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const repaint = () => setupCanvas();
    media.addEventListener('change', repaint);
    const observer = new MutationObserver(repaint);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      media.removeEventListener('change', repaint);
      observer.disconnect();
    };
  }, [setupCanvas]);

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.width ? (event.clientX - rect.left) / rect.width : 0,
      y: rect.height ? (event.clientY - rect.top) / rect.height : 0,
    };
  };

  const padDisabled = locked || useTypedSignature;

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || padDisabled) return;
    event.preventDefault();
    // Capture keeps the line following a pointer that wanders off the pad mid stroke. It
    // throws if the pointer has already gone, which must not take the stroke with it.
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      /* drawing still works without capture, it just stops at the edge */
    }
    drawingRef.current = true;
    inkRef.current = readPalette(canvas).ink;
    strokesRef.current = [...strokesRef.current, [pointFrom(event, canvas)]];
    setupCanvas();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !drawingRef.current || padDisabled) return;
    event.preventDefault();

    const strokes = strokesRef.current;
    const current = strokes[strokes.length - 1];
    if (!current) return;

    const point = pointFrom(event, canvas);
    const previous = current[current.length - 1];
    strokesRef.current = [...strokes.slice(0, -1), [...current, point]];

    // Draw the new segment only. A full replay on every pointermove is correct but does
    // the same work over and over as the signature gets longer.
    const { w, h } = sizeRef.current;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkRef.current;
    ctx.beginPath();
    ctx.moveTo(previous.x * w, previous.y * h);
    ctx.lineTo(point.x * w, point.y * h);
    ctx.stroke();
  };

  const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !drawingRef.current) return;
    drawingRef.current = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    setHasInk(canvasHasInk(canvas));
  };

  const clearPad = () => {
    strokesRef.current = [];
    setHasInk(false);
    setupCanvas();
  };

  /* The image that goes into the record. Painted onto its own canvas rather than lifted
     off the pad so it carries an opaque background: a transparent PNG of near white ink
     is a blank square in an email client that paints white behind it. */
  const buildImage = (draw: (ctx: CanvasRenderingContext2D, palette: Palette, w: number, h: number) => void): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h } = sizeRef.current;
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(w * EXPORT_SCALE));
    out.height = Math.max(1, Math.round(h * EXPORT_SCALE));
    const ctx = out.getContext('2d');
    if (!ctx) return null;

    const palette = readPalette(canvas);
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0);
    draw(ctx, palette, w, h);
    return out.toDataURL('image/png');
  };

  const exportDrawnSignature = (): string | null =>
    buildImage((ctx, palette, w, h) => paintStrokes(ctx, w, h, strokesRef.current, palette.ink));

  /* The typed alternative. The image says in words that it was typed, because the payload
     has nowhere else to carry that and a record that cannot tell a drawn signature from a
     typed one is a record that is quietly wrong about what happened. */
  const exportTypedSignature = (name: string): string | null =>
    buildImage((ctx, palette, w, h) => {
      ctx.fillStyle = palette.ink;
      ctx.textBaseline = 'alphabetic';
      const size = Math.max(16, Math.min(h * 0.3, (w * 0.88) / Math.max(name.length, 10) * 1.8));
      ctx.font = `${Math.round(size)}px ${palette.family}`;
      ctx.fillText(name, w * 0.06, h * 0.56);
      ctx.font = `${Math.max(10, Math.round(size * 0.34))}px ${palette.family}`;
      ctx.fillText('Typed signature', w * 0.06, h * 0.82);
    });

  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim();
  const emailLooksReal = EMAIL_SHAPE.test(trimmedEmail);
  const signatureReady = useTypedSignature ? trimmedName.length > 0 : hasInk;
  const canSubmit = signatureReady && trimmedName.length > 0 && emailLooksReal && !locked;

  const selectedOption = options.find(option => option.id === selectedOptionId) ?? options[0];

  const missing = (): string => {
    if (!signatureReady) {
      return useTypedSignature
        ? 'Type your full name below to sign.'
        : 'Draw your signature above, or tick the box to sign with your typed name.';
    }
    if (trimmedName.length === 0) return 'Add your full name.';
    if (!emailLooksReal) return 'Add the email address the copy should go to.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !selectedOption) return;

    const drawing = useTypedSignature
      ? exportTypedSignature(trimmedName)
      : exportDrawnSignature();

    if (!drawing) {
      setState('error');
      setErrorMessage('This browser would not produce the signature image, so nothing was sent. Try a different browser, or reply to the email this proposal arrived in.');
      return;
    }

    setState('submitting');
    setErrorMessage('');

    const result = await submitSignature({
      slug,
      drawing,
      typedName: trimmedName,
      typedTitle: roleTitle.trim(),
      email: trimmedEmail,
      optionId: selectedOption.id,
      clientTime: new Date().toISOString(),
      /* The image says "Typed signature" on its face, but a stored record should not
         need reading with your eyes to answer which of the two this was. */
      typedSignature: useTypedSignature,
    });

    if (!mountedRef.current) return;

    if (result.ok && result.reference) {
      setReference(result.reference);
      setState('done');
      return;
    }
    // Nothing typed or drawn is touched here. An error must cost the client a button
    // press, not their signature.
    setState('error');
    setErrorMessage(result.error ?? 'The signature was not recorded. Please press Sign again.');
  };

  return (
    <section className="pr-sign" id="signature" tabIndex={-1} aria-labelledby="signature-h">
      <h2 className="pr-sec-h" id="signature-h">Acceptance</h2>

      <p className="pr-sign-statement">{signature.statement}</p>

      {selectedOption ? (
        <p className="pr-sign-accepting">
          You are accepting <strong>{selectedOption.name}</strong>, {selectedOption.price}
          {selectedOption.cadence ? ` ${selectedOption.cadence}` : ''}.
        </p>
      ) : null}

      {/* A second way to change the option, here rather than only up in the pricing, so
          nobody has to scroll away from the pad to fix a mis-click. */}
      {options.length > 1 ? (
        <div className="pr-sign-choice" role="radiogroup" aria-label="The option you are accepting">
          {options.map(option => (
            <label className="pr-sign-choice-opt" key={option.id}>
              <input
                type="radio"
                name="signature-option"
                value={option.id}
                checked={selectedOption ? option.id === selectedOption.id : false}
                onChange={() => onSelectOption(option.id)}
                disabled={locked}
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      ) : null}

      {state === 'done' ? (
        <div className="pr-sign-done">
          <p className="pr-p">
            Signed and recorded. Thank you, {trimmedName}.
          </p>
          <dl className="pr-kv">
            <div className="r">
              <dt>Reference</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{reference}</dd>
            </div>
            <div className="r">
              <dt>Option accepted</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{selectedOption ? selectedOption.name : ''}</dd>
            </div>
            <div className="r">
              <dt>Copy sent to</dt>
              <span className="leader" aria-hidden="true" />
              <dd>{trimmedEmail}</dd>
            </div>
          </dl>
          <p className="pr-sign-note">
            Keep the reference. This proposal has been signed and cannot be signed again from
            this page.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="pr-sign-pad">
            <canvas
              ref={canvasRef}
              className="pr-sign-canvas"
              role="img"
              aria-label="Signature pad. Draw your signature with a mouse, a trackpad or a finger. If you cannot draw, tick the box below and your typed name becomes your signature."
              /* Behaviour, not decoration: without this a drag on a phone scrolls the
                 page instead of drawing a line. */
              style={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={endStroke}
            />
          </div>

          <p className="pr-sign-hint">
            {useTypedSignature
              ? 'Your typed name is being used as your signature. Untick the box to draw instead.'
              : 'Draw your signature in the box.'}
          </p>

          {/* Not disabled when the pad is empty. Disabling it the moment it is used takes
              focus off the control the keyboard user just pressed. */}
          <button
            type="button"
            className="pr-sign-clear"
            onClick={clearPad}
            disabled={padDisabled}
          >
            Clear signature
          </button>

          <div className="pr-field pr-field--check">
            <input
              id="pr-sign-typed"
              type="checkbox"
              checked={useTypedSignature}
              disabled={locked}
              onChange={event => {
                setUseTypedSignature(event.target.checked);
                if (event.target.checked) {
                  strokesRef.current = [];
                  setHasInk(false);
                  setupCanvas();
                }
              }}
            />
            <label htmlFor="pr-sign-typed">Use my typed name as my signature</label>
          </div>

          <div className="pr-sign-fields">
            <div className="pr-field">
              <label htmlFor="pr-sign-name">Full name</label>
              <input
                id="pr-sign-name"
                type="text"
                autoComplete="name"
                value={fullName}
                disabled={locked}
                onChange={event => setFullName(event.target.value)}
              />
            </div>

            <div className="pr-field">
              <label htmlFor="pr-sign-title">Title or role</label>
              <input
                id="pr-sign-title"
                type="text"
                autoComplete="organization-title"
                value={roleTitle}
                disabled={locked}
                onChange={event => setRoleTitle(event.target.value)}
              />
            </div>

            <div className="pr-field">
              <label htmlFor="pr-sign-email">Email</label>
              <input
                id="pr-sign-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                disabled={locked}
                onChange={event => setEmail(event.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="pr-sign-submit" disabled={!canSubmit}>
            {state === 'submitting' ? 'Signing' : 'Sign and accept'}
          </button>

          {/* One live region for both the reason the button is off and the reason the
              last attempt failed, so a screen reader hears the change either way. */}
          <p className="pr-sign-state" role="status" aria-live="polite">
            {state === 'error' ? errorMessage : missing()}
          </p>

          <p className="pr-sign-note">{signature.note}</p>
        </form>
      )}
    </section>
  );
};

export default SignatureBlock;
