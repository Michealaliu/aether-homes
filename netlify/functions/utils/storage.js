// Storage utility using Netlify Blob Storage
const { getStore } = require('@netlify/blobs');

const defaultStore = {
  properties: [
    {
      id: 1,
      title: 'Oceanview Villa',
      type: 'Villa',
      status: 'For Sale',
      price: 285000000,
      location: 'Lagos',
      neighborhood: 'Lekki Phase 1',
      address: '45 Oceanview Drive, Lekki Phase 1, Lagos',
      beds: 5,
      baths: 6,
      area: 680,
      parking: 4,
      yearBuilt: 2019,
      furnishing: 'Fully Furnished',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85'],
      badge: 'Featured',
      desc: 'Exquisite waterfront villa with panoramic ocean views, private pool, and smart home technology designed for refined coastal living.',
      amenities: ['Private Pool', 'Smart Home System', 'Security Gate', 'Guest House', 'Garden Lounge'],
      virtualTour: 'https://www.google.com/maps?q=Lekki+Phase+1+Lagos',
      verified: true,
      mapPlace: 'Lekki Phase 1, Lagos'
    },
    {
      id: 2,
      title: 'Modern Penthouse',
      type: 'Apartment',
      status: 'For Sale',
      price: 145000000,
      location: 'Abuja',
      neighborhood: 'Wuse District',
      address: '18 Suleiman Avenue, Wuse District, Abuja',
      beds: 4,
      baths: 4,
      area: 320,
      parking: 2,
      yearBuilt: 2022,
      furnishing: 'Semi-Furnished',
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=85'],
      badge: 'New',
      desc: 'Stunning penthouse with floor-to-ceiling windows and a private terrace, offering exceptional city views and walkable proximity to key business districts.',
      amenities: ['Terrace', 'Concierge', 'Gym Access', 'EV Charging', 'City View'],
      virtualTour: 'https://www.google.com/maps?q=Wuse+District+Abuja',
      verified: true,
      mapPlace: 'Wuse District, Abuja'
    }
  ],
  inquiries: [],
  viewings: [],
  savedSearches: []
};

async function readStore() {
  try {
    const store = await getStore('aether-homes');
    const data = await store.get('store.json');
    return data ? JSON.parse(data) : defaultStore;
  } catch (error) {
    console.error('Error reading store:', error);
    return defaultStore;
  }
}

async function writeStore(data) {
  try {
    const store = await getStore('aether-homes');
    await store.set('store.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing store:', error);
    throw error;
  }
}

module.exports = { readStore, writeStore };
