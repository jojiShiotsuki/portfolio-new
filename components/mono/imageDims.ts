/*
  Real pixel sizes of the project screenshots in public/.
  Explicit width/height on a lazy image is what reserves its space before it loads.
  Without it the case-study page grows as you scroll, and an in-page anchor lands on
  whatever happened to be at that offset when the jump was calculated.

  Measured from the files, not guessed. Re-measure if a screenshot is replaced.
*/
const DIMS: Record<string, [number, number]> = {
  'abacus-screenshot.webp': [1689, 1277],
  'correct-electric-screenshot.webp': [1689, 1277],
  'knockknock-screenshot.webp': [1689, 1277],
  'kontentfire-screenshot.webp': [1823, 1304],
  'maidtoplease-screenshot.webp': [1818, 1277],
  'mimis-screenshot.webp': [1440, 900],
  'perth-video-screenshot.webp': [1823, 1304],
  'pundok-screenshot.webp': [1689, 1277],
  'samantha-angeli-screenshot.webp': [1700, 1088],
  'spark-your-designs-screenshot.webp': [1689, 1277],
  'spectrum-screenshot.webp': [1440, 900],
  'tradetitans-screenshot.webp': [1818, 1277],
  'tru-screenshot.webp': [1440, 900],
  'vertex-screenshot.webp': [1823, 1304],
  'wecoat-screenshot.webp': [1440, 900],
  'youpercent-screenshot.webp': [1818, 1277],
};

/* '/pundok-screenshot.webp' -> { width, height }, or empty if the file is unknown. */
export const dimsFor = (src?: string): { width?: number; height?: number } => {
  if (!src) return {};
  const file = src.replace(/^\//, '');
  const d = DIMS[file];
  return d ? { width: d[0], height: d[1] } : {};
};
