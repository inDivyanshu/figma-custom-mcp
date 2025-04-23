/**
 * Converts a Figma color object (with r, g, b, a in 0-1) to a hex string.
 * @param {{r: number, g: number, b: number, a?: number}} color - Figma color object.
 * @returns {string} Hex color string (e.g., #ff00aa)
 */
function figmaColorToHex(color) {
  const to255 = v => Math.round(Math.max(0, Math.min(1, v)) * 255);
  const r = to255(color.r);
  const g = to255(color.g);
  const b = to255(color.b);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

module.exports = figmaColorToHex;
