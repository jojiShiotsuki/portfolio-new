import { useEffect } from 'react';

/*
  Magnetic buttons. The accent fill blooms out of the exact point the cursor entered
  and tracks it, the button leans toward the pointer, and the label trails behind.

  Only for a real pointer: a touch device has no hover to track, and anyone who has
  asked for less motion should not get a button that chases them. The CSS carries a
  plain left-to-right fill for those cases.
*/
export const useMagneticButtons = (deps: unknown[] = []): void => {
  useEffect(() => {
    if (!window.matchMedia) return;
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const buttons = Array.from(document.querySelectorAll<HTMLElement>('.mono .btn'));
    const teardown: (() => void)[] = [];

    buttons.forEach(btn => {
      const inner = btn.querySelector<HTMLElement>('.btn-in');

      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        btn.style.setProperty('--mx', `${x.toFixed(1)}px`);
        btn.style.setProperty('--my', `${y.toFixed(1)}px`);
        const dx = ((x - r.width / 2) / r.width) * 12;   // how far the button leans
        const dy = ((y - r.height / 2) / r.height) * 8;
        btn.style.setProperty('--lean-x', `${dx.toFixed(1)}px`);
        btn.style.setProperty('--lean-y', `${dy.toFixed(1)}px`);
        if (inner) {
          inner.style.setProperty('--trail-x', `${(dx * -0.35).toFixed(1)}px`);
          inner.style.setProperty('--trail-y', `${(dy * -0.35).toFixed(1)}px`);
        }
      };

      const onLeave = () => {
        // --mx/--my are left where they were, so the bloom shrinks back to the exit point
        btn.style.removeProperty('--lean-x');
        btn.style.removeProperty('--lean-y');
        if (inner) {
          inner.style.removeProperty('--trail-x');
          inner.style.removeProperty('--trail-y');
        }
      };

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      teardown.push(() => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => teardown.forEach(fn => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
