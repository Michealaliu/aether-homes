# Netlify Functions Deployment Guide

## Overview

This project has been configured to run on Netlify Functions, a serverless platform that eliminates the need for traditional server management.

## Architecture

### Before (Express Server)
- Single Node.js server running Express
- File-based data storage
- Requires continuous server uptime
- Manual scaling

### After (Netlify Functions)
- Serverless functions for each API endpoint
- Netlify Blob Storage for data persistence
- Auto-scaling infrastructure
- Pay-per-execution pricing
- Built-in CDN and caching

## File Structure

```
netlify/
├── functions/
│   ├── health.js              # Health check endpoint
│   ├── auth-login.js          # Authentication endpoint
│   ├── properties.js          # Property CRUD operations
│   ├── inquiries.js           # Inquiry management
│   ├── viewings.js            # Viewing management
│   ├── saved-searches.js      # Saved searches management
│   └── utils/
│       ├── storage.js         # Netlify Blob Storage interface
│       └── cors.js            # CORS headers helper
```

## API Endpoints

All endpoints are now available at `https://your-netlify-site.netlify.app/.netlify/functions/`

### Health Check
- `GET /.netlify/functions/health` or `/api/health`

### Authentication
- `POST /.netlify/functions/auth-login` or `/api/auth/login`
  - Body: `{ username, password }`
  - Default credentials: admin/aether123

### Properties
- `GET /.netlify/functions/properties` or `/api/properties` - List all properties
- `GET /.netlify/functions/properties/:id` or `/api/properties/:id` - Get single property
- `POST /.netlify/functions/properties` or `/api/properties` - Create property
- `PUT /.netlify/functions/properties/:id` or `/api/properties/:id` - Update property
- `DELETE /.netlify/functions/properties/:id` or `/api/properties/:id` - Delete property

### Inquiries
- `GET /.netlify/functions/inquiries` or `/api/inquiries` - List all inquiries
- `POST /.netlify/functions/inquiries` or `/api/inquiries` - Create inquiry

### Viewings
- `GET /.netlify/functions/viewings` or `/api/viewings` - List all viewings
- `POST /.netlify/functions/viewings` or `/api/viewings` - Create viewing

### Saved Searches
- `GET /.netlify/functions/saved-searches` or `/api/saved-searches` - List all saved searches
- `POST /.netlify/functions/saved-searches` or `/api/saved-searches` - Create saved search

## Deployment Steps

### 1. Connect to Netlify

```bash
npm install netlify-cli -g
netlify login
```

### 2. Create a New Netlify Site

```bash
netlify init
# Choose "Create & configure a new site"
# Follow the prompts
```

### 3. Deploy

```bash
netlify deploy --prod
```

### 4. Enable Netlify Blobs

1. Go to your Netlify site dashboard
2. Navigate to "Site Settings" → "Integrations"
3. Enable "Netlify Blobs" (may be automatic)
4. Confirm Blobs are enabled in your project

## Environment Variables

Set these in your Netlify site settings under "Build & deploy" → "Environment":

```
NODE_ENV=production
```

## Data Storage

### Netlify Blob Storage

Data is persisted using Netlify Blobs, which provides:
- Persistent storage across function invocations
- Automatic redundancy
- Simple key-value interface
- No additional cost (included with Netlify Pro/Team)

### Data Location

Data is stored in a `aether-homes` namespace with the key `store.json`:

```javascript
const store = await getStore('aether-homes');
const data = await store.get('store.json');
```

## Migration from Express Server

### What Changed

1. **Express routes** → **Netlify Functions**
   - Each function is a separate handler
   - Routes automatically mapped via netlify.toml

2. **File storage** → **Netlify Blobs**
   - No local filesystem
   - Async storage operations
   - Automatic backup and redundancy

3. **Server startup** → **Function invocation**
   - No long-running process
   - Functions scale automatically
   - Pay only for execution time

### Frontend Changes (If Needed)

The API endpoints remain the same thanks to the redirects in `netlify.toml`. Your frontend can continue using:

```javascript
// This works the same as before
fetch('/api/properties')
fetch('/api/inquiries', { method: 'POST', body: ... })
```

## Monitoring

### View Logs

```bash
netlify functions:invoke health
netlify logs
```

### Monitor Performance

- Netlify Dashboard → Analytics
- Function invocation counts
- Error rates
- Cold start times

## Cold Starts

Serverless functions may have a "cold start" delay (typically 100-500ms) when invoked after a period of inactivity. This is normal and happens only on the first invocation after a timeout.

## Costs

### Free Tier
- 125,000 invocations/month
- Basic Blobs storage

### Pro/Team Plans
- Included Blobs storage
- Higher invocation limits
- Priority support

## Troubleshooting

### Function Logs Not Showing

```bash
netlify logs --tail
```

### Blobs Not Working

1. Verify Netlify account is Pro or Team (for persistent Blobs)
2. Check site settings for Blobs enablement
3. Ensure `@netlify/blobs` is in package.json

### CORS Issues

All functions include CORS headers. If you still have issues:

1. Check browser console for specific errors
2. Verify the request origin is allowed
3. Ensure OPTIONS preflight requests are handled

### Fallback to Local Development

```bash
netlify dev
```

This runs Netlify Functions locally with live reloading.

## Next Steps

1. **Database Migration**: Move from Blobs to a dedicated database (MongoDB, PostgreSQL, etc.) for production
2. **Authentication**: Implement proper JWT/OAuth authentication
3. **Email Notifications**: Add email sending via Netlify Functions
4. **Image Optimization**: Use Netlify Image Optimization service
5. **Analytics**: Integrate with Segment or similar

## Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Functions: https://docs.netlify.com/functions/overview/
- Netlify Blobs: https://docs.netlify.com/blobs/overview/
