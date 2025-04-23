/**
 * Extracts unique color schemes (solid and gradient) from Figma nodes.
 * Groups by color/gradient value, counts usage, sorts by frequency, and assigns order labels.
 *
 * @param {Array<Object>} nodes - Array of Figma nodes (with fills).
 * @returns {Array<Object>} - Array of unique color tokens with type, value, and orderLabel.
 */
const getOrderLabel = require('../../utils/getOrderLabel');
const figmaColorToHex = require('../../utils/figmaColorToHex');

function getUniqueColorScheme(nodes) {
  const tokenMap = new Map();

  nodes.forEach(node => {
    if (!node.fills || !Array.isArray(node.fills) || node.fills.length === 0) return;

    const fill = node.fills[0];
    let key = "";
    let tokenData = null;

    if (fill.type === "SOLID" && fill.color) {
      // Handle SOLID fill.
      key = figmaColorToHex(fill.color);
      tokenData = { type: "SOLID", value: key };
    } else if (fill.type.startsWith("GRADIENT") && fill.gradientStops) {
      // Handle gradient fill: extract and sort gradient stops.
      const stops = fill.gradientStops.map(stop => ({
        position: stop.position,
        color: figmaColorToHex(stop.color)
      }));
      stops.sort((a, b) => a.position - b.position);
      // Create a composite key from stops.
      key = stops.map(stop => `${stop.position}:${stop.color}`).join("|");
      tokenData = { type: fill.type, value: stops };
    } else {
      // If not SOLID or supported gradient, skip.
      return;
    }

    if (tokenMap.has(key)) {
      tokenMap.get(key).count++;
    } else {
      tokenMap.set(key, { tokenData, count: 1 });
    }
  });

  // Convert the token map to an array.
  const tokens = Array.from(tokenMap.values());

  // Sort tokens by descending usage frequency.
  tokens.sort((a, b) => b.count - a.count);

  // Assign dynamic order labels.
  tokens.forEach((token, index) => {
    token.orderLabel = getOrderLabel(index + 1);
  });

  // Construct final output: include only the token data (type and value) and orderLabel.
  return tokens.map(token => ({
    type: token.tokenData.type,
    value: token.tokenData.value,
    orderLabel: token.orderLabel
  }));
}

module.exports = getUniqueColorScheme;
