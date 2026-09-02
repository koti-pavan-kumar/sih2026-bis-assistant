import React, { useState, useEffect, useCallback } from 'react'
import { t } from '../utils/translations'

/**
 * ConnectionStatus — polls /api/health to show backend connection state.
 */
export default function ConnectionStatus({ onHealthUpdate, language = 'en' }) {
  const [status, setStatus] = useState('checking')
  const [health, setHealth] = useState(null)

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
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
  }, [onHealthUpdate])

  // Check on mount only once
  useEffect(() => {
    checkHealth()
  }, []) // Empty deps - only on mount

  // Poll every 60 seconds (not 30)
  useEffect(() => {
    const interval = setInterval(checkHealth, 60000)
    return () => clearInterval(interval)
  }, []) // Empty deps - stable interval

  const statusConfig = {
    connected: {
      color: 'text-green-300',
      dot: 'bg-green-400',
      label: t('connected', language),
      details: health ? `${health.standards} standards • ${health.indexed_chunks} chunks` : ''
    },
    disconnected: {
      color: 'text-red-300',
      dot: 'bg-red-400',
      label: t('disconnected', language),
      details: t('backendNotReachable', language)
    },
    checking: {
      color: 'text-yellow-300',
      dot: 'bg-yellow-400 animate-pulse',
      label: t('checking', language),
      details: ''
    }
  }

  const config = statusConfig[status]

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
        onClick={checkHealth}
        className="text-blue-200 hover:text-white transition text-xs"
        title="Refresh connection status"
      >
        ↻
      </button>
    </div>
  )
}
