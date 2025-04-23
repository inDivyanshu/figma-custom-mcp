/**
 * @module utils/getOrderLabel
 * Returns an ordinal order label for the given number.
 * For 1, 2, and 3, it returns "Primary", "Secondary", and "Tertiary" respectively.
 * For numbers greater than 3, it returns the number with an ordinal suffix (e.g., "4th", "5th").
 *
 * @param {number} n - The position (1-indexed).
 * @returns {string} - The order label.
 */
function getOrderLabel(n) {
    if (n === 1) return "Primary";
    if (n === 2) return "Secondary";
    if (n === 3) return "Tertiary";

    // For n > 3, dynamically create an ordinal suffix.
    let j = n % 10,
        k = n % 100;
    if (j === 1 && k !== 11) {
        return n + "st";
    }
    if (j === 2 && k !== 12) {
        return n + "nd";
    }
    if (j === 3 && k !== 13) {
        return n + "rd";
    }
    return n + "th";
}