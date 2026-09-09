"""
BIS Regional Offices and Testing Centers across India.
Users can find the nearest center to test their product quality against BIS standards.
"""

BIS_REGIONAL_OFFICES = [
    {
        "id": "bis-hq",
        "name": "BIS Headquarters",
        "type": "Headquarters",
        "address": "Manak Bhawan, 9Bahadur Shah Zafar Marg, New Delhi 110002",
        "city": "New Delhi",
        "state": "Delhi",
        "lat": 28.6412,
        "lng": 77.2385,
        "phone": "011-23230131",
        "email": "bis@bis.org.in",
        "services": ["Standard Setting", "Testing", "Certification", "Policy"],
        "jurisdiction": "National"
    },
    {
        "id": "bis-east",
        "name": "BIS Eastern Regional Office",
        "type": "Regional Office",
        "address": "Plot No. 29/3, Sector 5, Salt Lake City, Kolkata 700091",
        "city": "Kolkata",
        "state": "West Bengal",
        "lat": 22.5804,
        "lng": 88.4169,
        "phone": "033-23378562",
        "email": "eastern@bis.org.in",
        "services": ["Testing", "Certification", "ISI Mark", "Hallmark"],
        "jurisdiction": "West Bengal, Odisha, Jharkhand, Bihar, North East States"
    },
    {
        "id": "bis-west",
        "name": "BIS Western Regional Office",
        "type": "Regional Office",
        "address": "BIS Bhawan, Plot No. C-11, 'E' Block, Bandra Kurla Complex, Mumbai 400051",
        "city": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.0596,
        "lng": 72.8656,
        "phone": "022-26590310",
        "email": "western@bis.org.in",
        "services": ["Testing", "Certification", "ISI Mark", "Hallmark", "Eco Mark"],
        "jurisdiction": "Maharashtra, Gujarat, Goa, Madhya Pradesh, Chhattisgarh"
    },
    {
        "id": "bis-south",
        "name": "BIS Southern Regional Office",
        "type": "Regional Office",
        "address": "BIS Bhawan, No. 2, IIF Complex, 2nd Floor, Mahatma Gandhi Road, Bengaluru 560001",
        "city": "Bengaluru",
        "state": "Karnataka",
        "lat": 12.9784,
        "lng": 77.6408,
        "phone": "080-22244916",
        "email": "southern@bis.org.in",
        "services": ["Testing", "Certification", "ISI Mark", "Hallmark"],
        "jurisdiction": "Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Puducherry"
    },
    {
        "id": "bis-north",
        "name": "BIS Northern Regional Office",
        "type": "Regional Office",
        "address": "SCO 203-204, Sector 36-C, Chandigarh 160036",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "lat": 30.7333,
        "lng": 76.7794,
        "phone": "0172-2700478",
        "email": "northern@bis.org.in",
        "services": ["Testing", "Certification", "ISI Mark", "Hallmark"],
        "jurisdiction": "Punjab, Haryana, Himachal Pradesh, J&K, Ladakh, Uttarakhand, HP"
    },
    {
        "id": "bis-central",
        "name": "BIS Central Regional Office",
        "type": "Regional Office",
        "address": "BIS Bhawan, 4th Floor, 7 Harcourt Road, Lucknow 226001",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "phone": "0522-2209176",
        "email": "central@bis.org.in",
        "services": ["Testing", "Certification", "ISI Mark"],
        "jurisdiction": "Uttar Pradesh, Rajasthan"
    },
    {
        "id": "test-new-delhi",
        "name": "BIS Testing Laboratory - New Delhi",
        "type": "Testing Lab",
        "address": "Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi 110002",
        "city": "New Delhi",
        "state": "Delhi",
        "lat": 28.6412,
        "lng": 77.2385,
        "phone": "011-23230131",
        "email": "testing@bis.org.in",
        "services": ["Mechanical Testing", "Chemical Analysis", "Electrical Testing", "Textile Testing"],
        "product_categories": ["Steel", "Cement", "Electrical Appliances", "Textiles", "Food Products"],
        "jurisdiction": "Delhi, NCR"
    },
    {
        "id": "test-mumbai",
        "name": "BIS Testing Laboratory - Mumbai",
        "type": "Testing Lab",
        "address": "BIS Bhawan, BKC, Mumbai 400051",
        "city": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.0596,
        "lng": 72.8656,
        "phone": "022-26590310",
        "email": "testing-mumbai@bis.org.in",
        "services": ["Mechanical Testing", "Chemical Analysis", "Packaging Testing"],
        "product_categories": ["Steel", "Cement", "Plastics", "Packaging Materials"],
        "jurisdiction": "Maharashtra, Gujarat"
    },
    {
        "id": "test-chennai",
        "name": "BIS Testing Laboratory - Chennai",
        "type": "Testing Lab",
        "address": "No. 3, Gandhi Irwin Road, Egmore, Chennai 600008",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "lat": 13.0827,
        "lng": 80.2707,
        "phone": "044-28194450",
        "email": "testing-chennai@bis.org.in",
        "services": ["Mechanical Testing", "Chemical Analysis", "Electrical Testing"],
        "product_categories": ["Steel", "Electrical Goods", "Automobile Components"],
        "jurisdiction": "Tamil Nadu, Kerala, Puducherry"
    },
    {
        "id": "test-kolkata",
        "name": "BIS Testing Laboratory - Kolkata",
        "type": "Testing Lab",
        "address": "Plot No. 29/3, Sector 5, Salt Lake, Kolkata 700091",
        "city": "Kolkata",
        "state": "West Bengal",
        "lat": 22.5804,
        "lng": 88.4169,
        "phone": "033-23378562",
        "email": "testing-kolkata@bis.org.in",
        "services": ["Chemical Analysis", "Mechanical Testing", "Food Testing"],
        "product_categories": ["Food Products", "Steel", "Cement", "Spices"],
        "jurisdiction": "West Bengal, Bihar, Odisha, NE States"
    },
    {
        "id": "test-bengaluru",
        "name": "BIS Testing Laboratory - Bengaluru",
        "type": "Testing Lab",
        "address": "No. 2, IIF Complex, MG Road, Bengaluru 560001",
        "city": "Bengaluru",
        "state": "Karnataka",
        "lat": 12.9784,
        "lng": 77.6408,
        "phone": "080-22244916",
        "email": "testing-blr@bis.org.in",
        "services": ["Electronics Testing", "Chemical Analysis", "Mechanical Testing"],
        "product_categories": ["Electronics", "IT Equipment", "Steel", "Textiles"],
        "jurisdiction": "Karnataka, Telangana"
    },
    {
        "id": "test-hyderabad",
        "name": "BIS Testing Laboratory - Hyderabad",
        "type": "Testing Lab",
        "address": "Plot No. 30, IDA Uppal, Hyderabad 500039",
        "city": "Hyderabad",
        "state": "Telangana",
        "lat": 17.3850,
        "lng": 78.4867,
        "phone": "040-27201234",
        "email": "testing-hyd@bis.org.in",
        "services": ["Chemical Analysis", "Mechanical Testing", "Pharmaceutical Testing"],
        "product_categories": ["Pharmaceuticals", "Steel", "Cement", "Food Products"],
        "jurisdiction": "Telangana, Andhra Pradesh"
    },
    {
        "id": "test-jaipur",
        "name": "BIS Testing Laboratory - Jaipur",
        "type": "Testing Lab",
        "address": "E-58, RIICO Industrial Area, Sitapura, Jaipur 302022",
        "city": "Jaipur",
        "state": "Rajasthan",
        "lat": 26.9124,
        "lng": 75.7873,
        "phone": "0141-2770658",
        "email": "testing-jaipur@bis.org.in",
        "services": ["Chemical Analysis", "Mechanical Testing", "Textile Testing"],
        "product_categories": ["Textiles", "Handicrafts", "Food Products", "Spices"],
        "jurisdiction": "Rajasthan"
    },
    {
        "id": "test-kanpur",
        "name": "BIS Testing Laboratory - Kanpur",
        "type": "Testing Lab",
        "address": "17/1,kidwai Nagar, Kanpur 208011",
        "city": "Kanpur",
        "state": "Uttar Pradesh",
        "lat": 26.4499,
        "lng": 80.3319,
        "phone": "0512-2305374",
        "email": "testing-kanpur@bis.org.in",
        "services": ["Leather Testing", "Chemical Analysis", "Mechanical Testing"],
        "product_categories": ["Leather", "Footwear", "Steel", "Cement"],
        "jurisdiction": "Uttar Pradesh"
    },
    {
        "id": "test-ahmedabad",
        "name": "BIS Testing Laboratory - Ahmedabad",
        "type": "Testing Lab",
        "address": "Block-C, Nehru Foundation, Paldi, Ahmedabad 380007",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "lat": 23.0225,
        "lng": 72.5714,
        "phone": "079-26570793",
        "email": "testing-ahd@bis.org.in",
        "services": ["Chemical Analysis", "Ceramics Testing", "Glass Testing"],
        "product_categories": ["Ceramics", "Glass", "Cement", "Chemicals"],
        "jurisdiction": "Gujarat"
    },
    {
        "id": "test-guwahati",
        "name": "BIS Testing Laboratory - Guwahati",
        "type": "Testing Lab",
        "address": "BIS Complex, Christian Basti, Guwahati 781005",
        "city": "Guwahati",
        "state": "Assam",
        "lat": 26.1445,
        "lng": 91.7362,
        "phone": "0361-2526489",
        "email": "testing-ght@bis.org.in",
        "services": ["Chemical Analysis", "Food Testing", "Tea Testing"],
        "product_categories": ["Tea", "Food Products", "Spices", "Handicrafts"],
        "jurisdiction": "Assam, NE States"
    },
    {
        "id": "test-patna",
        "name": "BIS Testing Laboratory - Patna",
        "type": "Testing Lab",
        "address": "BIS Campus, Patliputra Colony, Patna 800013",
        "city": "Patna",
        "state": "Bihar",
        "lat": 25.6093,
        "lng": 85.1376,
        "phone": "0612-2262345",
        "email": "testing-patna@bis.org.in",
        "services": ["Chemical Analysis", "Food Testing", "Agricultural Testing"],
        "product_categories": ["Food Products", "Agricultural Products", "Spices"],
        "jurisdiction": "Bihar, Jharkhand"
    },
    {
        "id": "test-chandigarh",
        "name": "BIS Testing Laboratory - Chandigarh",
        "type": "Testing Lab",
        "address": "SCO 203-204, Sector 36-C, Chandigarh 160036",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "lat": 30.7333,
        "lng": 76.7794,
        "phone": "0172-2700478",
        "email": "testing-chd@bis.org.in",
        "services": ["Mechanical Testing", "Chemical Analysis", "Food Testing"],
        "product_categories": ["Steel", "Cement", "Food Products"],
        "jurisdiction": "Punjab, Haryana, HP"
    },
    {
        "id": "test-coimbatore",
        "name": "BIS Testing Laboratory - Coimbatore",
        "type": "Testing Lab",
        "address": "SIDCO Industrial Estate, Maruthamalai, Coimbatore 641018",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "lat": 11.0168,
        "lng": 76.9558,
        "phone": "0422-2301190",
        "email": "testing-cbe@bis.org.in",
        "services": ["Textile Testing", "Chemical Analysis", "Mechanical Testing"],
        "product_categories": ["Textiles", "Yarn", "Steel", "Engineering Goods"],
        "jurisdiction": "Tamil Nadu"
    },
    {
        "id": "test-pune",
        "name": "BIS Testing Laboratory - Pune",
        "type": "Testing Lab",
        "address": "BIS Bhawan, Plot No. 5, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057",
        "city": "Pune",
        "state": "Maharashtra",
        "lat": 18.5204,
        "lng": 73.8567,
        "phone": "020-27292633",
        "email": "testing-pune@bis.org.in",
        "services": ["Automotive Testing", "Chemical Analysis", "Mechanical Testing"],
        "product_categories": ["Automobile Components", "Engineering Goods", "Steel"],
        "jurisdiction": "Maharashtra"
    },
    {
        "id": "test-indore",
        "name": "BIS Testing Laboratory - Indore",
        "type": "Testing Lab",
        "address": "Plot No. 12, Scheme No. 78, Vijay Nagar, Indore 452010",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "lat": 22.7196,
        "lng": 75.8577,
        "phone": "0731-2550678",
        "email": "testing-indore@bis.org.in",
        "services": ["Chemical Analysis", "Mechanical Testing", "Food Testing"],
        "product_categories": ["Food Products", "Spices", "Steel", "Cement"],
        "jurisdiction": "Madhya Pradesh, Chhattisgarh"
    },
    {
        "id": "test-nagpur",
        "name": "BIS Testing Laboratory - Nagpur",
        "type": "Testing Lab",
        "address": "BIS Campus, Amravati Road, Nagpur 440010",
        "city": "Nagpur",
        "state": "Maharashtra",
        "lat": 21.1458,
        "lng": 79.0882,
        "phone": "0712-2531234",
        "email": "testing-ngp@bis.org.in",
        "services": ["Chemical Analysis", "Agricultural Testing", "Food Testing"],
        "product_categories": ["Oranges", "Food Products", "Agricultural Products"],
        "jurisdiction": "Vidarbha Region"
    },
    {
        "id": "test-visakhapatnam",
        "name": "BIS Testing Laboratory - Visakhapatnam",
        "type": "Testing Lab",
        "address": "Plot No. 4-8-26/4, MVP Colony, Visakhapatnam 530017",
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "lat": 17.6868,
        "lng": 83.2185,
        "phone": "0891-2547890",
        "email": "testing-vizag@bis.org.in",
        "services": ["Steel Testing", "Chemical Analysis", "Metallurgical Testing"],
        "product_categories": ["Steel", "Alloys", "Engineering Goods"],
        "jurisdiction": "Andhra Pradesh"
    },
    {
        "id": "test-lucknow",
        "name": "BIS Testing Laboratory - Lucknow",
        "type": "Testing Lab",
        "address": "4th Floor, BIS Bhawan, 7 Harcourt Road, Lucknow 226001",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "phone": "0522-2209176",
        "email": "testing-lko@bis.org.in",
        "services": ["Food Testing", "Chemical Analysis", "Textile Testing"],
        "product_categories": ["Food Products", "Textiles", "Handicrafts"],
        "jurisdiction": "Uttar Pradesh"
    },
    {
        "id": "bis-cert-hallmark",
        "name": "BIS Hallmarking Centre - All Cities",
        "type": "Hallmarking Centre",
        "address": "Available at 900+ locations across India",
        "city": "Pan India",
        "state": "All States",
        "lat": 20.5937,
        "lng": 78.9629,
        "phone": "1800-11-2100 (Toll Free)",
        "email": "hallmarking@bis.org.in",
        "services": ["Gold Hallmarking", "Silver Hallmarking", "Jewellery Testing"],
        "product_categories": ["Gold Jewellery", "Silver Articles", "Precious Metals"],
        "jurisdiction": "Pan India - 900+ centres",
        "website": "https://bis.gov.in/hallmarking"
    }
]

