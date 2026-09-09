"""
BIS Certification Process Data — Complete guide for obtaining ISI Mark, Hallmark, and other BIS certifications.
"""

CERTIFICATION_TYPES = {
    "isi-mark": {
        "id": "isi-mark",
        "name": "ISI Mark Certification",
        "full_name": "Bureau of Indian Standards Certification (ISI Mark)",
        "icon": "📋",
        "description": "The ISI mark is a certification mark for industrial products in India, issued by the Bureau of Indian Standards. It is the most recognized quality certification in India, mandatory for many products.",
        "mandatory_products": [
            "Cement (IS 455, IS 269, IS 12269, IS 14846)",
            "Electrical Appliances (IS 302)",
            "Steel Products (IS 2062, IS 1786)",
            "LPG Cylinders",
            "Automobile Parts",
            "Medical Devices",
            "Packaged Drinking Water (IS 14543)",
            "Food Products (various IS standards)",
            "Textiles (various IS standards)",
            "Safety Glass"
        ],
        "process_steps": [
            {
                "step": 1,
                "title": "Application Submission",
                "duration": "1 day",
                "description": "Submit application to BIS with required documents and fees.",
                "documents_needed": [
                    "Application Form (Form-I)",
                    "Company Registration Certificate",
                    "GST Registration",
                    "Factory License",
                    "Product Test Reports from BIS-recognized lab",
                    "Manufacturing Process Flow Chart",
                    "Quality Control Manual"
                ],
                "tips": "Ensure all documents are self-attested. Product test reports must be from a BIS-recognized laboratory within the last 6 months."
            },
            {
                "step": 2,
                "title": "Document Verification",
                "duration": "7-15 days",
                "description": "BIS reviews all submitted documents for completeness and compliance.",
                "documents_needed": [],
                "tips": "Keep digital copies of all documents ready. BIS may ask for additional documents during this stage."
            },
            {
                "step": 3,
                "title": "Factory Audit",
                "duration": "2-3 days",
                "description": "BIS inspectors visit the manufacturing facility to verify production processes, quality control systems, and testing infrastructure.",
                "documents_needed": [
                    "Manufacturing facility access",
                    "Quality control laboratory access",
                    "Production records",
                    "Raw material purchase records",
                    "Previous test reports"
                ],
                "tips": "Ensure your factory is production-ready and quality systems are documented. BIS will check calibration of testing equipment."
            },
            {
                "step": 4,
                "title": "Product Testing",
                "duration": "15-30 days",
                "description": "Product samples are tested at BIS-recognized laboratories for compliance with relevant Indian Standards.",
                "documents_needed": [
                    "Product samples (as specified by BIS)",
                    "Test request form"
                ],
                "tips": "Send samples that represent your actual production quality. Test failures will delay certification."
            },
            {
                "step": 5,
                "title": "Grant of License",
                "duration": "7-10 days",
                "description": "Upon successful evaluation, BIS grants the license to use the ISI mark.",
                "documents_needed": [
                    "License fee payment receipt"
                ],
                "tips": "The license is valid for 1-2 years and must be renewed before expiry."
            }
        ],
        "total_duration": "45-60 days (approximate)",
        "fees": {
            "application_fee": "₹2,000 - ₹5,000",
            "audit_fee": "₹7,000 - ₹15,000",
            "license_fee": "₹10,000 - ₹25,000 per product",
            "annual_marking_fee": "₹5,000 - ₹15,000",
            "note": "Fees vary based on product type and factory size. Check BIS website for current fee schedule."
        },
        "renewal": "Annual renewal required. Factory audits conducted periodically.",
        "penalties": "Manufacturing products with fake ISI mark is punishable under BIS Act 2016 with imprisonment up to 2 years and/or fine up to ₹5 lakhs."
    },
    "hallmark": {
        "id": "hallmark",
        "name": "Hallmark Certification",
        "full_name": "BIS Hallmarking of Gold/Silver Jewellery",
        "icon": "💎",
        "description": "BIS hallmarking certifies the purity of gold and silver jewellery. Since June 2021, hallmarking of gold jewellery has been made mandatory in 256 districts.",
        "mandatory_products": [
            "Gold Jewellery (14K, 18K, 22K, 24K)",
            "Gold artefacts",
            "Silver Jewellery",
            "Silver artefacts"
        ],
        "process_steps": [
            {
                "step": 1,
                "title": "Register as Assaying & Hallmarking Centre",
                "duration": "30-45 days",
                "description": "Apply to BIS to become an authorized Assaying and Hallmarking (A&H) centre.",
                "documents_needed": [
                    "Application Form",
                    "NABL Accreditation Certificate (for labs)",
                    "Lab setup details",
                    "Equipment list and calibration certificates",
                    "Staff qualifications"
                ],
                "tips": "A&H centres must have XRF machine or fire assay equipment. BIS will verify equipment calibration."
            },
            {
                "step": 2,
                "title": "BIS Recognition",
                "duration": "15-30 days",
                "description": "BIS verifies the A&H centre's capability and grants recognition.",
                "documents_needed": [],
                "tips": "Maintain proper records of all hallmarking operations."
            },
            {
                "step": 3,
                "title": "Hallmarking Process",
                "duration": "Same day",
                "description": "Jewellers send jewellery to A&H centre. Centre tests purity and applies hallmark if compliant.",
                "documents_needed": [
                    "Jewellery items to be hallmarked",
                    "Jeweller's registration number"
                ],
                "tips": "The hallmark includes: BIS logo, purity grade (e.g., 916 for 22K), A&H centre mark, year mark, and jeweller's mark."
            }
        ],
        "hallmark_components": [
            "BIS Logo — Authentication mark",
            "Purity Grade — e.g., 999 (24K), 916 (22K), 750 (18K), 585 (14K)",
            "A&H Centre Mark — Which centre tested it",
            "Year Mark — Year of hallmarking (e.g., A=2023, B=2024)",
            "Jeweller's Mark — Identification of the jeweller"
        ],
        "total_duration": "Same day (after centre is set up)",
        "fees": {
            "per_item_fee": "₹45 - ₹200 (depending on weight)",
            "centre_registration": "₹2,00,000 - ₹5,00,000",
            "annual_fee": "As per BIS schedule",
            "note": "Consumer pays hallmarking fee, not the jeweller."
        },
        "consumer_benefits": [
            "Guaranteed purity of gold/silver",
            "Protection against adulteration",
            "Easy resale value",
            "Legal recourse in case of fraud"
        ]
    },
    "eco-mark": {
        "id": "eco-mark",
        "name": "Eco Mark Certification",
        "full_name": "BIS Eco Mark Scheme",
        "icon": "🌿",
        "description": "Eco Mark is a certification mark issued by BIS for products that are environmentally friendly throughout their lifecycle.",
        "mandatory_products": [
            "Packaging materials",
            "Detergents",
            "Electronics",
            "Textiles",
            "Building materials"
        ],
        "process_steps": [
            {
                "step": 1,
                "title": "Application",
                "duration": "1 day",
                "description": "Submit application with environmental compliance documents.",
                "documents_needed": [
                    "Application Form",
                    "Environmental Impact Assessment",
                    "Product lifecycle analysis",
                    "Waste management plan"
                ],
                "tips": "Products must meet environmental criteria beyond the basic Indian Standard."
            },
            {
                "step": 2,
                "title": "Evaluation",
                "duration": "30-45 days",
                "description": "BIS evaluates the product's environmental impact across its lifecycle.",
                "documents_needed": [],
                "tips": "Prepare detailed documentation of your manufacturing process's environmental impact."
            },
            {
                "step": 3,
                "title": "Certification",
                "duration": "10-15 days",
                "description": "Upon meeting all criteria, Eco Mark license is granted.",
                "documents_needed": [],
                "tips": "Eco Mark certification is valid for 2 years."
            }
        ],
        "total_duration": "45-60 days",
        "fees": {
            "application_fee": "₹5,000",
            "certification_fee": "₹15,000 - ₹25,000",
            "note": "Fees vary based on product category."
        }
    },
    "cmvr": {
        "id": "cmvr",
        "name": "CMVR Type Approval",
        "full_name": "Central Motor Vehicles Rules Type Approval",
        "icon": "🚗",
        "description": "Mandatory type approval for automotive components and parts as per CMVR rules.",
        "mandatory_products": [
            "Automotive components",
            "Safety parts",
            "Emission-related parts",
            "Tyres and tubes",
            "Automotive glass"
        ],
        "process_steps": [
            {
                "step": 1,
                "title": "Apply for Type Approval",
                "duration": "1 day",
                "description": "Submit application to ARAI/ICAT with product details.",
                "documents_needed": [
                    "Type Approval Application",
                    "Product design documents",
                    "Test reports from approved labs",
                    "Manufacturing process details"
                ],
                "tips": "Testing must be done at ARAI (Pune) or ICAT (Manesar/Guwahati)."
            },
            {
                "step": 2,
                "title": "Testing & Evaluation",
                "duration": "30-60 days",
                "description": "Product undergoes rigorous testing at designated test centers.",
                "documents_needed": [
                    "Product samples",
                    "Raw material certificates"
                ],
                "tips": "Ensure all samples are production-representative."
            },
            {
                "step": 3,
                "title": "Type Approval Certificate",
                "duration": "10-15 days",
                "description": "TAC issued upon successful testing.",
                "documents_needed": [],
                "tips": "TAC is valid for the specific product design. Design changes require re-testing."
            }
        ],
        "total_duration": "45-75 days",
        "fees": {
            "testing_fee": "₹25,000 - ₹2,00,000 (varies by component)",
            "certificate_fee": "₹10,000 - ₹25,000",
            "note": "Fees vary significantly based on component type."
        }
    },
    "msme-udyam": {
        "id": "msme-udyam",
        "name": "MSME Udyam Registration",
        "full_name": "MSME Udyam Registration Certificate",
        "icon": "🏭",
        "description": "Free registration for Micro, Small, and Medium Enterprises. Provides access to government schemes, subsidies, and easier BIS certification process.",
        "mandatory_products": [],
        "process_steps": [
            {
                "step": 1,
                "title": "Online Registration",
                "duration": "Same day",
                "description": "Register on udyamregistration.gov.in with Aadhaar and PAN.",
                "documents_needed": [
                    "Aadhaar Card",
                    "PAN Card",
                    "GST Number (if applicable)",
                    "Bank account details",
                    "Investment and turnover details"
                ],
                "tips": "Registration is completely free. Never pay anyone for Udyam registration."
            },
            {
                "step": 2,
                "title": "Udyam Certificate",
                "duration": "Same day",
                "description": "Certificate generated automatically with Udyam Registration Number.",
                "documents_needed": [],
                "tips": "Keep the certificate safe. You'll need it for availing MSME benefits."
            }
        ],
        "total_duration": "Same day (online process)",
        "fees": {
            "registration_fee": "FREE",
            "note": "This is a completely free government registration."
        },
        "benefits": [
            "Priority sector lending from banks",
            "Subsidized power tariffs",
            "Tax benefits under GST",
            "Government tenders (MSME preference)",
            "Reduced BIS certification fees",
            "Protection against delayed payments",
            "Free access to MSME clinics"
        ]
    }
}

