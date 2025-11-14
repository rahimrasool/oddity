# Railway Deployment Guide - Full Stack (Recommended)

Railway is the **recommended platform** for deploying the Mil-OS prototype because it:
- ✅ Deploys both frontend and backend from one repository
- ✅ Automatic HTTPS and custom domains
- ✅ Environment variable management
- ✅ Built-in PostgreSQL/Redis if needed
- ✅ Simple pricing ($5/month includes both services)
- ✅ Better developer experience than splitting across platforms

## Quick Deploy (5 minutes)

### Step 1: Sign Up for Railway

1. Go to https://railway.app/
2. Click "Login" and sign in with GitHub
3. You get $5 free credit (no credit card required)

### Step 2: Deploy Backend

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `rahimrasool/oddity`
4. Railway will detect the repository

5. **Configure Backend Service:**
   - Click "Add Service" → "GitHub Repo"
   - Root Directory: `/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variable:
     - `PORT` = `3001` (Railway will override with $PORT automatically)

6. **Get Backend URL:**
   - After deployment, click on the backend service
   - Copy the public domain (e.g., `https://oddity-backend-production.up.railway.app`)

### Step 3: Deploy Frontend

1. In the same project, click "New Service"
2. Select "Deploy from GitHub repo" (same repo)
3. Choose `rahimrasool/oddity`

4. **Configure Frontend Service:**
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx vite preview --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables:**
   - Click "Variables" tab
   - Add:
     ```
     VITE_MAPBOX_TOKEN=your_mapbox_token_here
     VITE_API_URL=https://your-backend-url.up.railway.app
     ```
   - Click "Add" for each variable

6. **Deploy:**
   - Railway automatically deploys
   - Wait 2-3 minutes
   - Click "Settings" → "Networking" to get your public URL

### Step 4: Verify Deployment

Visit your frontend URL. All features should work:
- ✅ SINGULARITY: Live ISR feeds
- ✅ VANTAGE-PK: Equipment data
- ✅ TITAN-PK: Targeting workflow
- ✅ ODDITY: Historical attacks
- ✅ ARGUS: Social media feed
- ✅ CHAKRAVYUH: Wargaming with live data

## Alternative: One-Click Deploy Button

Add this to your GitHub README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/oddity)
```

## Environment Variables Reference

### Backend Service
| Variable | Value | Required |
|----------|-------|----------|
| `PORT` | Auto-set by Railway | Yes |
| `NODE_ENV` | `production` | Optional |

### Frontend Service
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_MAPBOX_TOKEN` | Your Mapbox token | Yes |
| `VITE_API_URL` | Backend URL from Railway | Yes |

## Custom Domain (Optional)

1. Click on Frontend service
2. Go to "Settings" → "Networking"
3. Click "Custom Domain"
4. Add your domain (e.g., `mil-os.yourdomain.com`)
5. Update DNS records as instructed

## Cost Breakdown

**Free Tier:**
- $5 free credit (good for ~1 month)
- No credit card needed initially

**Paid:**
- $5/month for Hobby plan (includes both services)
- Usage-based pricing beyond that

**Comparison:**
```
Netlify + Render Free:  Limited, backend sleeps
Railway $5/month:       Both services always on
Vercel + Backend:       $20/month minimum
```

## Monitoring & Logs

1. **View Logs:**
   - Click on service
   - Click "Deployments"
   - Click latest deployment
   - View real-time logs

2. **Metrics:**
   - CPU usage
   - Memory usage
   - Request count
   - Response time

## Troubleshooting

### Build Fails

**Backend:**
```bash
# Check package.json has build script
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

**Frontend:**
```bash
# Verify build command works locally
cd frontend
npm install
npm run build
npx vite preview
```

### Environment Variables Not Working

1. Redeploy after adding variables
2. Check variable names match exactly (case-sensitive)
3. For `VITE_` variables, rebuild is required

### CORS Errors

Backend needs to allow frontend origin. Check `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
```

### Backend Can't Connect

1. Check backend URL in frontend env vars
2. Ensure backend has public networking enabled
3. Check backend health endpoint: `/health`

## Advanced Configuration

### Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up

# View logs
railway logs

# Open in browser
railway open
```

### Database (If Needed)

```bash
# Add PostgreSQL
railway add --plugin postgres

# Add Redis
railway add --plugin redis

# Environment variables automatically injected
```

### Continuous Deployment

Railway automatically deploys on:
- Push to main branch
- Pull request merges
- Manual trigger in dashboard

Configure in Settings → Deploys:
- Branch: `claude/netlify-deployment-011CV51s8dipiKqm6Hpsdx1s`
- Auto-deploy: Enabled

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use Railway's variable management

2. **API Keys:**
   - Rotate Mapbox token periodically
   - Use restricted tokens in production

3. **CORS:**
   - Set specific frontend origin in production
   - Don't use `*` in production

4. **Rate Limiting:**
   - Add to backend if needed:
   ```bash
   npm install express-rate-limit
   ```

## Performance Optimization

### Backend
- Enable gzip compression
- Add caching headers
- Use streaming for large responses

### Frontend
- Already optimized with Vite
- Code splitting enabled
- Tree shaking enabled
- Lazy loading for routes

## Migration from Other Platforms

### From Netlify + Render
1. Deploy both services to Railway
2. Update DNS to point to Railway
3. Cancel Netlify/Render subscriptions

### From Vercel
1. Export environment variables
2. Deploy to Railway
3. Update domains

## Support & Resources

- **Railway Docs:** https://docs.railway.app/
- **Discord:** https://discord.gg/railway
- **Status:** https://status.railway.app/
- **Pricing:** https://railway.app/pricing

## Comparison: Railway vs Others

| Feature | Railway | Netlify + Render | Vercel |
|---------|---------|------------------|--------|
| Full-stack | ✅ Easy | ⚠️ Split setup | ⚠️ Serverless only |
| WebSockets | ✅ Yes | ⚠️ Backend only | ❌ Limited |
| SSE Streaming | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Custom domains | ✅ Free | ✅ Free | ✅ Free |
| Database | ✅ Built-in | ❌ Separate | ❌ Separate |
| Price (hobby) | $5/month | $0-$7/month | $20/month |
| Developer UX | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## Why Railway for This Project?

1. **SSE Support:** ARGUS social feed uses Server-Sent Events
2. **WebSocket Ready:** If you add real-time features later
3. **Monorepo Friendly:** One repo, two services, easy
4. **No Sleep:** Backend stays awake (unlike Render free tier)
5. **Simple Pricing:** $5/month covers everything
6. **Great DX:** Best developer experience of all platforms

## Next Steps After Deployment

1. ✅ Add custom domain
2. ✅ Set up monitoring alerts
3. ✅ Configure automatic backups (if using DB)
4. ✅ Add staging environment
5. ✅ Set up preview deployments for PRs

## Conclusion

**Railway is recommended** because:
- Deploys both frontend and backend easily
- All features work out of the box
- Simple pricing and management
- Better than splitting across platforms
- Great for prototypes and production

Deploy now: https://railway.app/
