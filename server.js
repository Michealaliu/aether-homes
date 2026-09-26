const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const storePath = path.join(dataDir, 'store.json');

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
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85'],
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
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85'],
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

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(defaultStore, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(storePath, 'utf8'));
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Aether Homes API is running.' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const validUsername = 'admin';
  const validPassword = 'aether123';

  if (username === validUsername && password === validPassword) {
    return res.json({ ok: true, token: 'demo-admin-token', user: { username } });
  }

  return res.status(401).json({ ok: false, message: 'Invalid username or password.' });
});

app.get('/api/properties', (req, res) => {
  const store = readStore();
  res.json(store.properties);
});

app.post('/api/properties', (req, res) => {
  const store = readStore();
  const property = req.body;
  property.id = Date.now();
  if (!property.images || !property.images.length) {
    property.images = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85'];
  }
  store.properties.unshift(property);
  writeStore(store);
  res.status(201).json({ ok: true, property });
});

app.put('/api/properties/:id', (req, res) => {
  const store = readStore();
  const id = Number(req.params.id);
  const index = store.properties.findIndex((p) => Number(p.id) === id);
  if (index === -1) return res.status(404).json({ ok: false, message: 'Property not found.' });
  store.properties[index] = { ...store.properties[index], ...req.body, id };
  writeStore(store);
  res.json({ ok: true, property: store.properties[index] });
});

app.delete('/api/properties/:id', (req, res) => {
  const store = readStore();
  const id = Number(req.params.id);
  store.properties = store.properties.filter((p) => Number(p.id) !== id);
  writeStore(store);
  res.json({ ok: true, id });
});

app.get('/api/inquiries', (req, res) => {
  const store = readStore();
  res.json(store.inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const store = readStore();
  const inquiry = { id: Date.now(), createdAt: new Date().toISOString(), ...req.body };
  store.inquiries.unshift(inquiry);
  writeStore(store);
  res.status(201).json({ ok: true, inquiry });
});

app.get('/api/viewings', (req, res) => {
  const store = readStore();
  res.json(store.viewings);
});

app.post('/api/viewings', (req, res) => {
  const store = readStore();
  const viewing = { id: Date.now(), createdAt: new Date().toISOString(), ...req.body };
  store.viewings.unshift(viewing);
  writeStore(store);
  res.status(201).json({ ok: true, viewing });
});

app.get('/api/saved-searches', (req, res) => {
  const store = readStore();
  res.json(store.savedSearches);
});

app.post('/api/saved-searches', (req, res) => {
  const store = readStore();
  const entry = { id: Date.now(), createdAt: new Date().toISOString(), ...req.body };
  store.savedSearches.unshift(entry);
  writeStore(store);
  res.json({ ok: true, entry });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Aether Homes backend listening on http://localhost:${PORT}`);
});
