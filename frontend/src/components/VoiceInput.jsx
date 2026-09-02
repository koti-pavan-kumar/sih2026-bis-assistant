import React, { useState, useRef, useCallback, useEffect } from 'react'

/**
 * VoiceInput component — captures voice input using Web Speech API.
 * Supports Hindi and English with automatic language switching.
 * 
 * Props:
 * - onResult: (text: string) => void — called with transcribed text
 * - disabled: boolean — disables the button during loading
 */
export default function VoiceInput({ onResult, disabled = false }) {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('hi-IN') // Default to Hindi for demo
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef(null)

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Voice input not supported in this browser. Use Chrome or Edge.')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'hi-IN' ? 'en-US' : 'hi-IN')
  }, [])

  const startListening = useCallback(() => {
    if (disabled || !isSupported) return

    setError(null)
    setInterimText('')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not available')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Configure recognition
    recognition.lang = language
    recognition.continuous = false // Single utterance
    recognition.interimResults = true // Show interim results
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      setInterimText(interim)

      if (final) {
        onResult(final.trim())
        setInterimText('')
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)

      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'audio-capture':
          setError('Microphone not found. Please check your audio settings.')
          break
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.')
          break
        case 'network':
          setError('Network error. Check your internet connection.')
          break
        case 'aborted':
          // User cancelled — no error to show
          break
        default:
          setError(`Voice error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Failed to start voice input. Please try again.')
      setIsListening(false)
    }
  }, [language, disabled, isSupported, onResult])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  if (!isSupported) {
    return null // Don't render if browser doesn't support it
  }

  return (
    <div className="flex items-center gap-2">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        disabled={isListening || disabled}
        className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
        title="Toggle voice language"
      >
        {language === 'hi-IN' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
      </button>

      {/* Microphone button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative p-2.5 rounded-xl transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse shadow-lg'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isListening ? 'Stop listening' : `Start voice input (${language === 'hi-IN' ? 'Hindi' : 'English'})`}
      >
        {isListening ? (
          // Stop icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Microphone icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}

        {/* Recording indicator pulse */}
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Interim text display */}
      {isListening && interimText && (
        <div className="text-xs text-gray-400 italic max-w-[200px] truncate">
          {interimText}...
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="text-xs text-red-500 max-w-[200px]">
          {error}
        </div>
      )}
    </div>
  )
}
