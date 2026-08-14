import React from 'react';
import type { ProposalOption, ProposalSignature } from '../../lib/proposals/types';
import { submitSignature } from '../../lib/proposals/sign';

interface SignatureBlockProps {
  /** Its number in the document, derived in ProposalPage so this cannot disagree. */
  n: string;
  slug: string;
  signature: ProposalSignature;
  options: ProposalOption[];
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  /** Fired once, when the server has accepted the signature. Locks the pricing block. */
  onSigned: () => void;
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
  The typed-name signature is set in a script face, not in the document's mono, because a
  name in Azeret Mono reads as a field someone filled in rather than as a signature.

  It is a canvas draw, and that is the whole difficulty. A canvas does not wait for a font:
  if the face has not loaded when fillText runs it silently paints the fallback and never
  tells you. That is how the pad and the recorded PNG end up disagreeing, one in script and
  one in mono, with the client having checked the one that was not sent. So nothing here
  assumes the font is ready. `loadSignatureFont` is awaited and the pad repainted, and the
  first paint before it resolves is deliberate too: an empty pad while a webfont downloads
  is worse than a correct name in the wrong face for 200ms.

  The size ratio is larger than the mono it replaced (0.30) because a script face carries a
  much smaller x-height at the same pixel size, and the baseline sits higher up the pad to
  keep the long descenders of a script capital clear of the label underneath.
*/
const SIGNATURE_FAMILY = "'Dancing Script', cursive";
const SIGNATURE_WEIGHT = 600;
const SIGNATURE_SIZE_RATIO = 0.42;
const SIGNATURE_BASELINE = 0.52;

/**
 * Resolve when the signature face is usable for this exact name.
 *
 * The name is passed to `fonts.load` rather than a fixed string because Google serves the
 * family in unicode-range subsets, so loading it for "abc" does not guarantee the subset a
 * name with an accent or a non-Latin character needs. Never rejects: a font that fails to
 * load is a cosmetic problem and must not stop somebody signing.
 */
const loadSignatureFont = async (name: string): Promise<void> => {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  try {
    await document.fonts.load(`${SIGNATURE_WEIGHT} 64px ${SIGNATURE_FAMILY}`, name);
  } catch {
    /* Cosmetic only. The fallback face still paints a name. */
  }
};

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

/*
  The typed alternative, painted here rather than inside the export so the pad and the
  exported PNG are drawn by the same code. They used to be two paths, and the pad stayed
  blank while the export carried a mark, which meant the client committed to a signature
  they had never been shown.

  The image says in words that it was typed, because a record that cannot tell a drawn
  signature from a typed one is a record that is quietly wrong about what happened.
*/
const paintTypedName = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  name: string,
  palette: Palette,
): void => {
  ctx.fillStyle = palette.ink;
  ctx.textBaseline = 'alphabetic';

  /* The size was guessed from the character count, and the guess ran long: a 34 character
     name inked to the last pixel of a 938px pad, so the mark the client checked and the
     PNG in the record were both cut off at the right edge. It is measured now, then shrunk
     by exactly the amount it overruns, so the whole name is always on the pad. */
  const usable = width * 0.88;
  let size = Math.max(16, height * SIGNATURE_SIZE_RATIO);
  ctx.font = `${SIGNATURE_WEIGHT} ${Math.round(size)}px ${SIGNATURE_FAMILY}`;
  const measured = ctx.measureText(name).width;
  if (measured > usable) size = Math.max(8, (size * usable) / measured);

  ctx.font = `${SIGNATURE_WEIGHT} ${Math.round(size)}px ${SIGNATURE_FAMILY}`;
  ctx.fillText(name, width * 0.06, height * SIGNATURE_BASELINE);

  /* The label stays in the document's own mono. It is a statement about the record, not
     part of the signature, and setting it in the same script would read as if the words
     had been signed too. */
  ctx.font = `${Math.max(10, Math.round(size * 0.28))}px ${palette.family}`;
  ctx.fillText('Typed signature', width * 0.06, height * 0.86);
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

/*
  Copied verbatim from EMAIL_RE in worker-sign/src/index.ts, and it has to stay that way.

  The page used to test /^\S+@\S+\.\S+$/, which accepts an @ or a dot inside either half,
  so an ordinary typo like "tony@innerwealth..au" enabled the Sign button and was refused
  by the worker after the client had already drawn their signature and pressed it. The
  page must not be looser than the thing it posts to. It must never be stricter either,
  because a wrong rejection here costs a signature.
*/
const EMAIL_SHAPE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/*
  The same alignment as the pattern above, for the same reason.

  The worker refuses a name over 120 characters, a title over 120 and an address over 254
  (MAX_NAME, MAX_TITLE and MAX_EMAIL in worker-sign/src/index.ts). The page had no cap at
  all, so a pasted name or address that was too long enabled the Sign button, took the
  client's signature and came back rejected. The fields stop at the limit and the button
  stays off, so the refusal happens before the signature, not after it.
*/
const MAX_NAME = 120;
const MAX_TITLE = 120;
const MAX_EMAIL = 254;

/*
  The date on the client's copy of the signed record.

  The locale is pinned to en-AU for the same reason ProposalPage pins it: the client is
  Australian, and a record that prints 8/14/2026 on a machine that is not day first is a
  document disagreeing with itself. The zone is named because this proposal is signed in
  one country and recorded in another, and an undated or ambiguously dated record is the
  one thing a signature page cannot be. The server stamps the authoritative time against
  the reference; this is the same instant the payload carried.
*/
const AU_SIGNED_AT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
};

