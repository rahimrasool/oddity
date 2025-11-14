# Mil-OS Prototype - Deployment Guide

## 🏆 Recommended: Railway (Full Stack - 5 minutes)

**Railway is the easiest way to deploy both frontend and backend together.**

### Quick Deploy:
1. Go to https://railway.app/ and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `rahimrasool/oddity`
4. Deploy **Backend** service:
   - Root Directory: `/backend`
   - Get the backend URL
5. Deploy **Frontend** service:
   - Root Directory: `/frontend`
   - Add env vars: `VITE_MAPBOX_TOKEN` and `VITE_API_URL` (backend URL)
6. Done! All 6 modules work perfectly.

**Cost:** $5/month (includes both services, no cold starts)

📖 **Full Railway Guide:** [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

---

## Alternative: Netlify (Frontend Only)

### 1. Fork or Clone Repository
```bash
git clone https://github.com/rahimrasool/oddity.git
cd oddity
git checkout netlify-deployment
```

### 2. Get Mapbox Token
1. Create account at https://account.mapbox.com/
2. Generate new access token
3. Copy the token (starts with `pk.`)

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify UI
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Select branch: `netlify-deployment`
5. Build settings (auto-detected):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. Add environment variable:
   - Key: `VITE_MAPBOX_TOKEN`
   - Value: Your Mapbox token
7. Click "Deploy site"

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

### 4. Verify Deployment
Visit your Netlify URL (e.g., `https://your-site.netlify.app`)

## What Works in Frontend-Only Mode

✅ **Fully Functional (No Backend Required):**
- TITAN-PK: Sensor-to-Shooter Targeting Workflow
- Map rendering and navigation (all modules)
- UI interactions and animations

⚠️ **Limited Functionality (Requires Backend):**
- SINGULARITY: ISR feeds (static map only)
- VANTAGE-PK: Readiness data (will show loading state)
- ODDITY: Historical attacks (map only)
- ARGUS: Social media feed (empty)
- CHAKRAVYUH: Equipment data (will show loading state)

## Full Deployment (Frontend + Backend)

### Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Deploy Backend Service**
   ```
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
   - Environment: Node
   - Instance Type: Free
   ```

3. **Configure Environment**
   - Add environment variable: `PORT=3001`

4. **Get Backend URL**
   - Copy your Render URL (e.g., `https://oddity-backend.onrender.com`)

5. **Update Frontend**
   - Go to Netlify → Site settings → Environment variables
   - Add/Update: `VITE_API_URL` = Your Render backend URL
   - Trigger new deployment

### Alternative Backend Hosting Options

- **Railway**: https://railway.app/
- **Heroku**: https://www.heroku.com/
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
- **AWS Elastic Beanstalk**: https://aws.amazon.com/elasticbeanstalk/

## Environment Variables

### Required
- `VITE_MAPBOX_TOKEN`: Your Mapbox access token

### Optional
- `VITE_API_URL`: Backend API URL (for full functionality)

## Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Netlify)            │
│  - React + TypeScript + Vite           │
│  - Mantine UI + Mapbox GL              │
│  - Static site (SPA)                   │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  ├─────────────────────────┐
                  │                         │
┌─────────────────▼───────────┐  ┌────────▼─────────┐
│  Backend (Render/Railway)   │  │  Mapbox API      │
│  - Node.js + Express        │  │  - Map tiles     │
│  - REST API endpoints       │  │  - Geocoding     │
│  - SSE streaming            │  └──────────────────┘
└─────────────────────────────┘
```

## Build Configuration

The project includes:
- `netlify.toml` - Netlify configuration
- `frontend/public/_redirects` - SPA routing
- `.env.example` - Environment variables template

## Testing Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (separate terminal)
cd backend
npm install
npm run dev
```

Visit: http://localhost:5173/

## Troubleshooting

### Build Fails on Netlify
- Check build log in Netlify dashboard
- Verify Node version is 20+
- Ensure all dependencies are in package.json

### Map Not Loading
- Verify `VITE_MAPBOX_TOKEN` is set
- Check token is valid at https://account.mapbox.com/
- Check browser console for errors

### API Errors
- Backend not deployed or URL incorrect
- Check CORS configuration on backend
- Verify `VITE_API_URL` in Netlify settings

### 404 on Page Refresh
- Verify `_redirects` file exists in `frontend/public/`
- Check netlify.toml has redirect rules

## Performance

- Frontend bundle size: ~2-3 MB
- Initial load time: 2-4 seconds
- Mapbox tiles: Lazy loaded
- Code splitting: Enabled

## Security

- CSP headers configured
- XSS protection enabled
- No sensitive data in frontend
- Environment variables for secrets

## Cost Estimate

**Free Tier:**
- Netlify: 100GB bandwidth/month
- Render: Free tier with sleep (wakes on request)
- Mapbox: 50,000 map loads/month

**Paid (if needed):**
- Netlify Pro: $19/month
- Render Starter: $7/month
- Mapbox Pay-as-you-go: Starts at $5/1000 users

## Support

- Deployment issues: See NETLIFY_DEPLOYMENT.md
- Application setup: See README.md
- Technical questions: Open GitHub issue

## Next Steps After Deployment

1. ✅ Set custom domain (Netlify dashboard)
2. ✅ Enable HTTPS (automatic on Netlify)
3. ✅ Set up preview deployments for PRs
4. ✅ Configure deploy notifications
5. ✅ Add monitoring (optional)

## Continuous Deployment

Once configured, every push to `netlify-deployment` branch will:
1. Trigger automatic build
2. Run tests (if configured)
3. Deploy to production
4. Send notification

Preview deployments automatically created for PRs.
