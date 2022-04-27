/**
 * Check If it's a valid HTTP URL (https://www.example.com)
 * @param {URL} urlToCheck
 * @returns {boolean} `true` -- if it's a valid HTTP url
 */
export const IsURL = (urlToCheck: string): boolean => {
  try {
    new URL(urlToCheck); // If Not Valid, throw an error
    return true;
  } catch (_) {
    return false;
  }
};
