// Discover items data with enhanced structure and validation
export const discoverItems = [
    {
        id: 1,
        name: "Ibom Plaza",
        address: "Aka Road, Uyo, Akwa Ibom State",
        description: "A modern shopping complex and business hub featuring retail stores, restaurants, and office spaces. Perfect for business meetings and shopping.",
        image: "images/ibom-plaza.webp",
        category: "Shopping & Business",
        coordinates: { lat: 5.0378, lng: 7.9085 },
        established: "2010",
        website: "https://ibomplaza.com",
        accessibility: true
    },
    {
        id: 2,
        name: "Godswill Akpabio International Stadium",
        address: "Uyo Township Stadium, Uyo, Akwa Ibom State",
        description: "World-class stadium hosting international football matches and major events. A symbol of modern infrastructure in Akwa Ibom State.",
        image: "images/stadium.webp",
        category: "Sports & Recreation",
        coordinates: { lat: 5.0288, lng: 7.9085 },
        established: "2014",
        website: "https://akwaibomstadium.gov.ng",
        accessibility: true
    },
    {
        id: 3,
        name: "Ibom Connection",
        address: "Oron Road, Uyo, Akwa Ibom State",
        description: "Premier entertainment and hospitality complex with restaurants, bars, and event halls. Popular venue for business networking events.",
        image: "images/ibom-connection.webp",
        category: "Entertainment & Hospitality",
        coordinates: { lat: 5.0445, lng: 7.9185 },
        established: "2008",
        website: "https://ibomconnection.com",
        accessibility: true
    },
    {
        id: 4,
        name: "Akwa Ibom State Secretariat",
        address: "Wellington Bassey Way, Uyo, Akwa Ibom State",
        description: "The administrative headquarters of Akwa Ibom State government. Modern architectural marvel and center of governance.",
        image: "images/secretariat.webp",
        category: "Government & Administration",
        coordinates: { lat: 5.0378, lng: 7.9285 },
        established: "2007",
        website: "https://akwaibomstate.gov.ng",
        accessibility: true
    },
    {
        id: 5,
        name: "Ibom Tropicana Entertainment Centre",
        address: "Nsikak Eduok Avenue, Uyo, Akwa Ibom State",
        description: "Entertainment complex featuring cinema, restaurants, and recreational facilities. Great for family outings and business entertainment.",
        image: "images/tropicana.webp",
        category: "Entertainment & Recreation",
        coordinates: { lat: 5.0398, lng: 7.9195 },
        established: "2012",
        website: "https://tropicana-uyo.com",
        accessibility: true
    },
    {
        id: 6,
        name: "University of Uyo",
        address: "Nwaniba Road, Uyo, Akwa Ibom State",
        description: "Leading university in South-South Nigeria offering quality education and research opportunities. Hub for academic and business partnerships.",
        image: "images/uniuyo.webp",
        category: "Education & Research",
        coordinates: { lat: 5.0178, lng: 7.9385 },
        established: "1991",
        website: "https://uniuyo.edu.ng",
        accessibility: true
    },
    {
        id: 7,
        name: "Akwa Ibom International Airport",
        address: "Okobo, Akwa Ibom State",
        description: "Modern international airport serving the region with domestic and international flights. Gateway to business opportunities in the state.",
        image: "images/airport.webp",
        category: "Transportation & Infrastructure",
        coordinates: { lat: 4.8725, lng: 7.9695 },
        established: "2009",
        website: "https://akwaibomairport.gov.ng",
        accessibility: true
    },
    {
        id: 8,
        name: "Le Meridien Ibom Hotel & Golf Resort",
        address: "Nsikak Eduok Avenue, Uyo, Akwa Ibom State",
        description: "Luxury 5-star hotel and golf resort. Premier venue for high-level business meetings, conferences, and corporate events.",
        image: "images/meridien.webp",
        category: "Hospitality & Tourism",
        coordinates: { lat: 5.0388, lng: 7.9175 },
        established: "2011",
        website: "https://lemeridien-uyo.com",
        accessibility: true
    }
];

// Data validation function
export function validateDiscoverItem(item) {
    const requiredFields = ['id', 'name', 'address', 'description', 'image'];
    
    for (const field of requiredFields) {
        if (!item[field] || typeof item[field] !== 'string') {
            return false;
        }
    }
    
    // Validate ID is a number
    if (typeof item.id !== 'number' || item.id <= 0) {
        return false;
    }
    
    // Validate coordinates if present
    if (item.coordinates) {
        if (typeof item.coordinates.lat !== 'number' || typeof item.coordinates.lng !== 'number') {
            return false;
        }
    }
    
    return true;
}

// Get items by category
export function getItemsByCategory(category) {
    return discoverItems.filter(item => item.category === category);
}

// Get item by ID
export function getItemById(id) {
    return discoverItems.find(item => item.id === id);
}