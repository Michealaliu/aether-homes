const { readStore, writeStore } = require('./utils/storage');
const { getCorsHeaders, handleCors } = require('./utils/cors');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const headers = getCorsHeaders();

  try {
    const method = event.httpMethod;

    // GET /api/viewings - Get all viewings
    if (method === 'GET') {
      const store = await readStore();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(store.viewings)
      };
    }

    // POST /api/viewings - Create viewing
    if (method === 'POST') {
      const store = await readStore();
      const viewing = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...JSON.parse(event.body || '{}')
      };
      store.viewings.unshift(viewing);
      await writeStore(store);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, viewing })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Viewings error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, message: error.message })
    };
  }
};
