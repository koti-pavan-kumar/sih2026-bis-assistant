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

  // Extract IS number and year. Handles canonical "IS 14543:2018" as well as
  // the model's split-part quirks: "IS 1454 3:2018" (→ IS 14543:2018) and
  // "IS 1574 2" / "IS 1489 (Part 1):1991" (→ base number for portal search).
  let match = isNumber.match(/IS\s+(\d{3,5})\s+(\d)\s*:\s*(\d{4})/) // "IS 1454 3:2018"
  let isNum, isYear
  if (match) {
    isNum = `${match[1]}${match[2]}`
    isYear = match[3]
  } else {
    match = isNumber.match(/IS\s+(\d{3,5})(?::(\d{4}))?/)
    if (!match) return ''
    isNum = match[1]
    isYear = match[2] || ''
  }
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
