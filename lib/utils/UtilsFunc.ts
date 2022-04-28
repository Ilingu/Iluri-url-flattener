/**
 * Check If it's a valid HTTP URL (https://www.example.com)
 * @param {string} urlToCheck
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

/**
 * Return Formatted Url
 * @param {string} url
 * @returns {URL} `URL` type
 */
export const ReturnFormattedUrl = (url: string): URL => {
  try {
    return new URL(url);
  } catch (_) {
    return new URL("https://www.exemple.com");
  }
};

/**
 * Format Data To JSON
 * @param {any} data
 * @returns {any} `json`
 */
export const FormatDataToJSON = (data: any): any => ({
  ...data,
  createAt: data.createAt.getTime(),
  updateAt: data.updateAt.getTime(),
});
