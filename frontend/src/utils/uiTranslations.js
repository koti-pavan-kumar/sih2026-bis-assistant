import partA from './uiTranslationsA'
import partB from './uiTranslationsB'
import partC from './uiTranslationsC'

/**
 * UI strings checked FIRST by t(). translations.js holds the older key set
 * (and the English fallback), this holds the chrome/Auto-Fetch keys for all
 * 19 selectable languages — including sd/doi/gom/mai which had no block there.
 */
export const uiTranslations = { ...partA, ...partB, ...partC }

export default uiTranslations
