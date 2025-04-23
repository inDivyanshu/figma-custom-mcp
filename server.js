/**
 * @file server.js
 * Entry point for extracting and displaying unique typography details from a Figma file.
 *
 * Loads Figma credentials from environment variables and orchestrates the extraction process.
 */

require('dotenv').config();
const axios = require('axios');
const { extractTypography, getUniqueFonts } = require('./features/typography');

const FILE_ID = process.env.FILE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/**
 * Fetches the Figma file data using REST API.
 * @param {string} fileId - The Figma file ID.
 * @param {string} accessToken - Your Figma personal access token.
 * @returns {Promise<Object|null>} - Parsed JSON data from the file.
 */
async function fetchFigmaFile (fileId, accessToken) {
    const endpoint = `https://api.figma.com/v1/files/${fileId}`;
    try {
        const response = await axios.get(endpoint, {
            headers: { 'X-Figma-Token': accessToken }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Figma file:', error.message);
        return null;
    }
}

async function main () {
    const fileData = await fetchFigmaFile(FILE_ID, ACCESS_TOKEN);
    if (!fileData) return; // Exit if the file could not be fetched.

    // The root document node contains the design tree.
    const document = fileData.document;
    const typographyDetails = extractTypography(document);
    const uniqueTypographyDetails = getUniqueFonts(typographyDetails)
    console.log("Typography Details:");
    console.log(JSON.stringify(uniqueTypographyDetails));

    console.log(uniqueTypographyDetails.length);
}

main();
