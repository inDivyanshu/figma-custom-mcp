/**
 * @module features/baseTheme
 * Utilities for extracting and sorting base theme tokens (colors, typography) from Figma files.
 */

/**
 * Extracts base theme tokens from a Figma file response.
 * Focuses on extracting color tokens (FILL) and typography tokens (TEXT)
 * from the file's styles object. The tokens are then sorted by the token name.
 * @param {Object} fileData - The JSON data returned from the Figma file API.
 * @returns {Object} - An object containing sorted arrays for colors and typography tokens.
 */
function extractAndSortBaseThemeTokens(fileData) {
  const styles = fileData.styles || {};
  const tokens = {
    colors: [],      // For "FILL" style tokens
    typography: []   // For "TEXT" style tokens
  };

  // Loop over all style entries.
  for (const styleId in styles) {
    const style = styles[styleId];
    const token = {
      id: styleId,
      name: style.name,
      styleType: style.styleType
    };

    if (style.styleType === 'FILL') {
      tokens.colors.push(token);
    } else if (style.styleType === 'TEXT') {
      tokens.typography.push(token);
    }
    // You can add additional grouping (for grid or effects) as needed.
  }

  // Sort the tokens alphabetically by name
  tokens.colors.sort((a, b) => a.name.localeCompare(b.name));
  tokens.typography.sort((a, b) => a.name.localeCompare(b.name));

  return tokens;
}

module.exports = { extractAndSortBaseThemeTokens };
