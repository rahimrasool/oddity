# Netlify Deployment Guide

This guide explains how to deploy the Mil-OS prototype to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. A [Mapbox access token](https://account.mapbox.com/access-tokens/)
3. Your GitHub repository connected to Netlify

## Important Note: Backend Requirements

⚠️ **This is a full-stack application with a Node.js/Express backend**. Netlify only hosts static frontends by default.

You have two options:

### Option 1: Frontend-Only Demo (Limited Functionality)
Deploy just the frontend to Netlify. The following features will NOT work without the backend:
- Real-time data streaming (SINGULARITY ISR feeds, ARGUS social feed)
- Live equipment data (VANTAGE-PK, GAME ZONE)
- Historical attacks data (ODDITY)

### Option 2: Full Deployment (Recommended)
Deploy the backend separately and configure the frontend to connect to it:
1. Deploy backend to a service like Render, Railway, or Heroku
2. Update `VITE_API_URL` environment variable to point to your backend

## Deployment Steps (Frontend Only)

### Step 1: Configure Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. Select the repository: `rahimrasool/oddity`
5. Select the branch: `netlify-deployment`

### Step 2: Build Settings

Netlify will auto-detect the settings from `netlify.toml`, but verify:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`
- **Node version**: `20`

### Step 3: Environment Variables

Add these environment variables in Netlify:

Go to: Site settings → Environment variables → Add a variable

1. **VITE_MAPBOX_TOKEN**
   - Value: Your Mapbox access token
   - Get it from: https://account.mapbox.com/access-tokens/

2. **VITE_API_URL** (Optional - only if you have a deployed backend)
   - Value: Your backend API URL (e.g., `https://your-backend.render.com`)
   - Leave empty for frontend-only demo

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete (3-5 minutes)
3. Your site will be live at: `https://random-name-12345.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to: Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Backend Deployment (Recommended)

### Deploy Backend to Render

1. Go to [Render](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables:
   - `PORT=3001`
6. Deploy

### Update Frontend Configuration

After deploying the backend:
1. Copy your Render backend URL (e.g., `https://oddity-backend.onrender.com`)
2. Go to Netlify → Site settings → Environment variables
3. Update `VITE_API_URL` to your backend URL
4. Trigger a new deployment

## Testing Your Deployment

1. Navigate to your Netlify URL
2. Check each module:
   - **SINGULARITY**: Map should load (requires Mapbox token)
   - **VANTAGE-PK**: Will show "Loading..." if backend not available
   - **TITAN-PK**: Should work (no backend required)
   - **ODDITY**: Map loads, but attacks data requires backend
   - **ARGUS**: Requires backend for live feed
   - **GAME ZONE**: Requires backend for equipment data

## Troubleshooting

### Map Not Loading
- Check that `VITE_MAPBOX_TOKEN` is set correctly in Netlify
- Verify the token is valid at https://account.mapbox.com/

### "Failed to fetch" Errors
- Backend is not deployed or URL is incorrect
- Check `VITE_API_URL` environment variable
- Check CORS settings on your backend

### Build Failures
- Check build logs in Netlify
- Verify all dependencies are in `package.json`
- Ensure Node version is 20 or higher

### Routing Issues (404 on refresh)
- The `_redirects` file handles this
- Verify `frontend/public/_redirects` exists
- Check that `netlify.toml` has the redirect rule

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_MAPBOX_TOKEN` | Yes | Mapbox GL JS token | `pk.eyJ1...` |
| `VITE_API_URL` | No* | Backend API URL | `https://api.example.com` |

*Required for full functionality

## Performance Optimization

The build is already optimized with:
- Code splitting
- Tree shaking
- Minification
- Gzip compression (handled by Netlify)

## Security Headers

Security headers are configured in `netlify.toml`:
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Continuous Deployment

Once set up, Netlify will automatically:
1. Deploy when you push to the `netlify-deployment` branch
2. Build and deploy preview URLs for pull requests
3. Show build status in GitHub

## Cost Estimation

- **Netlify**: Free tier supports 100GB bandwidth/month
- **Render** (backend): Free tier available (will sleep after 15 min of inactivity)
- **Mapbox**: Free tier includes 50,000 map loads/month

## Support

For deployment issues:
- Check [Netlify docs](https://docs.netlify.com/)
- Check [Render docs](https://render.com/docs)
- Review build logs in Netlify dashboard
