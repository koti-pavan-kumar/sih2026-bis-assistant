import React, { useState, useEffect, useCallback, useRef } from 'react'
import { t } from '../utils/translations'

/**
 * ConnectionStatus — polls /api/health to show backend connection state.
 *
 * Render's free tier sleeps after 15 minutes with no traffic. Waking takes
 * ~60-90s (container boot + ONNX model + FAISS load), so a naive 5-second
 * health check always fails and the UI sticks on "Disconnected" forever.
 *
 * Strategy:
 *   - healthy:  poll every 60s with a 10s timeout
 *   - failed:   enter "waking" state, retry every 4s with a 75s timeout
 *               (the long request itself keeps Render's boot alive; the
 *               moment boot finishes it answers 200 and we go green)
 *   - woke up:  back to normal polling
 */
const HEALTHY_POLL_MS = 60000
const HEALTHY_TIMEOUT_MS = 10000
const WAKE_RETRY_MS = 4000
const WAKE_TIMEOUT_MS = 75000
const MAX_WAKE_ATTEMPTS = 8 // ~8 long tries before declaring unreachable

export default function ConnectionStatus({ onHealthUpdate, language = 'en' }) {
  const [status, setStatus] = useState('checking') // checking | connected | waking | unreachable
  const [health, setHealth] = useState(null)
  const timerRef = useRef(null)
  const aliveRef = useRef(true)
  const inFlightRef = useRef(false)
  const wakeAttemptsRef = useRef(0)

  const checkHealth = useCallback(async ({ waking }) => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    const timeoutMs = waking ? WAKE_TIMEOUT_MS : HEALTHY_TIMEOUT_MS

    try {
      const res = await fetch('/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(timeoutMs)
      })

      if (res.ok) {
        const data = await res.json()
        if (!aliveRef.current) return
        const wasWaking = wakeAttemptsRef.current > 0
        wakeAttemptsRef.current = 0
        setHealth(data)
        setStatus('connected')
        onHealthUpdate?.(data)
        // back to gentle polling
        schedule(wasWaking ? 0 : HEALTHY_POLL_MS, false)
        return
      }
      throw new Error(`HTTP ${res.status}`)
    } catch {
      if (!aliveRef.current) return
      setHealth(null)
      onHealthUpdate?.(null)

      if (waking) {
        wakeAttemptsRef.current += 1
        if (wakeAttemptsRef.current >= MAX_WAKE_ATTEMPTS) {
          setStatus('unreachable')
          // keep trying, just less often
          schedule(HEALTHY_POLL_MS, false)
          return
        }
        setStatus('waking')
        schedule(WAKE_RETRY_MS, true)
      } else {
        // first failure while polling → backend went to sleep, start waking
        setStatus('waking')
        schedule(WAKE_RETRY_MS, true)
      }
    } finally {
      inFlightRef.current = false
    }
  }, [onHealthUpdate])

  const schedule = useCallback((ms, waking) => {
    if (!aliveRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => checkHealth({ waking }), ms)
  }, [checkHealth])

  // initial check on mount
  useEffect(() => {
    aliveRef.current = true
    // Long timeout from the start: if the backend is asleep, this very request
    // triggers the wake and holds open until it's ready to answer.
    checkHealth({ waking: true })
    return () => {
      aliveRef.current = false
      clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusConfig = {
    connected: {
      color: 'text-green-300',
      dot: 'bg-green-400',
      label: t('connected', language),
      details: health ? `${health.standards} standards • ${health.indexed_chunks} chunks` : ''
    },
    waking: {
      color: 'text-yellow-200',
      dot: 'bg-yellow-400 animate-pulse',
      label: t('wakingUp', language),
      details: t('wakingUpDetails', language)
    },
    unreachable: {
      color: 'text-red-300',
      dot: 'bg-red-400',
      label: t('disconnected', language),
      details: t('backendNotReachable', language)
    },
    checking: {
      color: 'text-yellow-200',
      dot: 'bg-yellow-400 animate-pulse',
      label: t('checking', language),
      details: ''
    }
  }

  const config = statusConfig[status] || statusConfig.checking

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      <span className={`text-xs ${config.color}`}>
        {config.label}
      </span>
      {config.details && (
        <span className="text-xs text-blue-200 hidden lg:inline">
          {config.details}
        </span>
      )}
      <button
        onClick={() => {
          wakeAttemptsRef.current = 0
          clearTimeout(timerRef.current)
          setStatus('checking')
          checkHealth({ waking: true })
        }}
        className="text-blue-200 hover:text-white transition text-xs"
        title="Refresh connection status"
      >
        ↻
      </button>
    </div>
  )
}
