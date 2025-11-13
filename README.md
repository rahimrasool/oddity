# Mil-OS: Military Operating System Prototype

A high-fidelity, interactive web application prototype for a "Military Operating System (Mil-OS)" featuring a dark mode aesthetic suitable for 24/7 command center operations. This application serves as a "single pane of glass" integrating multiple operational modules.

---

## 🚀 Quick Start

**Map not showing?** → See **[QUICKSTART.md](./QUICKSTART.md)** for a 2-minute fix!

The issue is likely the Mapbox token needs to be configured in `frontend/.env`.

---

## Features

### Current Implementation (Step 0 & Step 1)

✅ **Core Application Shell ("Carbon Shell")**
- Persistent, thin, icon-based navigation bar on the left
- Top bar with user information and classification banner
- Six module framework (SINGULARITY currently implemented)
- Full dark mode theme optimized for command centers

✅ **SINGULARITY Module - All-Domain Common Operating Picture**
- Full-screen Mapbox satellite map with dark mode
- Real-time streaming ISR feeds (drones and satellites)
- Real-time air asset tracking (JF-17 fighters)
- 100+ historical intelligence reports (HUMINT/SIGINT)
- Enemy unit position tracking (TTP)
- Object Explorer sidebar with layer toggles
- Time series slider for temporal data filtering
- Interactive modals for intel report details
- Interactive popups for ISR feed information

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Mantine UI (dark mode)
- Mapbox GL JS for geospatial visualization
- Recharts (ready for future modules)
- react-force-graph (ready for future modules)

**Backend:**
- Node.js with Express
- TypeScript
- Server-Sent Events (SSE) for real-time data streaming
- Mock data generators for realistic military scenarios

**Data Models:**
- Comprehensive ontology in `frontend/src/types/ontology.ts`
- Interfaces for assets, intelligence, units, and more

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Mapbox API token (free tier available)

### 1. Get Mapbox API Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Create a free account or sign in
3. Create a new access token
4. Copy the token

### 2. Configure Environment

Edit `frontend/.env` and replace the Mapbox token:

```env
VITE_MAPBOX_TOKEN=your_actual_mapbox_token_here
VITE_API_URL=http://localhost:3001
```

### 3. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 5. Access the Application

Open your browser to `http://localhost:5173`

You should see:
- Dark mode interface with "MIL-OS" branding
- Classification banner showing "SECRET"
- User info: "Commander, X Corps"
- Left navigation with 6 module icons
- SINGULARITY module active by default

## Using SINGULARITY Module

### Layer Controls
- Click the icon buttons in the Object Explorer (left sidebar) to toggle layers:
  - **ISR Feeds** (cyan/purple pulsing circles) - Live drone and satellite feeds
  - **Intel Reports** (blue/orange circles) - HUMINT and SIGINT reports
  - **Enemy Units** (red circles) - Known TTP positions
  - **Friendly Assets** (plane icons) - JF-17 fighters
  - **Historical Attacks** - (not yet implemented)

### Time Series Filter
- Use the slider at the bottom to filter data by timestamp
- Drag the range handles to select a time window (last 30 days)
- Data outside the selected range will be hidden

### Interactions
- **Click on Intel Reports** → Opens detailed modal with:
  - Report type (HUMINT/SIGINT)
  - Timestamp and location
  - Reliability rating (A/B/C)
  - Full report text

- **Click on ISR Feeds** → Opens popup with:
  - Feed ID and type (Drone/Satellite)
  - Current altitude
  - Status (Streaming/Tasked)
  - Unit assignment
  - Feed URL (non-functional placeholder)

### Real-time Updates
- ISR feeds and air assets update their positions every 2 seconds
- Watch the map for moving assets (drones, satellites, fighters)
- Cyan circles pulse to indicate active feeds

## Project Structure

```
oddity/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CarbonShell.tsx         # Main app shell
│   │   │   ├── LeftNavigation.tsx      # Module navigation
│   │   │   ├── TopBar.tsx              # Header with user/classification
│   │   │   ├── modules/
│   │   │   │   └── Singularity.tsx     # SINGULARITY module
│   │   │   └── map/
│   │   │       ├── MapComponent.tsx    # Mapbox integration
│   │   │       ├── ObjectExplorer.tsx  # Layer controls
│   │   │       └── TimeSeriesSlider.tsx# Time filter
│   │   ├── types/
│   │   │   └── ontology.ts             # Core data models
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── index.ts                    # Express server
    │   └── mockData.ts                 # Data generators
    └── package.json
```

## API Endpoints

### `GET /api/v1/tracks` (Streaming)
Server-Sent Events endpoint that pushes updates every 2 seconds:
```json
{
  "isrFeeds": [...],
  "assetAir": [...],
  "timestamp": "2025-11-13T..."
}
```

### `GET /api/v1/intel_reports` (Static)
Returns GeoJSON FeatureCollection with 100+ features:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "dataType": "IntelReport", ... },
      "geometry": { "type": "Point", "coordinates": [...] }
    }
  ]
}
```

## Operational Area

The prototype is centered on the **Pakistan-Afghanistan border region** (Khyber Pakhtunkhwa / FATA):
- Center coordinates: 33.5°N, 70.5°E
- Mock data includes realistic military scenarios for this theater
- TTP (Tehrik-i-Taliban Pakistan) as adversary force
- Pakistani military units (X Corps, 101st Brigade, ISI, Air Force)

## Future Modules (Placeholders)

- **GUARDIAN** - Force Protection & Asset Tracker
- **PROPHET** - Predictive Analytics
- **NEXUS** - Network Analysis
- **VANGUARD** - Mission Planning
- **SENTINEL** - Information Operations

## Development Notes

### Dark Mode Theme
All components use Mantine's dark color scheme with custom styling:
- Background: `#0a0a0a` (main), `#161616` (panels)
- Borders: `#2a2a2a`
- Primary accent: `#2a7fff`
- Gradients for emphasis

### Real-time Data
- Backend maintains state for moving objects (velocity vectors)
- Positions update smoothly with boundary bouncing
- EventSource (SSE) used instead of WebSockets for simplicity

### Map Markers
- Dynamic marker creation/update using Mapbox GL JS
- Custom HTML markers for different entity types
- Pulsing animation for active ISR feeds
- Click handlers for interactive elements

## Troubleshooting

**Map not loading:**
- Check that Mapbox token is correctly set in `frontend/.env`
- Verify token is valid at https://account.mapbox.com/

**No real-time updates:**
- Ensure backend is running on port 3001
- Check browser console for EventSource errors
- Verify CORS is enabled (already configured)

**Port conflicts:**
- Backend: Change `PORT` in `backend/src/index.ts`
- Frontend: Vite will automatically use next available port

## Performance

- Handles 100+ static markers (intel reports)
- Real-time updates for 9 moving objects
- Optimized marker updates (reuse existing markers)
- Efficient time-based filtering

## Security Notes

This is a **prototype** for demonstration purposes:
- Uses mock data, not real intelligence
- Classification banner is cosmetic
- No authentication/authorization implemented
- API endpoints are open (no security)

## License

Prototype/Educational purposes only.

## Next Steps

To continue development:
1. Implement remaining 5 modules (GUARDIAN, PROPHET, NEXUS, VANGUARD, SENTINEL)
2. Add authentication and role-based access control
3. Integrate real data sources
4. Add mission planning tools
5. Implement collaborative features
6. Add data export capabilities
7. Enhance analytics and reporting
