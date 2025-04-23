/**
 * Traverse the Figma document and extract CSS for status tags and buttons.
 * @param {Object} node - The root Figma node.
 * @returns {Array<{name: string, css: string}>} Array of extracted CSS blocks with node names.
 */
const figmaColorToHex = require('../../utils/figmaColorToHex');

function extractCssFromFigma(node) {
  const results = [];

  function traverse(current) {
    if (current.name && /status|tag|button/i.test(current.name)) {
      results.push({
        name: current.name,
        css: figmaNodeToCss(current)
      });
    }
    if (current.children) {
      current.children.forEach(traverse);
    }
  }

  traverse(node);
  return results;
}

// Helper to convert a Figma node to CSS string
function figmaNodeToCss(node) {
  let css = '';
  // Background (fill)
  if (node.fills && Array.isArray(node.fills) && node.fills[0] && node.fills[0].type === 'SOLID') {
    css += `background: ${figmaColorToHex(node.fills[0].color)};\n`;
  }
  // Border
  if (node.strokes && node.strokes[0] && node.strokes[0].type === 'SOLID') {
    css += `border: ${node.strokeWeight || 1}px solid ${figmaColorToHex(node.strokes[0].color)};\n`;
  }
  // Border radius
  if (node.cornerRadius !== undefined) {
    css += `border-radius: ${node.cornerRadius}px;\n`;
  }
  // Font styles (for TEXT nodes)
  if (node.type === 'TEXT' && node.style) {
    const s = node.style;
    if (s.fontFamily) css += `font-family: ${s.fontFamily};\n`;
    if (s.fontSize) css += `font-size: ${s.fontSize}px;\n`;
    if (s.fontWeight) css += `font-weight: ${s.fontWeight};\n`;
    if (s.letterSpacing !== undefined) css += `letter-spacing: ${s.letterSpacing}px;\n`;
    if (s.lineHeightPx !== undefined) css += `line-height: ${s.lineHeightPx}px;\n`;
    if (s.fill && s.fill.type === 'SOLID' && s.fill.color) {
      css += `color: ${figmaColorToHex(s.fill.color)};\n`;
    }
  }
  // Padding (if available)
  if (node.paddingLeft !== undefined) css += `padding-left: ${node.paddingLeft}px;\n`;
  if (node.paddingRight !== undefined) css += `padding-right: ${node.paddingRight}px;\n`;
  if (node.paddingTop !== undefined) css += `padding-top: ${node.paddingTop}px;\n`;
  if (node.paddingBottom !== undefined) css += `padding-bottom: ${node.paddingBottom}px;\n`;

  return css.trim();
}

module.exports = extractCssFromFigma;
