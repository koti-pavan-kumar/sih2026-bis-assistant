import React, { useState, useEffect, useCallback } from 'react'

/**
 * ConnectionStatus — polls /api/health to show backend connection state.
 * Shows: connected (green), disconnected (red), checking (yellow).
 * 
 * Props:
 * - onHealthUpdate: (health: object | null) => void — called when health data changes
 */
export default function ConnectionStatus({ onHealthUpdate }) {
  const [status, setStatus] = useState('checking') // 'connected' | 'disconnected' | 'checking'
  const [health, setHealth] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5s timeout for health check
      })
      
      if (res.ok) {
        const data = await res.json()
        setHealth(data)
        setStatus('connected')
        onHealthUpdate?.(data)
      } else {
        setHealth(null)
        setStatus('disconnected')
        onHealthUpdate?.(null)
      }
    } catch (err) {
      setHealth(null)
      setStatus('disconnected')
      onHealthUpdate?.(null)
    }
    setLastChecked(new Date())
  }, [onHealthUpdate])

  // Check on mount
  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [checkHealth])

  const statusConfig = {
    connected: {
      color: 'text-green-300',
      dot: 'bg-green-400',
      label: 'Connected',
      details: health ? `${health.standards} standards • ${health.indexed_chunks} chunks` : ''
    },
    disconnected: {
      color: 'text-red-300',
      dot: 'bg-red-400',
      label: 'Disconnected',
      details: 'Backend not reachable'
    },
    checking: {
      color: 'text-yellow-300',
      dot: 'bg-yellow-400 animate-pulse',
      label: 'Checking...',
      details: ''
    }
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      {/* Status dot */}
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      
      {/* Status text */}
      <span className={`text-xs ${config.color}`}>
        {config.label}
      </span>

      {/* Details on hover */}
      {config.details && (
        <span className="text-xs text-blue-200 hidden lg:inline">
          {config.details}
        </span>
      )}

      {/* Manual refresh button */}
      <button
        onClick={checkHealth}
        className="text-blue-200 hover:text-white transition text-xs"
        title="Refresh connection status"
      >
        ↻
      </button>
    </div>
  )
}
