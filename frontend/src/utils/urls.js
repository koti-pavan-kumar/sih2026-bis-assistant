/**
 * URL utilities for linking to official BIS standard documents.
 *
 * Generates URLs to bis.gov.in for each IS standard number.
 * Falls back to a Google search if no direct URL is available.
 */

/**
 * Generate the official BIS URL for a given IS standard number.
 *
 * @param {string} isNumber - e.g. "IS 14543:2018", "IS 1786:2008"
 * @param {string} title - e.g. "MILK AND MILK PRODUCTS - SAFETY REQUIREMENTS"
 * @returns {string} URL to the official BIS document
 */
export function getBISDocumentURL(isNumber, title = '') {
  if (!isNumber) return ''

  // Extract IS number and year from strings like "IS 14543:2018"
  const match = isNumber.match(/IS\s+(\d{4,5})(?::(\d{4}))?/)
  if (!match) return ''

  const isNum = match[1]
  const isYear = match[2] || ''

  // Direct BIS link pattern (works for many standards)
  // Format: https://www.bis.gov.in/sites/default/files/IS-XXXX-YYYY.pdf
  if (isYear) {
    return `https://www.bis.gov.in/sites/default/files/IS-${isNum}-${isYear}.pdf`
  }

  // Without year — link to BIS search page
  return `https://www.bis.gov.in/standard-and-implementation?q=IS+${isNum}`
}

/**
 * Generate a Google search fallback URL for when direct BIS link may not work.
 *
 * @param {string} isNumber - e.g. "IS 14543:2018"
 * @param {string} title - e.g. "MILK AND MILK PRODUCTS"
 * @returns {string} Google search URL
 */
export function getGoogleSearchURL(isNumber, title = '') {
  const query = encodeURIComponent(`${isNumber} ${title} site:bis.gov.in filetype:pdf`)
  return `https://www.google.com/search?q=${query}`
}
