# Aether Homes - Netlify Functions Setup

## Quick Start

This branch (`setup/netlify-functions`) contains the serverless backend configuration for Netlify Functions deployment.

## What's New

✅ **Netlify Functions** - Serverless API endpoints  
✅ **Netlify Blobs** - Persistent data storage  
✅ **CORS Handling** - Pre-configured for cross-origin requests  
✅ **Auto-scaling** - Handles traffic automatically  
✅ **Zero downtime** - No server management needed  

## Files Added

### Core Functions
- `netlify/functions/health.js` - Health check
- `netlify/functions/auth-login.js` - Authentication
- `netlify/functions/properties.js` - Property management
- `netlify/functions/inquiries.js` - Inquiry tracking
- `netlify/functions/viewings.js` - Viewing management
- `netlify/functions/saved-searches.js` - Saved searches

### Utilities
- `netlify/functions/utils/storage.js` - Netlify Blob Storage wrapper
- `netlify/functions/utils/cors.js` - CORS headers helper

### Configuration
- Updated `netlify.toml` - Function routing and redirects
- Updated `package.json` - Added @netlify/blobs dependency

### Documentation
- `docs/NETLIFY_DEPLOYMENT.md` - Complete deployment guide

## Getting Started

### 1. Review the Setup
Check out the files in `netlify/functions/` to understand the serverless architecture.

### 2. Test Locally
```bash
npm install
netlify dev
```

This will start a local development server with all functions available at `http://localhost:8888/.netlify/functions/`

### 3. Deploy to Netlify

**Option A: Via GitHub Integration**
- Push this branch to GitHub
- Connect your repo to Netlify via GitHub
- Auto-deploys on push

**Option B: Via Netlify CLI**
```bash
npm install netlify-cli -g
netlify login
netlify deploy --prod
```

### 4. Verify Deployment
```bash
curl https://your-site.netlify.app/.netlify/functions/health
```

You should see:
```json
{
  "ok": true,
  "message": "Aether Homes API is running on Netlify Functions."
}
```

## API Compatibility

All existing API endpoints work exactly the same:

```javascript
// Your frontend code doesn't change
fetch('/api/properties')
fetch('/api/inquiries', { method: 'POST', body: ... })
fetch('/api/properties/123', { method: 'DELETE' })
```

The `netlify.toml` redirects `/api/*` to `.netlify/functions/*` automatically.

## Key Improvements Over Express

| Feature | Express | Netlify Functions |
|---------|---------|-------------------|
| **Scaling** | Manual | Automatic |
| **Cost** | Fixed (server) | Pay-per-execution |
| **Uptime** | Manual SLA | 99.99% guaranteed |
| **Cold starts** | None | ~100-500ms (rare) |
| **Data storage** | File system | Netlify Blobs (persistent) |
| **Monitoring** | Manual | Built-in |
| **Deployment** | Complex | Git-integrated |

## Next Merge Steps

1. Review this PR
2. Test locally with `netlify dev`
3. Merge to `main`
4. Connect to Netlify or deploy via CLI
5. Monitor initial deployments
6. Update API documentation with new endpoint URLs

## Questions?

See `docs/NETLIFY_DEPLOYMENT.md` for detailed information.

---

**Ready to go serverless? 🚀**
