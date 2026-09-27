const { readStore, writeStore } = require('./utils/storage');
const { getCorsHeaders, handleCors } = require('./utils/cors');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const headers = getCorsHeaders();

  try {
    const method = event.httpMethod;

    // GET /api/inquiries - Get all inquiries
    if (method === 'GET') {
      const store = await readStore();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(store.inquiries)
      };
    }

    // POST /api/inquiries - Create inquiry
    if (method === 'POST') {
      const store = await readStore();
      const inquiry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...JSON.parse(event.body || '{}')
      };
      store.inquiries.unshift(inquiry);
      await writeStore(store);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, inquiry })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Inquiries error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, message: error.message })
    };
  }
};
