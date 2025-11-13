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
  const [intelData, setIntelData] = useState<any>(null);
  const [trackData, setTrackData] = useState<{ isrFeeds: ISRFeed[]; assetAir: AssetAir[] } | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [70.5, 33.5], // Pakistan-Afghanistan border region
      zoom: 8,
      pitch: 0,
      bearing: 0,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      console.log('Map loaded');
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      map.current?.remove();
    };
  }, []);

  // Fetch static intel reports
  useEffect(() => {
    if (!mapLoaded) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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
      <style>{`
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
