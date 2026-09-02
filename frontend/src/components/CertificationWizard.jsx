import React, { useState } from 'react'

/**
 * CertificationWizard — Guided workflow to find the applicable BIS standard.
 * Helps users who don't know which standard applies to their product.
 * 
 * Steps:
 * 1. Select product category
 * 2. View applicable standards
 * 3. Get certification process details
 */

const PRODUCT_CATEGORIES = [
  {
    id: 'cement',
    name: 'Cement & Concrete',
    icon: '🏗️',
    description: 'OPC, PPC, concrete mixes, aggregates',
    standards: [
      { is: 'IS 269:2015', name: 'Ordinary Portland Cement, 33 Grade', query: 'What are the requirements for OPC 33 grade cement?' },
      { is: 'IS 1489:1991', name: 'Portland Pozzolana Cement', query: 'What are the specifications for PPC cement?' },
      { is: 'IS 455:1989', name: 'Portland Slag Cement', query: 'What are the requirements for Portland slag cement?' },
      { is: 'IS 456:2000', name: 'Plain and Reinforced Concrete', query: 'What are the mix design requirements for concrete?' },
      { is: 'IS 383:2016', name: 'Aggregates for Concrete', query: 'What are the grading requirements for concrete aggregates?' },
    ]
  },
  {
    id: 'steel',
    name: 'Steel & Metals',
    icon: '⚙️',
    description: 'Rebars, structural steel, ferrous products',
    standards: [
      { is: 'IS 1786:2008', name: 'High Strength Deformed Steel Bars', query: 'What is the tensile strength of Fe 500 steel bars?' },
      { is: 'IS 2062:2011', name: 'Steel for General Structural Purposes', query: 'What are the chemical requirements for structural steel?' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Dairy',
    icon: '🥛',
    description: 'Milk, water, food safety',
    standards: [
      { is: 'IS 14543:2018', name: 'Milk and Milk Products Safety', query: 'What is the minimum fat content required in milk?' },
      { is: 'IS 10500:2012', name: 'Drinking Water Specifications', query: 'What are the acceptable limits for chloride in drinking water?' },
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & IT',
    icon: '💻',
    description: 'IT equipment, appliances, consumer electronics',
    standards: [
      { is: 'IS 13252:2010', name: 'IT Equipment Safety', query: 'What are the safety requirements for IT equipment?' },
      { is: 'IS 15258:2016', name: 'Household Refrigerating Appliances', query: 'What are the energy efficiency classes for refrigerators?' },
    ]
  },
  {
    id: 'textiles',
    name: 'Textiles & Leather',
    icon: '👔',
    description: 'Fabrics, leather, footwear materials',
    standards: [
      { is: 'IS 1758:2016', name: 'Textile Fabrics', query: 'What are the dimensional change requirements for textile fabrics?' },
      { is: 'IS 17091:2018', name: 'Leather for Footwear', query: 'What are the tensile strength requirements for footwear leather?' },
    ]
  },
  {
    id: 'packaging',
    name: 'Packaging & Paints',
    icon: '📦',
    description: 'Corrugated boxes, paints, coatings',
    standards: [
      { is: 'IS 13726:2016', name: 'Corrugated Fibreboard Boxes', query: 'What are the edge crush test requirements for corrugated boxes?' },
      { is: 'IS 2932:2019', name: 'Synthetic Resin Emulsion Paints', query: 'What are the hiding power requirements for emulsion paints?' },
    ]
  },
  {
    id: 'construction',
    name: 'Construction Materials',
    icon: '🏠',
    description: 'Masonry units, ready-mix concrete, fly ash',
    standards: [
      { is: 'IS 2185:2005', name: 'Concrete Masonry Units', query: 'What are the compressive strength requirements for concrete blocks?' },
      { is: 'IS 12040:1997', name: 'Ready Mixed Concrete', query: 'What are the requirements for ready mixed concrete?' },
      { is: 'IS 16001:2012', name: 'Fly Ash for Cement', query: 'What are the specifications for fly ash used in cement?' },
    ]
  },
]

const CERTIFICATION_STEPS = [
  {
    step: 1,
    title: 'Identify Product',
    description: 'Select your product category to find applicable standards',
    icon: '🔍'
  },
  {
    step: 2,
    title: 'View Standards',
    description: 'Review the applicable IS standards for your product',
    icon: '📋'
  },
  {
    step: 3,
    title: 'Certification Process',
    description: 'Understand the BIS certification process and requirements',
    icon: '✅'
  }
]

export default function CertificationWizard({ onAskQuestion }) {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedStandard, setSelectedStandard] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setStep(2)
  }

  const handleStandardSelect = (standard) => {
    setSelectedStandard(standard)
    setStep(3)
  }

  const handleAskAboutStandard = (query) => {
    onAskQuestion?.(query)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedCategory(null)
    setSelectedStandard(null)
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-navy">Certification Wizard</h2>
          <p className="text-sm text-gray-500">Find the right BIS standard for your product</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          Start Over
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {CERTIFICATION_STEPS.map((s, i) => (
          <React.Fragment key={s.step}>
            <div className={`flex items-center gap-2 ${
              step >= s.step ? 'text-navy' : 'text-gray-300'
            }`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.step ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {s.step}
              </span>
              <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
            </div>
            {i < CERTIFICATION_STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step > s.step ? 'bg-navy' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Category */}
      {step === 1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Select your product category:</h3>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className="text-left p-4 rounded-xl border border-gray-200 hover:border-navy hover:bg-blue-50 transition"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-navy text-sm">{cat.name}</div>
                <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                <div className="text-xs text-blue-500 mt-2">{cat.standards.length} standards →</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: View Standards */}
      {step === 2 && selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{selectedCategory.icon}</span>
            <h3 className="text-sm font-semibold text-gray-600">{selectedCategory.name}</h3>
          </div>
          <div className="space-y-3">
            {selectedCategory.standards.map((std, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 hover:border-navy transition cursor-pointer"
                onClick={() => handleStandardSelect(std)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-navy">{std.is}</div>
                    <div className="text-sm text-gray-600">{std.name}</div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-sm text-gray-500 hover:text-navy transition"
          >
            ← Back to categories
          </button>
        </div>
      )}

      {/* Step 3: Certification Process */}
      {step === 3 && selectedStandard && (
        <div>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="font-bold text-navy text-lg">{selectedStandard.is}</div>
            <div className="text-gray-600">{selectedStandard.name}</div>
          </div>

          <h3 className="text-sm font-semibold text-gray-600 mb-3">Certification Process:</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <div className="font-semibold text-navy">Apply to BIS</div>
                <div className="text-sm text-gray-600">Submit application with product details and test reports to BIS regional office</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <div className="font-semibold text-navy">Factory Audit</div>
                <div className="text-sm text-gray-600">BIS auditor inspects manufacturing facility and quality management system</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <div className="font-semibold text-navy">Product Testing</div>
                <div className="text-sm text-gray-600">Samples tested at BIS-recognized laboratory against {selectedStandard.is} requirements</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <div className="font-semibold text-navy">License Granted</div>
                <div className="text-sm text-gray-600">ISI mark license issued. Annual surveillance audits required to maintain.</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleAskAboutStandard(selectedStandard.query)}
              className="bg-saffron hover:bg-saffron-light text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              Ask about {selectedStandard.is} →
            </button>
            <button
              onClick={() => setStep(2)}
              className="text-sm text-gray-500 hover:text-navy transition"
            >
              ← Back to standards
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
