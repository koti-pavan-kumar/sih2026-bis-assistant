import React, { useState, useEffect, useCallback } from 'react'

const EMOJI_MAP = {
  "Headquarters": "🏛️",
  "Regional Office": "🏢",
  "Testing Lab": "🔬",
  "Hallmarking Centre": "💎"
}

/**
 * OfficesPage — Full-page BIS office and testing centre finder.
 */
export default function OfficesPage({ onNavigate, darkMode }) {
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [searchState, setSearchState] = useState('')
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [filterType, setFilterType] = useState('all')

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
  ]

  useEffect(() => {
    fetch('/api/bis-offices')
      .then(r => r.json())
      .then(d => setOffices(d.offices || []))
      .catch(() => {})
  }, [])

  const findNearby = useCallback(() => {
    setLoading(true)
    setLocationError(null)
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setUserLocation({ lat: latitude, lng: longitude })
        try {
          const res = await fetch(`/api/bis-offices?lat=${latitude}&lng=${longitude}&n=15`)
          const data = await res.json()
          setOffices(data.offices || [])
        } catch { setLocationError('Failed to fetch nearby offices') }
        finally { setLoading(false) }
      },
      (err) => {
        setLocationError('Location access denied. Try searching by state.')
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }, [])

  const searchByState = async (state) => {
    setSearchState(state)
    if (!state) {
      const res = await fetch('/api/bis-offices')
      const d = await res.json()
      setOffices(d.offices || [])
      return
    }
    const res = await fetch(`/api/bis-offices?state=${encodeURIComponent(state)}`)
    const d = await res.json()
    setOffices(d.offices || [])
  }

  const filtered = filterType === 'all' ? offices : offices.filter(o => o.type === filterType)

  const getDirections = (office) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`, '_blank')
  }

  // Detail view
  if (selectedOffice) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-[#1a2744] via-[#1e3a5f] to-[#0f1a2e] text-white py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedOffice(null)}
              className="text-blue-300 hover:text-white text-xs mb-3 flex items-center gap-1"
            >
              ← Back to all offices
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{EMOJI_MAP[selectedOffice.type] || '🏢'}</span>
              <div>
                <h1 className="text-2xl font-bold">{selectedOffice.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-800/50">{selectedOffice.type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Address</span>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedOffice.address}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Phone</span>
                  <p className="text-sm mt-1">
                    <a href={`tel:${selectedOffice.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedOffice.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Email</span>
                  <p className="text-sm mt-1">
                    <a href={`mailto:${selectedOffice.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedOffice.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">Jurisdiction</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{selectedOffice.jurisdiction}</p>
                </div>
                {selectedOffice.distance_km !== undefined && (
                  <div>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">Distance</span>
                    <p className="text-sm font-bold text-[#dd6b20] mt-1">{selectedOffice.distance_km} km from you</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase mb-2 block">Services</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOffice.services?.map((s, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedOffice.product_categories && (
                  <div>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase mb-2 block">Products Tested</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOffice.product_categories.map((p, i) => (
                        <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => getDirections(selectedOffice)}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-[#1a2744] hover:bg-[#2c3e6b] text-white transition"
                  >
                    🧭 Get Directions
                  </button>
                  <a
                    href={`tel:${selectedOffice.phone}`}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-[#2a2d35] hover:bg-gray-200 dark:hover:bg-[#3a3d45] text-gray-700 dark:text-gray-300 transition text-center"
                  >
                    📞 Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a2744] via-[#1e3a5f] to-[#0f1a2e] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => onNavigate('app')}
            className="text-blue-300 hover:text-white text-xs mb-4 flex items-center gap-1"
          >
            ← Back to ManakMitra
          </button>
          <h1 className="text-3xl font-bold mb-2">🔬 Find BIS Testing Centre</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Locate official BIS offices and testing laboratories near you.
            Get directions, contact information, and service details.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={findNearby}
            disabled={loading}
            className="py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#dd6b20] hover:bg-[#c05621] text-white transition disabled:opacity-50"
          >
            {loading ? '⏳ Finding...' : '📍 Find Near Me'}
          </button>

          <select
            value={searchState}
            onChange={(e) => searchByState(e.target.value)}
            className="text-xs p-2.5 rounded-lg border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] text-gray-900 dark:text-white"
          >
            <option value="">All States</option>
            {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs p-2.5 rounded-lg border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="Regional Office">Regional Offices</option>
            <option value="Testing Lab">Testing Labs</option>
            <option value="Hallmarking Centre">Hallmarking</option>
          </select>

          {userLocation && (
            <span className="text-[10px] text-green-600 dark:text-green-400">
              📍 Location detected
            </span>
          )}

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} centres</span>
        </div>

        {locationError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-700 dark:text-red-300 mb-6">
            {locationError}
          </div>
        )}

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((office, i) => (
            <div
              key={office.id || i}
              onClick={() => setSelectedOffice(office)}
              className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{EMOJI_MAP[office.type] || '🏢'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#2a2d35] text-gray-500">
                      {office.type}
                    </span>
                    {office.distance_km !== undefined && (
                      <span className="text-[9px] font-bold text-[#dd6b20]">{office.distance_km} km</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#1a2744] dark:group-hover:text-blue-300 transition">
                    {office.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {office.city}, {office.state}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">{office.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {office.services?.slice(0, 3).map((s, j) => (
                      <span key={j} className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        {s}
                      </span>
                    ))}
                    {office.services?.length > 3 && (
                      <span className="text-[9px] text-gray-400">+{office.services.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); getDirections(office) }}
                  className="flex-1 py-1.5 text-[10px] font-semibold bg-[#1a2744] hover:bg-[#2c3e6b] text-white rounded-lg transition"
                >
                  🧭 Directions
                </button>
                <a
                  href={`tel:${office.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-1.5 text-[10px] font-semibold bg-gray-100 dark:bg-[#2a2d35] hover:bg-gray-200 dark:hover:bg-[#3a3d45] text-gray-700 dark:text-gray-300 rounded-lg transition text-center"
                >
                  📞 Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
