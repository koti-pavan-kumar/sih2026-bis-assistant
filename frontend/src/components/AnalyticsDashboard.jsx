import React from 'react'

/**
 * AnalyticsDashboard — Future scope feature.
 * Shows what the BIS analytics dashboard would look like
 * once real usage data is collected from production deployment.
 */

export default function AnalyticsDashboard({ health }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-navy">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">BIS Standards Usage Insights</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          Future Scope
        </span>
      </div>

      {/* Current System Stats (Real) */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Current System</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-navy">{health?.standards || 18}</div>
            <div className="text-xs text-gray-500">Standards Indexed</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{health?.indexed_chunks || 73}</div>
            <div className="text-xs text-gray-500">Total Chunks</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">18</div>
            <div className="text-xs text-gray-500">Languages Supported</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">8</div>
            <div className="text-xs text-gray-500">Domains Covered</div>
          </div>
        </div>
      </div>

      {/* Future Analytics Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Planned Analytics (Phase 3)</h3>
        <div className="space-y-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
            📊 Most-queried standards and knowledge gaps
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
            🌐 Language distribution across user queries
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
            ⚠️ Standards with low awareness — helps BIS prioritize updates
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
            📈 Query trends and compliance patterns across MSMEs
          </div>
        </div>
      </div>
    </div>
  )
}
