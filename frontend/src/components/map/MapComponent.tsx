import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { IntelReport, ISRFeed, AssetAir } from '../../types/ontology';

interface MapComponentProps {
  selectedLayers: Set<string>;
  timeRange: [number, number];
  onIntelReportClick: (report: IntelReport) => void;
  onISRFeedClick: (feed: ISRFeed) => void;
}

// Set Mapbox access token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

export function MapComponent({
  selectedLayers,
  timeRange,
  onIntelReportClick,
  onISRFeedClick,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [intelData, setIntelData] = useState<any>(null);
  const [trackData, setTrackData] = useState<{ isrFeeds: ISRFeed[]; assetAir: AssetAir[] } | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize map
  useEffect(() => {
    console.log('[MapComponent] useEffect triggered');
    console.log('[MapComponent] mapContainer.current:', mapContainer.current);
    console.log('[MapComponent] map.current:', map.current);
    console.log('[MapComponent] mapboxgl version:', mapboxgl.version);
    console.log('[MapComponent] mapboxgl.supported():', mapboxgl.supported());

    if (!mapContainer.current) {
      console.error('[MapComponent] mapContainer.current is null! Ref not attached.');
      setLoadingStatus('Error: Map container not found');
      setMapError('MAP_INIT_ERROR');
      return;
    }

    if (map.current) {
      console.log('[MapComponent] Map already exists, skipping initialization');
      return;
    }

    console.log('[MapComponent] Initializing with token:', MAPBOX_TOKEN?.substring(0, 20) + '...');
    setLoadingStatus('Checking token...');

    // Check for valid Mapbox token
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('demo_token') || MAPBOX_TOKEN.includes('replace_with_your_own')) {
      console.error('[MapComponent] Invalid token detected');
      setMapError('MAPBOX_TOKEN_MISSING');
      return;
    }

    // Check if Mapbox GL is supported
    if (!mapboxgl.supported()) {
      console.error('[MapComponent] Mapbox GL is not supported in this browser');
      setMapError('MAP_INIT_ERROR');
      setLoadingStatus('Browser not supported');
      return;
    }

    setLoadingStatus('Creating map instance...');
    console.log('[MapComponent] Token validation passed, creating map...');

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [70.5, 33.5], // Pakistan-Afghanistan border region
        zoom: 8,
        pitch: 0,
        bearing: 0,
      });

      console.log('[MapComponent] Map instance created, waiting for load event...');
      setLoadingStatus('Loading map tiles...');

      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('[MapComponent] Map loaded successfully!');
        setLoadingStatus('Map loaded!');
      });

      map.current.on('error', (e) => {
        console.error('[MapComponent] Map error:', e);
        setMapError('MAP_LOAD_ERROR');
        setLoadingStatus('Error: ' + (e.error?.message || 'Unknown error'));
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    } catch (error) {
      console.error('[MapComponent] Error initializing map:', error);
      setMapError('MAP_INIT_ERROR');
      setLoadingStatus('Initialization failed: ' + (error as Error).message);
    }

    return () => {
      console.log('[MapComponent] Cleanup function called');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (map.current) {
        console.log('[MapComponent] Removing map instance');
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Fetch static intel reports
  useEffect(() => {
    if (!mapLoaded) return;

    const API_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : 'http://localhost:3001';
    fetch(`${API_URL}/api/v1/intel_reports`)
      .then((res) => res.json())
      .then((data) => {
        setIntelData(data);
        console.log('Intel data loaded:', data.features?.length, 'features');
      })
      .catch((err) => console.error('Error fetching intel reports:', err));
  }, [mapLoaded]);

  // Set up streaming tracks
  useEffect(() => {
    if (!mapLoaded) return;

    const API_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : 'http://localhost:3001';
    const eventSource = new EventSource(`${API_URL}/api/v1/tracks`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTrackData(data);
      } catch (err) {
        console.error('Error parsing track data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [mapLoaded]);

  // Update intel report markers
  useEffect(() => {
    if (!map.current || !intelData || !mapLoaded) return;

    // Clear existing intel markers
    Object.keys(markersRef.current).forEach((key) => {
      if (key.startsWith('intel-') || key.startsWith('enemy-')) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });

    if (!intelData.features) return;

    intelData.features.forEach((feature: any) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;

      // Check if layer is enabled
      if (props.dataType === 'IntelReport' && !selectedLayers.has('IntelReports')) return;
      if (props.dataType === 'EnemyUnit' && !selectedLayers.has('EnemyUnits')) return;

      // Time filtering
      if (props.timestamp) {
        const itemTime = new Date(props.timestamp).getTime();
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
        const normalizedTime = ((itemTime - thirtyDaysAgo) / (now - thirtyDaysAgo)) * 100;

        if (normalizedTime < timeRange[0] || normalizedTime > timeRange[1]) return;
      }

      // Create marker element
      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid #ffffff';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.5)';

      if (props.dataType === 'IntelReport') {
        el.style.backgroundColor = props.type === 'HUMINT' ? '#2a7fff' : '#ff8c00';
        el.title = `${props.type} - ${props.reliability}`;
      } else if (props.dataType === 'EnemyUnit') {
        el.style.backgroundColor = '#ff0000';
        el.title = props.name;
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (props.dataType === 'IntelReport') {
          onIntelReportClick(props as IntelReport);
        }
      });

      markersRef.current[props.id] = marker;
    });
  }, [intelData, selectedLayers, timeRange, mapLoaded, onIntelReportClick]);

  // Update streaming track markers
  useEffect(() => {
    if (!map.current || !trackData || !mapLoaded) return;

    // Update ISR feeds
    if (selectedLayers.has('ISRFeeds')) {
      trackData.isrFeeds.forEach((feed) => {
        const el = document.createElement('div');
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid #ffffff';
        el.style.boxShadow = '0 2px 8px rgba(0,200,255,0.6)';
        el.style.backgroundColor = feed.type === 'Drone' ? '#00d4ff' : '#9d4edd';
        el.style.animation = 'pulse 2s infinite';
        el.title = `${feed.type} - ${feed.id}`;

        if (markersRef.current[feed.id]) {
          markersRef.current[feed.id].setLngLat([feed.location[0], feed.location[1]]);
        } else {
          const marker = new mapboxgl.Marker(el)
            .setLngLat([feed.location[0], feed.location[1]])
            .addTo(map.current!);

          el.addEventListener('click', () => {
            onISRFeedClick(feed);
          });

          markersRef.current[feed.id] = marker;
        }
      });
    } else {
      // Remove ISR feed markers
      trackData.isrFeeds.forEach((feed) => {
        if (markersRef.current[feed.id]) {
          markersRef.current[feed.id].remove();
          delete markersRef.current[feed.id];
        }
      });
    }

    // Update Air assets
    if (selectedLayers.has('Assets')) {
      trackData.assetAir.forEach((asset) => {
        const el = document.createElement('div');
        el.innerHTML = '✈';
        el.style.fontSize = '20px';
        el.style.cursor = 'pointer';
        el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))';
        el.title = `${asset.callsign} - ${asset.type}`;

        if (markersRef.current[asset.id]) {
          markersRef.current[asset.id].setLngLat([asset.location[0], asset.location[1]]);
        } else {
          const marker = new mapboxgl.Marker(el)
            .setLngLat([asset.location[0], asset.location[1]])
            .addTo(map.current!);

          markersRef.current[asset.id] = marker;
        }
      });
    } else {
      // Remove air asset markers
      if (trackData.assetAir) {
        trackData.assetAir.forEach((asset) => {
          if (markersRef.current[asset.id]) {
            markersRef.current[asset.id].remove();
            delete markersRef.current[asset.id];
          }
        });
      }
    }
  }, [trackData, selectedLayers, mapLoaded, onISRFeedClick]);

  return (
    <>
      {/* Map container - always rendered so ref attaches */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#ffffff',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid #2a2a2a',
                borderTop: '4px solid #2a7fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}
            />
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading Map</div>
            <div style={{ fontSize: '14px', color: '#a0a0a0' }}>{loadingStatus}</div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {mapError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#ffffff',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              padding: '40px',
              background: '#1a1a1a',
              border: '2px solid #ff4444',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ marginBottom: '16px', color: '#ff4444' }}>Map Configuration Error</h2>

            {mapError === 'MAPBOX_TOKEN_MISSING' && (
              <>
                <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                  Mapbox access token is missing or invalid. Please follow these steps:
                </p>
                <div style={{ textAlign: 'left', background: '#0a0a0a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ marginBottom: '12px' }}><strong>1. Get a FREE Mapbox token:</strong></p>
                  <p style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                    Visit <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2a7fff' }}>https://account.mapbox.com/</a>
                    <br />Create an account or sign in
                    <br />Copy your default public token
                  </p>

                  <p style={{ marginBottom: '12px' }}><strong>2. Update your .env file:</strong></p>
                  <p style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                    Open <code style={{ background: '#262626', padding: '2px 6px', borderRadius: '4px' }}>frontend/.env</code>
                    <br />Replace the placeholder token with your actual token
                  </p>

                  <p style={{ marginBottom: '12px' }}><strong>3. Restart the dev server:</strong></p>
                  <p style={{ paddingLeft: '20px' }}>
                    Stop the frontend server (Ctrl+C)
                    <br />Run <code style={{ background: '#262626', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code> again
                  </p>
                </div>
                <p style={{ fontSize: '14px', color: '#a0a0a0' }}>
                  Current token: <code style={{ background: '#262626', padding: '4px 8px', borderRadius: '4px' }}>
                    {MAPBOX_TOKEN || 'undefined'}
                  </code>
                </p>
              </>
            )}

            {mapError === 'MAP_LOAD_ERROR' && (
              <>
                <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                  Failed to load the map. Please check your internet connection and ensure your Mapbox token is valid.
                </p>
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <strong>Status:</strong> <code style={{ background: '#262626', padding: '4px 8px', borderRadius: '4px' }}>{loadingStatus}</code>
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <strong>Token prefix:</strong> <code style={{ background: '#262626', padding: '4px 8px', borderRadius: '4px' }}>{MAPBOX_TOKEN?.substring(0, 30)}...</code>
                  </p>
                  <p style={{ fontSize: '14px', color: '#a0a0a0' }}>
                    Check the browser console (F12) for detailed error messages.
                  </p>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <strong>Common causes:</strong><br />
                  • Token has insufficient permissions<br />
                  • Token is expired or revoked<br />
                  • Network/firewall blocking Mapbox API<br />
                  • Rate limit exceeded (unlikely on free tier)
                </p>
              </>
            )}

            {mapError === 'MAP_INIT_ERROR' && (
              <>
                <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                  Failed to initialize the map component.
                </p>
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <strong>Status:</strong> <code style={{ background: '#262626', padding: '4px 8px', borderRadius: '4px' }}>{loadingStatus}</code>
                  </p>
                  <p style={{ fontSize: '14px', color: '#a0a0a0' }}>
                    Check the browser console (F12) for detailed error messages.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(0,200,255,0.6);
          }
          50% {
            box-shadow: 0 2px 16px rgba(0,200,255,1);
          }
        }
      `}</style>
    </>
  );
}
