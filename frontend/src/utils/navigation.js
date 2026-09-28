/**
 * goBack — history-aware back navigation for back arrows.
 *
 * Goes to the immediately previous page via the browser history (entries are
 * recorded by App's navigate()). If there is no in-app history entry (e.g.
 * the page was opened directly), falls back to navigating to `fallbackPage`.
 *
 * @param {Function} onNavigate - App navigate function (for the fallback)
 * @param {string} fallbackPage - page to open when no history entry exists
 */
export function goBack(onNavigate, fallbackPage = 'landing') {
  if (window.history.state && window.history.state.mm) {
    window.history.back()
  } else if (onNavigate) {
    onNavigate(fallbackPage)
  }
}
