# Installing ODDITY Dependencies

The ODDITY module requires the mapbox-gl-draw package. Please run the following command:

```bash
cd frontend
npm install @mapbox/mapbox-gl-draw @types/mapbox__mapbox-gl-draw
```

After installation, restart your Vite dev server:

```bash
# Stop the current dev server (Ctrl+C), then:
npm run dev
```

This will install:
- @mapbox/mapbox-gl-draw - Drawing controls for Mapbox GL JS
- @types/mapbox__mapbox-gl-draw - TypeScript type definitions

The package is needed for the route planning feature in the ODDITY module.
