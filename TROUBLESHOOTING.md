# Troubleshooting Guide - Mil-OS

## Map Not Showing Even With Valid Token

If your token works in `test-mapbox-token.html` but the map doesn't show in the frontend app, follow these steps:

### Step 1: Verify .env File Location and Contents

Make sure the `.env` file is in the **correct location**:
```
oddity/
├── frontend/
│   ├── .env          <-- Should be HERE
│   ├── src/
│   ├── package.json
│   └── ...
```

**NOT** in:
- `oddity/.env` (root directory - wrong!)
- `oddity/backend/.env` (backend directory - wrong!)

### Step 2: Check .env File Contents

Open `frontend/.env` and verify it looks like this:

```env
# Mapbox API Key
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNscXh4eHh4...your_actual_token_here

# Backend API URL
VITE_API_URL=http://localhost:3001
```

**Critical points:**
- No quotes around the token: `VITE_MAPBOX_TOKEN=pk.eyJ...` ✅
- NOT: `VITE_MAPBOX_TOKEN="pk.eyJ..."` ❌
- No spaces before or after the `=`
- The token should be the COMPLETE token (usually 100+ characters long)
- Must start with `pk.`

### Step 3: Restart the Dev Server

**This is critical!** Vite only reads `.env` files when the dev server starts.

1. In the terminal running the frontend, press **Ctrl+C** to stop it
2. Wait for it to fully stop
3. Run `npm run dev` again
4. Wait for it to say "Local: http://localhost:5173/"
5. Refresh your browser (or click the local URL)

### Step 4: Check the Environment Diagnostics

Once the dev server restarts and you refresh the browser, you should see a **blue info box in the top-right corner** showing:
- Your current `VITE_MAPBOX_TOKEN` value
- Whether it's formatted correctly
- Whether it's still a placeholder token

This will immediately tell you if the token is being loaded correctly.

### Step 5: Check Browser Console

Open your browser's developer console (F12) and look for errors:

**If you see "401 Unauthorized":**
- Your token format might be wrong
- The token might be expired or revoked
- Try generating a new token at https://account.mapbox.com/

**If you see "Failed to fetch":**
- Check your internet connection
- Make sure you're not behind a firewall blocking Mapbox

**If you see CORS errors:**
- This is normal for the Mapbox API - not an issue

### Step 6: Verify Backend is Running

Make sure the backend is running:

1. Open http://localhost:3001/health in your browser
2. You should see: `{"status":"ok","timestamp":"..."}`
3. If not, run the backend: `cd backend && npm run dev`

### Step 7: Common Mistakes

#### ❌ Wrong: Quotes around the token
```env
VITE_MAPBOX_TOKEN="pk.eyJ1IjoiZXhhbXBsZSI6..."
```

#### ✅ Correct: No quotes
```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSI6...
```

---

#### ❌ Wrong: Spaces around equals
```env
VITE_MAPBOX_TOKEN = pk.eyJ1IjoiZXhhbXBsZSI6...
```

#### ✅ Correct: No spaces
```env
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSI6...
```

---

#### ❌ Wrong: .env in wrong location
```
oddity/.env
```

#### ✅ Correct: .env in frontend folder
```
oddity/frontend/.env
```

---

#### ❌ Wrong: Didn't restart dev server
- Changed .env
- Just refreshed browser
- Still using old cached value

#### ✅ Correct: Restart dev server
1. Ctrl+C to stop
2. npm run dev to start
3. Refresh browser

### Step 8: Nuclear Option - Clear Everything

If nothing else works:

```bash
# Stop everything
# Press Ctrl+C in both terminal windows

# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# In Chrome/Edge: Ctrl+Shift+Delete > Clear cache
# Or open DevTools (F12) > Right-click refresh button > "Empty Cache and Hard Reload"

# Start fresh
npm run dev

# In a new terminal:
cd ../backend
npm run dev
```

### Step 9: Verify Your Token Again

As a sanity check, test your token one more time:

1. Open `test-mapbox-token.html` in browser
2. Paste your token
3. Click "Test Token"
4. Copy the EXACT token that works (don't retype it)
5. Paste it into `frontend/.env`

### Still Not Working?

Check these edge cases:

1. **Multiple .env files?** Make sure there's only ONE `.env` in the frontend folder
2. **.env.local or .env.development?** Vite prioritizes these over `.env` - delete them if they exist
3. **Running from wrong directory?** Make sure you run `npm run dev` from the `frontend` directory
4. **Port already in use?** If Vite uses a different port (like 5174), make sure you're accessing that port
5. **Browser extension blocking?** Try in incognito/private mode

### Success Indicators

You'll know it's working when:

✅ Environment diagnostics box (top-right) shows your actual token
✅ No red error screen in the map area
✅ You see a satellite map of Pakistan/Afghanistan
✅ Blue/orange circles appear on the map (intelligence reports)
✅ Browser console has no 401 errors

### Need More Help?

Include this information when asking for help:

1. Screenshot of the environment diagnostics box (top-right)
2. Screenshot of your `frontend/.env` file (hide the token, just show the format)
3. Browser console errors (F12 > Console tab)
4. Output from terminal running `npm run dev`
5. Result from `test-mapbox-token.html`

---

## Other Common Issues

### Backend Not Connecting

**Symptom:** Map loads, but no real-time updates or intel reports

**Fix:**
```bash
# Check backend is running
curl http://localhost:3001/health

# Should return: {"status":"ok",...}

# If not, start it:
cd backend
npm run dev
```

### CORS Errors

**Symptom:** Console shows CORS policy errors

**Fix:** This is normal! Mapbox API uses CORS for security. These errors are expected and don't affect functionality.

### Port Conflicts

**Symptom:** "Port 5173 already in use"

**Fix:** Vite will automatically use the next available port. Just use whatever port it says in the terminal (e.g., http://localhost:5174)

### TypeScript Errors

**Symptom:** Red underlines in VS Code, but app runs fine

**Fix:**
```bash
cd frontend
npm run build  # Check if it actually compiles
```

If it compiles, the errors are just VS Code being cautious.
