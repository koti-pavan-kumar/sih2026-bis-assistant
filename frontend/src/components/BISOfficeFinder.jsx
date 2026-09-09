import React, { useState, useEffect, useCallback } from 'react'

const EMOJI_MAP = {
  "Headquarters": "🏛️",
  "Regional Office": "🏢",
  "Testing Lab": "🔬",
  "Hallmarking Centre": "💎"
}

const SERVICE_ICONS = {
  "Testing": "🧪",
  "Certification": "✅",
  "ISI Mark": "📋",
  "Hallmark": "💍",
  "Eco Mark": "🌿",
  "Standard Setting": "📝",
  "Policy": "⚖️"
}

/**
 * BISOfficeFinder — Find nearest BIS testing centers and offices.
 * Uses browser geolocation to find user's location and show nearby centers.
 */
export default function BISOfficeFinder({ language = 'en' }) {
  const [offices, setOffices] = useState([])
  const [categories, setCategories] = useState({})
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [searchState, setSearchState] = useState('')
  const [activeView, setActiveView] = useState('nearby') // nearby | categories | all

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
  ]

  // Fetch product categories on mount
  useEffect(() => {
    fetch('/api/bis-offices/categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories || {}))
      .catch(() => {})
  }, [])

  // Fetch all offices on mount
  useEffect(() => {
    fetchAllOffices()
  }, [])

  const fetchAllOffices = useCallback(async () => {
    try {
      const res = await fetch('/api/bis-offices')
      const data = await res.json()
      setOffices(data.offices || [])
    } catch (err) {
      console.error('Failed to fetch offices:', err)
    }
  }, [])

  const findNearby = useCallback(async () => {
    setLoading(true)
    setLocationError(null)
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        
        try {
          const res = await fetch(`/api/bis-offices?lat=${latitude}&lng=${longitude}&n=8`)
          const data = await res.json()
          setOffices(data.offices || [])
          setActiveView('nearby')
        } catch (err) {
          setLocationError('Failed to fetch nearby offices')
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        let msg = 'Unable to get your location'
        if (error.code === 1) msg = 'Location access denied. Please allow location access or search by state.'
        else if (error.code === 2) msg = 'Location unavailable. Try searching by state.'
        else if (error.code === 3) msg = 'Location request timed out. Try again.'
        setLocationError(msg)
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  const searchByState = useCallback(async (state) => {
    setSearchState(state)
    if (!state) {
      fetchAllOffices()
      return
    }
    try {
      const res = await fetch(`/api/bis-offices?state=${encodeURIComponent(state)}`)
      const data = await res.json()
      setOffices(data.offices || [])
      setActiveView('all')
    } catch (err) {
      console.error('Search failed:', err)
    }
  }, [fetchAllOffices])

  const openGoogleMaps = (office) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`
    window.open(url, '_blank')
  }

  const getDirections = (office) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`
    window.open(url, '_blank')
  }

  // Office detail modal
  if (selectedOffice) {
    return (
      <div className="h-full overflow-y-auto">
        <button
          onClick={() => setSelectedOffice(null)}
          className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mb-3"
        >
          ← Back to list
        </button>
        
        <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-2xl">{EMOJI_MAP[selectedOffice.type] || '🏢'}</span>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                {selectedOffice.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                {selectedOffice.type}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">📍</span>
              <span className="text-gray-700 dark:text-gray-300">{selectedOffice.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">📞</span>
              <a href={`tel:${selectedOffice.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {selectedOffice.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">✉️</span>
              <a href={`mailto:${selectedOffice.email}`} className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">
                {selectedOffice.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">🗺️</span>
              <span className="text-gray-600 dark:text-gray-400">
                Jurisdiction: {selectedOffice.jurisdiction}
              </span>
            </div>

            {selectedOffice.distance_km !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📏</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {selectedOffice.distance_km} km from you
                </span>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="mt-4">
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Services Available</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedOffice.services.map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  {SERVICE_ICONS[s] || '✓'} {s}
                </span>
              ))}
            </div>
          </div>

          {/* Product Categories */}
          {selectedOffice.product_categories && (
            <div className="mt-3">
              <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Products Tested</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOffice.product_categories.map((p, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => getDirections(selectedOffice)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1a2744] hover:bg-[#2c3e6b] text-white transition"
            >
              🧭 Get Directions
            </button>
            <button
              onClick={() => openGoogleMaps(selectedOffice)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-[#2a2d35] hover:bg-gray-200 dark:hover:bg-[#3a3d45] text-gray-700 dark:text-gray-300 transition"
            >
              📍 View on Map
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-[#2a2d35]">
        <h2 className="text-xs font-bold text-gray-900 dark:text-white mb-1">
          🔬 Find BIS Testing Centre
        </h2>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Locate official BIS offices to test your product quality
        </p>
      </div>

      {/* View tabs */}
      <div className="flex border-b border-gray-200 dark:border-[#2a2d35]">
        <button
          onClick={() => { setActiveView('nearby'); findNearby() }}
          className={`flex-1 py-2 text-[10px] font-medium transition ${
            activeView === 'nearby' 
              ? 'text-[#1a2744] dark:text-blue-300 border-b-2 border-[#1a2744] dark:border-blue-300' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          📍 Near Me
        </button>
        <button
          onClick={() => setActiveView('categories')}
          className={`flex-1 py-2 text-[10px] font-medium transition ${
            activeView === 'categories' 
              ? 'text-[#1a2744] dark:text-blue-300 border-b-2 border-[#1a2744] dark:border-blue-300' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          📦 By Product
        </button>
        <button
          onClick={() => { setActiveView('all'); fetchAllOffices() }}
          className={`flex-1 py-2 text-[10px] font-medium transition ${
            activeView === 'all' 
              ? 'text-[#1a2744] dark:text-blue-300 border-b-2 border-[#1a2744] dark:border-blue-300' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          🏢 All Offices
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Near Me View */}
        {activeView === 'nearby' && (
          <>
            {!userLocation && !locationError && (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">📍</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Find BIS testing centres nearest to you
                </p>
                <button
                  onClick={findNearby}
                  disabled={loading}
                  className="py-2 px-4 rounded-lg text-xs font-semibold bg-[#dd6b20] hover:bg-[#c05621] text-white transition disabled:opacity-50"
                >
                  {loading ? '📍 Finding your location...' : '📍 Find Near Me'}
                </button>
              </div>
            )}

            {locationError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-700 dark:text-red-300">
                {locationError}
                <div className="mt-2">
                  <label className="text-[10px] font-medium text-gray-500">Or search by state:</label>
                  <select
                    value={searchState}
                    onChange={(e) => searchByState(e.target.value)}
                    className="mt-1 w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] text-gray-900 dark:text-white"
                  >
                    <option value="">Select state...</option>
                    {indianStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {userLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 text-[10px] text-green-700 dark:text-green-300">
                📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </>
        )}

        {/* Categories View */}
        {activeView === 'categories' && (
          <>
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase">
              What product do you want to test?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categories).map(([name, cat]) => (
                <button
                  key={name}
                  onClick={() => setSelectedCategory(selectedCategory === name ? null : name)}
                  className={`p-2.5 rounded-lg text-left transition border ${
                    selectedCategory === name
                      ? 'bg-[#1a2744] dark:bg-blue-900/30 border-[#1a2744] dark:border-blue-500 text-white'
                      : 'bg-white dark:bg-[#1a1d23] border-gray-200 dark:border-[#2a2d35] hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  <div className={`text-[10px] font-semibold ${selectedCategory === name ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {name}
                  </div>
                  <div className={`text-[9px] mt-0.5 ${selectedCategory === name ? 'text-blue-200' : 'text-gray-400'}`}>
                    {cat.standards.length} standards
                  </div>
                </button>
              ))}
            </div>

            {/* Selected category details */}
            {selectedCategory && categories[selectedCategory] && (
              <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-3 shadow-sm">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1">
                  {categories[selectedCategory].icon} {selectedCategory}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                  {categories[selectedCategory].description}
                </p>
                <div className="mb-2">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase">Key Standards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {categories[selectedCategory].standards.map(std => (
                      <span key={std} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-mono">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => searchByState('')}
                  className="w-full py-1.5 text-[10px] font-semibold bg-[#1a2744] hover:bg-[#2c3e6b] text-white rounded-lg transition"
                >
                  View All Testing Centres →
                </button>
              </div>
            )}
          </>
        )}

        {/* State Search (for All view) */}
        {activeView === 'all' && (
          <div className="mb-2">
            <select
              value={searchState}
              onChange={(e) => searchByState(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] text-gray-900 dark:text-white"
            >
              <option value="">All States & Centres</option>
              {indianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Office List */}
        {offices.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase">
              {activeView === 'nearby' ? `Nearest Centres (${offices.length})` : `BIS Centres (${offices.length})`}
            </h3>
            {offices.map((office, i) => (
              <div
                key={office.id || i}
                onClick={() => setSelectedOffice(office)}
                className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-3 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">{EMOJI_MAP[office.type] || '🏢'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {office.name}
                      </h4>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#2a2d35] text-gray-500 dark:text-gray-400 shrink-0">
                        {office.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {office.city}, {office.state}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {office.services.slice(0, 3).map((s, j) => (
                        <span key={j} className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          {SERVICE_ICONS[s] || '✓'} {s}
                        </span>
                      ))}
                      {office.services.length > 3 && (
                        <span className="text-[8px] text-gray-400">+{office.services.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  {office.distance_km !== undefined && (
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-bold text-[#dd6b20]">{office.distance_km} km</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); getDirections(office) }}
                        className="text-[8px] text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
                      >
                        Directions →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-[10px] text-blue-700 dark:text-blue-300">
          <strong>💡 Tip:</strong> Before visiting, call the centre to confirm the testing service you need is available. Some centres specialize in specific product categories.
        </div>
      </div>
    </div>
  )
}
