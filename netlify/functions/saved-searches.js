const { readStore, writeStore } = require('./utils/storage');
const { getCorsHeaders, handleCors } = require('./utils/cors');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const headers = getCorsHeaders();

  try {
    const method = event.httpMethod;

    // GET /api/saved-searches - Get all saved searches
    if (method === 'GET') {
      const store = await readStore();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(store.savedSearches)
      };
    }

    // POST /api/saved-searches - Create saved search
    if (method === 'POST') {
      const store = await readStore();
      const entry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...JSON.parse(event.body || '{}')
      };
      store.savedSearches.unshift(entry);
      await writeStore(store);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, entry })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Saved searches error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, message: error.message })
    };
  }
};
