/**
 * URL utilities for linking to official BIS standard documents.
 *
 * Why not just link www.bis.gov.in? Because bis.gov.in is a single-page app:
 * EVERY unknown path silently redirects to its homepage (verified — both
 * /sites/default/files/IS-456-2000.pdf and /standard-and-implementation?q=...
 * land on https://www.bis.gov.in/?lang=hi).
 *
 * The official per-standard page (standards.bis.gov.in .../standard-details)
 * requires a server-encrypted `encryptedId` blob that cannot be constructed
 * client-side (verified — plain ?standardNumber=... returns "No record found").
 *
 * So we use a two-step strategy:
 *   1. Known direct PDFs of the actual standard text (open-access mirror of
 *      BIS documents at law.resource.org — verified live for these entries)
 *   2. The official BIS portal's pre-filtered search page, which opens with
 *      the exact IS number already searched and the right standard listed first
 */

/** IS numbers whose full document PDF is available on the open mirror (verified). */
const DIRECT_PDF_SERIES = {
  'IS 456:2000': 'S03',
  'IS 455:1989': 'S03',
  'IS 1786:2008': 'S03',
  'IS 10500:2012': 'S06',
  'IS 16001:2012': 'S07',
  'IS 2062:2011': 'S10',
}

/**
 * Generate the best URL for a given IS standard.
 *
 * Prefers a direct link to the actual standard document; otherwise lands on
 * the official BIS standards portal with that IS number pre-searched.
 *
 * @param {string} isNumber - e.g. "IS 14543:2018", "IS 1786:2008"
 * @param {string} title - e.g. "MILK AND MILK PRODUCTS - SAFETY REQUIREMENTS"
 * @returns {string} URL to the standard's document or its official BIS entry
 */
export function getBISDocumentURL(isNumber, title = '') {
  if (!isNumber) return ''

  // Extract IS number and year from strings like "IS 14543:2018".
  // Numbers can be 3-5 digits (IS 456, IS 6307, IS 18841).
  const match = isNumber.match(/IS\s+(\d{3,5})(?::(\d{4}))?/)
  if (!match) return ''

  const isNum = match[1]
  const isYear = match[2] || ''
  const key = `IS ${isNum}${isYear ? `:${isYear}` : ''}`

  // 1. Direct PDF of the full standard text (verified open-access mirror)
  const series = DIRECT_PDF_SERIES[key]
  if (series && isYear) {
    return `https://law.resource.org/pub/in/bis/${series}/is.${isNum}.${isYear}.pdf`
  }

  // 2. Official BIS portal with the standard number pre-searched
  //    (verified: opens the results list with the exact standard first)
  return `https://standards.bis.gov.in/website/know-your-standards?searchTerm=IS%20${isNum}`
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
