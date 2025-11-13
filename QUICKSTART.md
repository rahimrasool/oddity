# Quick Setup Guide - Mil-OS

## The map isn't showing? Here's the fix:

### Problem
The `.env` file contains a placeholder Mapbox token that needs to be replaced with a real one.

### Solution (Takes 2 minutes)

#### Step 1: Get Your FREE Mapbox Token
1. Go to **https://account.mapbox.com/**
2. Create a free account (or sign in if you have one)
3. You'll see your "Default public token" on the dashboard
4. Click the **copy icon** to copy the token

The token looks like this:
```
pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNscXh4eHh4eDAwMDB4...
```

#### Step 2: Update the .env File
1. Open the file: `frontend/.env`
2. Find this line:
   ```
   VITE_MAPBOX_TOKEN=pk.eyJ1IjoibWlsb3MtZGVtbyIsImEiOiJjbGZoZGxuZmEwMDAwM3NwYnN1OWxwdHB6In0.demo_token_replace_with_your_own
   ```
3. Replace the entire token with YOUR token:
   ```
   VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNscXh4eHh4eDAwMDB4...
   ```

#### Step 3: Restart the Frontend Server
1. In the terminal running the frontend, press **Ctrl+C** to stop it
2. Run `npm run dev` again
3. Refresh your browser

**That's it!** The map should now load.

---

## Full Startup Instructions

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
The backend runs on **http://localhost:3001**

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
The frontend runs on **http://localhost:5173** (or the next available port)

### Open Your Browser
Navigate to **http://localhost:5173**

---

## What You Should See

✅ Dark mode interface with MIL-OS branding
✅ Left sidebar with 6 module icons
✅ Top bar with "Commander, X Corps" and "SECRET" classification
✅ **Full-screen satellite map** centered on Pakistan-Afghanistan border
✅ Blue/orange circles (intelligence reports)
✅ Cyan pulsing circles (live ISR feeds)
✅ Plane icons (JF-17 fighters)

### Interactive Features
- **Click intel report circles** → See detailed report modal
- **Click ISR feed circles** → See feed information popup
- **Use time slider at bottom** → Filter data by date
- **Toggle layers in left sidebar** → Show/hide different data types
- **Map controls (top right)** → Zoom and rotate the map

---

## Still Having Issues?

### The map shows a blank/gray screen
- **Check browser console** (F12) for errors
- Verify your Mapbox token is valid by visiting: https://account.mapbox.com/
- Make sure you restarted the dev server after changing the .env file

### No real-time updates
- Ensure the backend is running on port 3001
- Check `http://localhost:3001/health` - should return `{"status":"ok"}`

### Port already in use
- Backend: Change `PORT` in `backend/src/index.ts`
- Frontend: Vite will automatically suggest the next available port

---

## Mapbox Token - Important Notes

- **Free tier**: 50,000 map loads/month (more than enough for development)
- **No credit card required** for the free tier
- **Public tokens are safe** to commit (they're restricted to your registered URLs)
- For production, set up **URL restrictions** in your Mapbox account settings

---

## Need Help?

1. Check the main `README.md` for detailed documentation
2. Look at browser console (F12) for error messages
3. Verify both backend and frontend are running
4. Make sure you're using Node.js 18+ (`node --version`)

---

**Pro Tip**: Bookmark the Mapbox dashboard - you'll need it to monitor usage and manage tokens!
