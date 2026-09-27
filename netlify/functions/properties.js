const { readStore, writeStore } = require('./utils/storage');
const { getCorsHeaders, handleCors } = require('./utils/cors');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const headers = getCorsHeaders();

  try {
    const method = event.httpMethod;
    const path = event.path;
    const id = path.split('/').pop();

    // GET /api/properties - Get all properties
    if (method === 'GET' && !id) {
      const store = await readStore();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(store.properties)
      };
    }

    // GET /api/properties/:id - Get single property
    if (method === 'GET' && id && id !== 'properties') {
      const store = await readStore();
      const property = store.properties.find(p => Number(p.id) === Number(id));
      if (!property) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ ok: false, message: 'Property not found.' })
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(property)
      };
    }

    // POST /api/properties - Create property
    if (method === 'POST') {
      const store = await readStore();
      const property = JSON.parse(event.body || '{}');
      property.id = Date.now();
      if (!property.images || !property.images.length) {
        property.images = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85'];
      }
      store.properties.unshift(property);
      await writeStore(store);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, property })
      };
    }

    // PUT /api/properties/:id - Update property
    if (method === 'PUT' && id && id !== 'properties') {
      const store = await readStore();
      const numId = Number(id);
      const index = store.properties.findIndex(p => Number(p.id) === numId);
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ ok: false, message: 'Property not found.' })
        };
      }
      const updates = JSON.parse(event.body || '{}');
      store.properties[index] = { ...store.properties[index], ...updates, id: numId };
      await writeStore(store);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, property: store.properties[index] })
      };
    }

    // DELETE /api/properties/:id - Delete property
    if (method === 'DELETE' && id && id !== 'properties') {
      const store = await readStore();
      const numId = Number(id);
      store.properties = store.properties.filter(p => Number(p.id) !== numId);
      await writeStore(store);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, id: numId })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Properties error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, message: error.message })
    };
  }
};
