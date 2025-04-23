/**
 * @module features/typography
 * Utilities for extracting and grouping typography details from Figma nodes.
 *
 * Exports:
 *   - extractTypography: Recursively extracts all TEXT nodes with style info.
 *   - getUniqueFonts: Groups unique font families and styles, assigns order labels.
 */

const getOrderLabel = require('../../utils/getOrderLabel');

/**
 * Recursively extracts typography details from the document node.
 * @param {Object} node - A node in the Figma document.
 * @returns {Array<Object>} - Array of TEXT nodes with style details.
 */
function extractTypography(node) {
    let customNodes = [];
    if (node.type === 'TEXT' && node.style) {
        customNodes.push(node);
    }
    if (node.children) {
        node.children.forEach(child => {
            customNodes = customNodes.concat(extractTypography(child));
        });
    }
    return customNodes;
}

/**
 * Groups and filters unique font families and their styles from Figma TEXT nodes.
 * @param {Array<Object>} nodes - Array of Figma TEXT nodes.
 * @returns {Array<Object>} - Array of unique font families with styles and order labels.
 */
function getUniqueFonts(nodes) {
    const familyMap = new Map();
    nodes.forEach(node => {
        if (node.type !== 'TEXT' || !node.style) return;
        const { fontFamily, fontStyle, fontWeight } = node.style;
        if (!familyMap.has(fontFamily)) {
            familyMap.set(fontFamily, { count: 0, styles: new Map() });
        }
        const fontRecord = familyMap.get(fontFamily);
        fontRecord.count++;
        const styleKey = `${fontStyle}|${fontWeight}`;
        if (!fontRecord.styles.has(styleKey)) {
            fontRecord.styles.set(styleKey, { fontStyle, fontWeight });
        }
    });
    const families = [];
    for (const [family, { count, styles }] of familyMap.entries()) {
        families.push({
            fontFamily: family,
            count,
            styles: Array.from(styles.values())
        });
    }
    families.sort((a, b) => b.count - a.count);
    families.forEach((fam, index) => {
        fam.orderLabel = getOrderLabel(index + 1);
    });
    return families.map(f => ({
        fontFamily: f.fontFamily,
        orderLabel: f.orderLabel,
        styles: f.styles
    }));
}

module.exports = {
    extractTypography,
    getUniqueFonts
};