PRODUCT_CATEGORIES = {
    "Steel & Metals": {
        "icon": "🔩",
        "standards": ["IS 2062", "IS 1786", "IS 10500", "IS 432"],
        "description": "Structural steel, TMT bars, mild steel, stainless steel"
    },
    "Cement & Construction": {
        "icon": "🏗️",
        "standards": ["IS 455", "IS 14846", "IS 269", "IS 12269"],
        "description": "Portland cement, concrete, building materials"
    },
    "Food Products": {
        "icon": "🥛",
        "standards": ["IS 1165", "IS 14543", "IS 2510", "IS 13285"],
        "description": "Milk, spices, edible oils, packaged food"
    },
    "Electrical Appliances": {
        "icon": "⚡",
        "standards": ["IS 302", "IS 15556", "IS 16102", "IS 16104"],
        "description": "Home appliances, wiring, switches, cables"
    },
    "Textiles & Garments": {
        "icon": "🧵",
        "standards": ["IS 18841", "IS 8876", "IS 1965", "IS 14680"],
        "description": "Fabrics, garments, yarn, home textiles"
    },
    "Jewellery (Hallmarking)": {
        "icon": "💎",
        "standards": ["IS 1417", "IS 1418", "IS 309"],
        "description": "Gold, silver, precious metals hallmarking"
    },
    "Leather & Footwear": {
        "icon": "👞",
        "standards": ["IS 17841", "IS 1989", "IS 3289"],
        "description": "Leather goods, footwear, bags"
    },
    "Electronics & IT": {
        "icon": "💻",
        "standards": ["IS 13252", "IS 16046", "IS 15556"],
        "description": "Computers, mobile phones, IT equipment"
    }
}

# Haversine formula for distance calculation
from math import radians, cos, sin, asin, sqrt

def haversine(lat1, lng1, lat2, lng2):
    """Calculate the great circle distance in km between two points on earth."""
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in km
    return c * r


def find_nearest_centers(user_lat, user_lng, n=5, center_type=None):
    """Find N nearest BIS centers from user's location."""
    distances = []
    for office in BIS_REGIONAL_OFFICES:
        if center_type and office["type"] != center_type:
            continue
        dist = haversine(user_lat, user_lng, office["lat"], office["lng"])
        distances.append({**office, "distance_km": round(dist, 1)})
    
    distances.sort(key=lambda x: x["distance_km"])
    return distances[:n]


def get_offices_by_state(state_name):
    """Get all BIS offices in a given state."""
    return [
        o for o in BIS_REGIONAL_OFFICES 
        if state_name.lower() in o["state"].lower()
    ]


def get_offices_by_service(service_name):
    """Get all BIS offices offering a specific service."""
    return [
        o for o in BIS_REGIONAL_OFFICES
        if any(service_name.lower() in s.lower() for s in o["services"])
    ]


def get_product_guidance(category):
    """Get product-specific testing guidance."""
    return PRODUCT_CATEGORIES.get(category, None)