# State-wise certification offices
CERTIFICATION_OFFICES = {
    "Delhi": [
        {"name": "BIS Headquarters", "address": "Manak Bhawan, 9Bahadur Shah Zafar Marg, New Delhi 110002", "phone": "011-23230131"}
    ],
    "Maharashtra": [
        {"name": "BIS Western Regional Office", "address": "BKC, Mumbai 400051", "phone": "022-26590310"},
        {"name": "ARAI Pune", "address": "Pune-Mumbai Highway, Pimpri, Pune 411018", "phone": "020-27142000"}
    ],
    "Karnataka": [
        {"name": "BIS Southern Regional Office", "address": "MG Road, Bengaluru 560001", "phone": "080-22244916"}
    ],
    "Tamil Nadu": [
        {"name": "BIS Testing Lab Chennai", "address": "Egmore, Chennai 600008", "phone": "044-28194450"}
    ],
    "West Bengal": [
        {"name": "BIS Eastern Regional Office", "address": "Salt Lake, Kolkata 700091", "phone": "033-23378562"}
    ],
    "Uttar Pradesh": [
        {"name": "BIS Central Regional Office", "address": "7 Harcourt Road, Lucknow 226001", "phone": "0522-2209176"},
        {"name": "ICAT Manesar", "address": "Manesar, Gurugram 122051", "phone": "0124-2806600"}
    ],
    "Telangana": [
        {"name": "BIS Testing Lab Hyderabad", "address": "IDA Uppal, Hyderabad 500039", "phone": "040-27201234"}
    ],
    "Gujarat": [
        {"name": "BIS Testing Lab Ahmedabad", "address": "Paldi, Ahmedabad 380007", "phone": "079-26570793"}
    ],
    "Rajasthan": [
        {"name": "BIS Testing Lab Jaipur", "address": "Sitapura, Jaipur 302022", "phone": "0141-2770658"}
    ],
    "Punjab": [
        {"name": "BIS Northern Regional Office", "address": "Sector 36-C, Chandigarh 160036", "phone": "0172-2700478"}
    ]
}