const formatSignedAt = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-AU', AU_SIGNED_AT);
};

const SignatureBlock: React.FC<SignatureBlockProps> = ({
  n,
  slug,
  signature,
  options,
  selectedOptionId,
  onSelectOption,
  onSigned,
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
  /* What the pad should be painting when it is repainted by something that is not a
     render: a resize, a device pixel ratio change, a theme change. Held in a ref so the
     painter can stay a callback with no dependencies, which is what stops the
     ResizeObserver being torn down and rebuilt on every keystroke of the name field. */
  const typedRef = React.useRef({ on: false, name: '' });
  /* The receipt takes focus on success, so a keyboard or screen reader user lands on the
     confirmation instead of at the top of a 12,000px document. */
  const doneRef = React.useRef<HTMLDivElement | null>(null);

  const [hasInk, setHasInk] = React.useState(false);
  const [useTypedSignature, setUseTypedSignature] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [roleTitle, setRoleTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<SubmitState>('idle');
  const [reference, setReference] = React.useState('');
  /*
    What was actually submitted, frozen at the moment the server accepted it.

    The receipt used to render from the live selection, and the pricing radios stayed
    enabled after signing, so one tap on the other option card rewrote what the receipt
    said had been accepted, with no network call and nothing on screen saying it changed.
    The client's downloaded PDF could then name Option A next to the reference the server
    had recorded against Option B, a AUD 16,000 disagreement between his copy and ours.
    A receipt is a record of what happened, so it reads from a snapshot, never from state
    that anything can still move.
  */
  const [signedOption, setSignedOption] = React.useState<ProposalOption | null>(null);
  const [signedName, setSignedName] = React.useState('');
  const [signedTitle, setSignedTitle] = React.useState('');
  const [signedEmail, setSignedEmail] = React.useState('');
  /*
    The mark itself, kept on the page after signing.

    The pad lives inside the form, and the form is replaced by the receipt at success, so
    the signed document used to have no signature anywhere on it: a client who signed and
    then pressed Download PDF got a proposal with a receipt and no mark, which is the one
    thing the whole feature exists to produce. This is the exact data URL that was posted,
    not a re-export, so the image on the page is the image in the record.
  */
  const [signedImage, setSignedImage] = React.useState('');
  const [signedAt, setSignedAt] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  /*
    True when the server answered that this proposal was already signed and refused to
    record a second acceptance.

    It exists because the page's "signed" state is only in memory: a refresh returns a
    blank form with the options live again, so a client could sign, reload, and sign again
    naming a different option. The server now holds the first record and returns it. This
    flag is what stops the page dressing that reply up as a fresh signature, because the
    two differ in ways the client must see: the mark they just drew was NOT stored, and the
    option that counts may not be the one they have selected.
  */
  const [wasAlreadySigned, setWasAlreadySigned] = React.useState(false);

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

    const palette = readPalette(canvas);
    inkRef.current = palette.ink;
    ctx.clearRect(0, 0, rect.width, rect.height);

    /* In typed mode the pad shows the typed mark rather than the strokes. The strokes are
       still there and are painted again the moment the box is unticked. */
    const typed = typedRef.current;
    if (typed.on) {
      if (typed.name) paintTypedName(ctx, rect.width, rect.height, typed.name, palette);
      return;
    }
    paintStrokes(ctx, rect.width, rect.height, strokesRef.current, palette.ink);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(canvas);
    setupCanvas();
    return () => observer.disconnect();
  }, [setupCanvas]);

  /* Keep the pad honest about what will be recorded. Ticking the box or typing another
     letter of the name repaints the mark, so the client signs while looking at the same
     image the server is about to be sent, not at an empty box. */
  React.useEffect(() => {
    const name = fullName.trim();
    typedRef.current = { on: useTypedSignature, name };
    setupCanvas();

    /* Then again once the script face is actually available for these characters. Without
       this second paint the pad keeps whatever the fallback drew, and since the exported
       PNG is taken from this same canvas, the record would carry the fallback too. */
    if (!useTypedSignature || !name) return;
    let cancelled = false;
    void loadSignatureFont(name).then(() => {
      if (!cancelled) setupCanvas();
    });
    return () => { cancelled = true; };
  }, [useTypedSignature, fullName, setupCanvas]);

  /* Success is the one outcome in this document that has to be handed to the reader. The
     receipt takes focus so a keyboard user lands on it rather than at the top of the
     page, and so a screen reader reads it even if the live region is missed. */
  React.useEffect(() => {
    if (state === 'done') doneRef.current?.focus();
  }, [state]);

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

  const exportTypedSignature = (name: string): string | null =>
    buildImage((ctx, palette, w, h) => paintTypedName(ctx, w, h, name, palette));

  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim();
  const emailLooksReal = EMAIL_SHAPE.test(trimmedEmail) && trimmedEmail.length <= MAX_EMAIL;
  const nameFits = trimmedName.length > 0 && trimmedName.length <= MAX_NAME;
  const titleFits = roleTitle.trim().length <= MAX_TITLE;
  const signatureReady = useTypedSignature ? trimmedName.length > 0 : hasInk;
  const canSubmit = signatureReady && nameFits && titleFits && emailLooksReal && !locked;
  /* While a signature is in flight the button is kept enabled and inert rather than
     disabled, because disabling a focused button hands focus to <body>. */
  const submitDisabled = state === 'submitting' ? false : !canSubmit;

  const selectedOption = options.find(option => option.id === selectedOptionId) ?? options[0];

  const missing = (): string => {
    if (!signatureReady) {
      return useTypedSignature
        ? 'Type your full name below to sign.'
        : 'Draw your signature above, or tick the box to sign with your typed name.';
    }
    if (trimmedName.length === 0) return 'Add your full name.';
    /* Said in the same words the field limit uses, because the alternative is a client
       looking at a button that will not turn on and no reason given. */
    if (!nameFits) return `Shorten your name to ${MAX_NAME} characters or fewer.`;
    if (!titleFits) return `Shorten your title to ${MAX_TITLE} characters or fewer.`;
    /* Not "the address the copy goes to". Nothing emails the client, so nothing here says
       it will. See the receipt row for the same correction. */
    if (!emailLooksReal) return 'Add the email address this should be recorded against.';
    return '';
  };

  /*
    What the live region says, in every state.

    This sentence used to live inside the form, and the form is replaced wholesale at
    success, so the one moment worth announcing was the one moment with no live region on
    the page: the client heard "Signing", then silence, and focus fell to the top of the
    document. The paragraph now sits outside both branches, so the same DOM node survives
    the swap and the change of text is what gets read out.
  */
  const liveMessage = (): string => {
    if (state === 'done') {
      if (wasAlreadySigned) {
        return `This proposal has already been signed. The acceptance on file is ${
          signedOption ? signedOption.name : 'the option recorded at the time'
        }, reference ${reference}. Nothing further was recorded.`;
      }
      return `Signed and recorded. Thank you, ${signedName}. Your reference is ${reference}.`;
    }
    if (state === 'error') return errorMessage;
    return missing();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !selectedOption) return;

    /* The export paints onto a NEW canvas, so it needs the script face just as much as the
       pad did, and there is a real window where it would not have it: type a name, and hit
       Sign before the webfont finishes downloading. The pad and the export would agree at
       that instant, both showing the fallback, so nothing would look wrong; then the pad
       would repaint into script a moment later and the record would keep the fallback for
       good. Awaiting here costs nothing once the font is cached, which it is by the time
       anybody has finished filling in three fields. */
    if (useTypedSignature) await loadSignatureFont(trimmedName);

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

    const clientTime = new Date().toISOString();

    const result = await submitSignature({
      slug,
      drawing,
      typedName: trimmedName,
      typedTitle: roleTitle.trim(),
      email: trimmedEmail,
      optionId: selectedOption.id,
      clientTime,
      /* The image says "Typed signature" on its face, but a stored record should not
         need reading with your eyes to answer which of the two this was. */
      typedSignature: useTypedSignature,
    });

    if (!mountedRef.current) return;

    if (result.ok && result.reference) {
      /*
        The proposal was already signed and this attempt was not recorded. Everything shown
        from here has to come from the STORED record rather than from this form, because
        the two can disagree and only one of them is the agreement.

        The option is looked up by the id the server returned. The mark is deliberately
        left empty: the stroke just drawn was never stored, and painting it next to the
        earlier reference would produce a PDF showing a signature that is not the one on
        file. The name and email fields are the earlier signer's as far as the record goes,
        so they are not claimed either.
      */
      if (result.alreadySigned) {
        const recorded = options.find(o => o.id === result.recordedOptionId) ?? null;
        setReference(result.reference);
        setSignedOption(recorded);
        setSignedName('');
        setSignedTitle('');
        setSignedEmail('');
        setSignedImage('');
        setSignedAt(result.recordedAt ?? '');
        setWasAlreadySigned(true);
        setState('done');
        onSigned();
        return;
      }

      setReference(result.reference);
      setSignedOption(selectedOption ?? null);
      setSignedName(trimmedName);
      setSignedTitle(roleTitle.trim());
      setSignedEmail(trimmedEmail);
      /* The posted image, not a fresh export: the record on the page has to be the record
         that was sent, and the pad it came from is about to be unmounted. */
      setSignedImage(drawing);
      setSignedAt(clientTime);
      setState('done');
      onSigned();
      return;
    }
    // Nothing typed or drawn is touched here. An error must cost the client a button
    // press, not their signature.
    setState('error');
    setErrorMessage(result.error ?? 'The signature was not recorded. Please press Sign again.');
  };

  return (
    <section className="pr-sign" id="signature" tabIndex={-1} aria-labelledby="signature-h">
      <span className="pr-sec-n" aria-hidden="true">{n}</span>
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
        /* tabIndex -1 so success can be handed to the reader. It is focused, never
           tabbed to: a receipt is not a control. */
        <div className="pr-sign-done" ref={doneRef} tabIndex={-1}>
          <div className="pr-sign-record">
            {signedImage ? (
              <img
                className="pr-sign-record-img"
                src={signedImage}
                alt={`Signature of ${signedName}`}
              />
            ) : null}
            <div className="pr-sign-record-line" aria-hidden="true" />
            <dl className="pr-kv pr-sign-record-fields">
              {/* Empty only on an already-signed reply, where the name on file belongs to
                  the earlier signing and this page was never told it. Same treatment as
                  Title: the row is not drawn rather than printed as a leader into a gap. */}
              {signedName ? (
                <div className="r">
                  <dt>Signed by</dt>
                  <span className="leader" aria-hidden="true" />
                  <dd>{signedName}</dd>
                </div>
              ) : null}
              {/* Title is the one field the form does not insist on, so the row is not
                  drawn at all rather than printed with a dot leader running into a gap. */}
              {signedTitle ? (
                <div className="r">
                  <dt>Title or role</dt>
                  <span className="leader" aria-hidden="true" />
                  <dd>{signedTitle}</dd>
                </div>
              ) : null}
              {signedEmail ? (
                <div className="r">
                  {/* Not "Copy sent to". Nothing in the system emails the signer, and a
                      receipt that states a delivery that did not happen is the one line on
                      this page that could be held against it. */}
                  <dt>Recorded against</dt>
                  <span className="leader" aria-hidden="true" />
                  <dd>{signedEmail}</dd>
                </div>
              ) : null}
              <div className="r">
                <dt>Signed on</dt>
                <span className="leader" aria-hidden="true" />
                <dd>{formatSignedAt(signedAt)}</dd>
              </div>
              <div className="r">
                <dt>Reference</dt>
                <span className="leader" aria-hidden="true" />
                <dd>{reference}</dd>
              </div>
              <div className="r">
                <dt>Option accepted</dt>
                <span className="leader" aria-hidden="true" />
                <dd>{signedOption ? signedOption.name : ''}</dd>
              </div>
            </dl>
          </div>
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

          {/*
            Print only, and deliberately absent from the screen.

            Printing this page and signing it by hand is a live delivery path: the worker
            that records a signature is not deployed yet, so for now it is the ONLY path.
            On paper the pad became an unlabelled box with nowhere to write a date and
            nothing tying the sheet to the proposal, because on screen the date is stamped
            by the server and the reference only arrives with the receipt. Neither exists
            on a page nobody has submitted, so both are drawn here for the printed copy.

            aria-hidden and no tab stop: on screen this is not there at all, and a screen
            reader should not meet a field that only exists on paper.
          */}
          <div className="pr-sign-hand" aria-hidden="true">
            <div className="r">
              <span className="k">Date signed</span>
              <span className="v" />
            </div>
            <div className="r">
              <span className="k">Proposal reference</span>
              <span className="v v--filled">{slug}</span>
            </div>
          </div>

          {/* The way out for someone who cannot draw is said here, in text everybody
              reaches. It used to be said only inside the canvas aria-label, and the canvas
              is not a tab stop, so a screen reader user in forms mode met a "Clear
              signature" button with nothing having told them what there was to clear. */}
          <p className="pr-sign-hint">
            {useTypedSignature
              ? 'Your typed name is being used as your signature. Untick the box to draw instead.'
              : 'Draw your signature in the box, or tick the box below to sign with your typed name instead.'}
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
            {/*
              The label wraps the box, the way the option radios above already do, so the
              whole row is the target rather than a 17px square and a line of text. This
              is the accessible path to signing, the control a client uses precisely
              because a fingertip cannot draw a usable mark, so it is the last control on
              the page that should be hard to hit.

              The height is set here rather than in the stylesheet because the 44px floor
              is behaviour, not decoration, and it must hold even if the row's styling
              changes. No colour is set: those stay in the tokens.
            */}
            <label
              htmlFor="pr-sign-typed"
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minHeight: '44px' }}
            >
              {/* Ticking this used to empty strokesRef, and the strokes are the only copy
                  of the ink, so a client who ticked the box to see what it did lost the
                  signature they had just drawn, with no warning and no way back. The
                  strokes are kept now: padDisabled stops any further drawing and the
                  painter shows the typed mark instead, so unticking restores the drawing. */}
              <input
                id="pr-sign-typed"
                type="checkbox"
                checked={useTypedSignature}
                disabled={locked}
                onChange={event => setUseTypedSignature(event.target.checked)}
              />
              <span>Use my typed name as my signature</span>
            </label>
          </div>

          <div className="pr-sign-fields">
            <div className="pr-field">
              <label htmlFor="pr-sign-name">Full name</label>
              <input
                id="pr-sign-name"
                type="text"
                autoComplete="name"
                maxLength={MAX_NAME}
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
                maxLength={MAX_TITLE}
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
                maxLength={MAX_EMAIL}
                value={email}
                disabled={locked}
                onChange={event => setEmail(event.target.value)}
              />
            </div>
          </div>

          {/* Stays enabled while the request is in flight. Disabling the control that has
              focus blurs it to <body>, which drops a keyboard user at the top of a
              12,000px document at the exact moment the answer arrives. handleSubmit
              refuses a second press instead. */}
          {/* The spinner is aria-hidden and carries no text of its own. What a screen
              reader gets is the live region below, which already announces "Signing your
              acceptance now": a second announcement from inside the button would say the
              same thing twice, half a second apart. The word stays next to it because a
              lone spinner on a page this quiet reads as something being wrong. */}
          <button type="submit" className="pr-sign-submit" disabled={submitDisabled} aria-busy={state === 'submitting'}>
            {state === 'submitting' ? (
              <>
                <span className="pr-sign-spin" aria-hidden="true" />
                Signing
              </>
            ) : 'Sign and accept'}
          </button>
        </form>
      )}

      {/* One live region, outside both branches, so the same node survives the swap from
          the form to the receipt and success is announced rather than silently replacing
          the region that would have announced it. It carries the reason the button is off,
          the reason an attempt failed, and the confirmation, so a screen reader hears the
          change whichever way it goes. */}
      <p className="pr-sign-state" role="status" aria-live="polite">
        {liveMessage()}
      </p>

      <p className="pr-sign-note">
        {state === 'done'
          ? wasAlreadySigned
            ? 'This proposal was already signed, so this attempt was not recorded and the acceptance above still stands. If it names the wrong option, reply to the email this proposal arrived in rather than signing again, because signing again will keep returning this same record.'
            : 'Keep the reference. This proposal has been signed and cannot be signed again from this page.'
          : signature.note}
      </p>

      {/*
        How to keep a copy, shown only after signing.

        Nothing emails the client. Not this page, not the worker, which only notifies Joji.
        So without this line a person signs, sees a receipt, closes the tab and has nothing,
        and the one control that would have given them a copy is a button they have already
        scrolled past and have no reason to press now that they are finished.

        It names the destination step deliberately. The button opens the browser's print
        dialog, and a print dialog opens on whatever that person last printed to, which for
        most people is a printer. No page can preselect "Save as PDF": the destination
        belongs to the browser and there is no web API that reaches it. So the choice has to
        be described rather than made for them.

        Not worded as "at the top of the page" on purpose: that bar is pinned to the top on
        a laptop and to the BOTTOM edge on a phone, so naming a position would be wrong for
        half the readers. The button's own label is the only reliable landmark.
      */}
      {/* Not shown on an already-signed reply: that page holds no signature image, so it
          would promise a PDF containing a mark the copy cannot contain. */}
      {state === 'done' && !wasAlreadySigned && (
        <p className="pr-sign-note pr-sign-copyhint">
          For your own copy, press <strong>Download PDF</strong> on this page, then set the
          destination to <strong>Save as PDF</strong>. The copy will include your signature
          and this receipt.
        </p>
      )}
    </section>
  );
};

export default SignatureBlock;
