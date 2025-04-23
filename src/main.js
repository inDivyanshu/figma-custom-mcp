/**
 * @file main.js
 * Entry point for extracting and displaying Figma design tokens (typography or base theme).
 *
 * Loads Figma credentials from environment variables and orchestrates the extraction process.
 *
 * Usage:
 *   node src/main.js typography   # Extracts unique typography details
 *   node src/main.js base-theme   # Extracts sorted base theme tokens (color & typography)
 */

require('dotenv').config();
const { fetchFigmaFile } = require('./services/figmaApi');
const { extractTypography, getUniqueFonts } = require('./features/typography');
const { extractAndSortBaseThemeTokens } = require('./features/baseTheme');
const getUniqueColorScheme = require('./features/baseTheme/getUniqueColorScheme');

const FILE_ID = process.env.FILE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function runTypography() {
    const fileData = await fetchFigmaFile(FILE_ID, ACCESS_TOKEN);
    if (!fileData) return;
    const document = fileData.document;
    const typographyDetails = extractTypography(document);
    const uniqueTypographyDetails = getUniqueFonts(typographyDetails);
    console.log("Typography Details:");
    console.log(JSON.stringify(uniqueTypographyDetails, null, 2));
    console.log('Count:', uniqueTypographyDetails.length);
}

async function runBaseTheme() {
    const fileData = await fetchFigmaFile(FILE_ID, ACCESS_TOKEN);
    if (!fileData) return;
    const tokens = extractAndSortBaseThemeTokens(fileData);
    console.log("Sorted Color Tokens (FILL):");
    console.log(tokens.colors);
    console.log("\nSorted Typography Tokens (TEXT):");
    console.log(tokens.typography);
}

async function runUniqueColorScheme() {
    const fileData = await fetchFigmaFile(FILE_ID, ACCESS_TOKEN);
    if (!fileData) return;
    // Traverse the document tree to collect all nodes with fills.
    function collectNodesWithFills(node, result = []) {
        if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
            result.push(node);
        }
        if (node.children) {
            node.children.forEach(child => collectNodesWithFills(child, result));
        }
        return result;
    }
    const nodesWithFills = collectNodesWithFills(fileData.document);
    const uniqueColorSchemes = getUniqueColorScheme(nodesWithFills);
    console.log("Unique Color Schemes:");
    console.log(JSON.stringify(uniqueColorSchemes, null, 2));
    console.log('Count:', uniqueColorSchemes.length);
}

// Select feature to run based on command-line argument
const mode = process.argv[2];
if (mode === 'base-theme') {
    runBaseTheme();
} else if (mode === 'unique-color-scheme') {
    runUniqueColorScheme();
} else {
    runTypography();
}
