# Railway Two-Service Setup - Quick Reference

## Problem
Your Railway deployment only shows the frontend. API endpoints don't work because the **backend service isn't deployed**.

## Solution
Deploy **TWO separate services** in the same Railway project:

---

## Service 1: Backend API

**Settings:**
- Root Directory: `backend`
- Build Command: (leave empty, uses nixpacks.toml)
- Start Command: (leave empty, uses nixpacks.toml)

**Environment Variables:**
```
PORT=3001
```

**Expected Result:**
- Service starts on Railway-assigned port
- Backend URL: `https://[your-backend].up.railway.app`
- Example: `https://oddity-backend.up.railway.app`

---

## Service 2: Frontend

**Settings:**
- Root Directory: `frontend`
- Build Command: (leave empty, uses nixpacks.toml)
- Start Command: (leave empty, uses nixpacks.toml)

**Environment Variables:**
```
VITE_API_URL=https://[your-backend].up.railway.app
VITE_MAPBOX_TOKEN=pk.eyJ1IjoibWlsb3MtZGVtbyIsImEiOiJjbGZoZGxuZmEwMDAwM3NwYnN1OWxwdHB6In0.demo_token_replace_with_your_own
```

**Expected Result:**
- Frontend starts on Railway-assigned port
- Frontend URL: `https://[your-frontend].up.railway.app`
- Example: `https://mil-os.up.railway.app`

---

## Step-by-Step Instructions

### 1. Delete Current Service (if needed)
If you already have a service running:
- Click on the service → Settings → Delete Service

### 2. Deploy Backend First

1. In your Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `rahimrasool/oddity`
4. Railway will create a new service

5. **Configure the service:**
   - Click on Settings
   - **Root Directory:** `backend`
   - Leave build/start commands empty (uses nixpacks.toml)

6. **Add environment variables:**
   - Go to Variables tab
   - Add `PORT` = `3001`

7. **Get the backend URL:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://oddity-backend.up.railway.app`)

### 3. Deploy Frontend Second

1. Click **"New Service"** again (in the same project)
2. Select **"Deploy from GitHub repo"**
3. Choose the same repository: `rahimrasool/oddity`

4. **Configure the service:**
   - Click on Settings
   - **Root Directory:** `frontend`
   - Leave build/start commands empty (uses nixpacks.toml)

5. **Add environment variables:**
   - Go to Variables tab
   - Add `VITE_API_URL` = `https://[your-backend-url].up.railway.app`
   - Add `VITE_MAPBOX_TOKEN` = your Mapbox token

6. **Generate frontend domain:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Or add custom domain: `mil-os.up.railway.app`

### 4. Verify Deployment

**Backend Health Check:**
Visit: `https://[your-backend].up.railway.app/api/v1/tracks`

You should see JSON data with ISR tracks.

**Frontend Check:**
Visit: `https://[your-frontend].up.railway.app`

You should see the Mil-OS interface with working modules.

---

## Configuration Files

I've created `nixpacks.toml` files in both directories:

**backend/nixpacks.toml:**
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
PORT = "3001"
```

**frontend/nixpacks.toml:**
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run preview -- --host 0.0.0.0 --port $PORT"

[variables]
NODE_ENV = "production"
```

These tell Railway how to build and start each service.

---

## Troubleshooting

### Frontend shows but API fails
- ✅ Backend service is running
- ❌ `VITE_API_URL` environment variable not set correctly
- **Fix:** Set `VITE_API_URL` to your backend Railway URL and redeploy

### Backend returns 404
- Check the backend logs for errors
- Verify the backend is running: `https://[backend]/api/v1/tracks`

### CORS errors
- Backend already has CORS enabled for all origins
- If issues persist, check backend logs

### Vite "Blocked request" error
- Already fixed in `frontend/vite.config.ts`
- If new domain, add to `allowedHosts` array

---

## Cost Estimate

**Railway Pricing:**
- **Free Tier:** $5 free credit (no credit card)
- **Pro Tier:** $5/month for both services
- Backend: ~$2.50/month (always-on)
- Frontend: ~$2.50/month (always-on)

**Total: $5/month for complete deployment** ✅

---

## Need Help?

See full guide: `RAILWAY_DEPLOYMENT.md`
