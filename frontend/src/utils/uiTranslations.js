import partA from './uiTranslationsA'
import partB from './uiTranslationsB'
import partC from './uiTranslationsC'
import partD from './uiTranslationsD'

/**
 * UI strings checked FIRST by t(). translations.js holds the older key set
 * (and the English fallback), this holds the chrome/Auto-Fetch keys for all
 * 23 selectable languages (22 Indian + English). part C adds sd/doi/gom/mai,
 * part D adds the four newest languages bo/ks/mn/sat (partial — missing keys
 * fall back to English per key).
 */
export const uiTranslations = { ...partA, ...partB, ...partC, ...partD }

export default uiTranslations
