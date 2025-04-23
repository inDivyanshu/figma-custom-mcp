const axios = require('axios');

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

module.exports = { fetchFigmaFile };