CERTIFICATION_FAQS = [
    {
        "question": "How long does BIS certification take?",
        "answer": "Typically 45-60 days for ISI Mark, depending on product type and completeness of application. Hallmarking setup takes 30-45 days."
    },
    {
        "question": "Is BIS certification mandatory for all products?",
        "answer": "No, but it is mandatory for products listed under compulsory certification (currently ~380 products). However, voluntary certification is recommended for market trust."
    },
    {
        "question": "Can MSMEs get subsidized BIS certification?",
        "answer": "Yes, MSMEs with Udyam Registration can avail reduced certification fees and priority processing under government schemes."
    },
    {
        "question": "What if my product fails testing?",
        "answer": "You can improve the product and resubmit samples. BIS allows re-testing within 6 months of the original application without fresh application."
    },
    {
        "question": "Can I apply online for BIS certification?",
        "answer": "Yes, applications can be submitted online through the BIS website (bis.gov.in). However, factory audit is always conducted in-person."
    },
    {
        "question": "What is the penalty for using fake ISI mark?",
        "answer": "Under BIS Act 2016, using fake certification marks is punishable with imprisonment up to 2 years and/or fine up to ₹5 lakhs."
    },
    {
        "question": "How do I check if a BIS certificate is valid?",
        "answer": "Visit bis.gov.in → Click 'Check License' → Enter the license number or product details to verify current status."
    },
    {
        "question": "Do I need separate certifications for different product variants?",
        "answer": "Yes, each product variant (different size, grade, or specification) requires separate certification. However, related variants may be tested together."
    }
]


def get_certification_info(cert_type):
    """Get detailed information about a certification type."""
    return CERTIFICATION_TYPES.get(cert_type, None)


def get_all_certifications():
    """Get summary of all certification types."""
    return [
        {
            "id": cert["id"],
            "name": cert["name"],
            "icon": cert["icon"],
            "description": cert["description"],
            "total_duration": cert["total_duration"],
            "mandatory_products_count": len(cert.get("mandatory_products", []))
        }
        for cert in CERTIFICATION_TYPES.values()
    ]


def get_certification_offices(state=None):
    """Get certification offices by state."""
    if state:
        return CERTIFICATION_OFFICES.get(state, [])
    return CERTIFICATION_OFFICES
