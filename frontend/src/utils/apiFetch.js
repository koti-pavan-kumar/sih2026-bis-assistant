/**
 * apiFetch — fetch() with cold-start awareness.
 *
 * The Render free-tier backend sleeps after 15 min of no traffic. The first
 * request after sleep takes ~60-90s (container boot + model load), and the
 * platform may briefly refuse connections while waking. A plain fetch() in
 * that window fails once and leaves pages empty forever.
 *
 * apiFetch retries with backoff so page loads ride out the wake-up:
 *   - network errors / timeouts / 5xx → retry (up to `attempts`)
 *   - 4xx (except 429) → no point retrying, return as-is
 *
 * First attempt gets a long timeout (75s) so it can absorb a full cold start;
 * later attempts use shorter timeouts since the wake is already in progress.
 */

const WAKE_TIMEOUT_MS = 75000 // long enough for a Render cold start
const RETRY_TIMEOUT_MS = 30000
const RETRY_DELAYS_MS = [3000, 6000] // pause between attempts

export default async function apiFetch(url, options = {}) {
  const { attempts = 3, timeoutMs, ...init } = options
  let lastError

  for (let attempt = 0; attempt < attempts; attempt++) {
    const signal = AbortSignal.timeout(
      timeoutMs ??
      (attempt === 0 ? WAKE_TIMEOUT_MS : RETRY_TIMEOUT_MS)
    )

    try {
      const res = await fetch(url, { ...init, signal })

      // Retry-worthy server errors (gateway blips while backend boots)
      if (res.status >= 500 && attempt < attempts - 1) {
        lastError = new Error(`HTTP ${res.status}`)
        await delay(RETRY_DELAYS_MS[attempt] ?? 5000)
        continue
      }

      return res
    } catch (err) {
      // TimeoutError / TypeError (network refused) → backend likely sleeping
      lastError = err
      if (attempt < attempts - 1) {
        await delay(RETRY_DELAYS_MS[attempt] ?? 5000)
        continue
      }
    }
  }

  throw lastError ?? new Error('apiFetch failed')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
