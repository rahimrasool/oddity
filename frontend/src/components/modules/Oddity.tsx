import { useState, useEffect, useRef } from 'react';
import { Box } from '@mantine/core';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { HistoricalAttack } from '../../types/ontology';
import { FilterPanel } from '../oddity/FilterPanel';
import { RoutePlanner } from '../oddity/RoutePlanner';
import { RiskAssessment } from '../oddity/RiskAssessment';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// South Waziristan region center
const INITIAL_CENTER: [number, number] = [69.75, 32.4];
const INITIAL_ZOOM = 9;

export function Oddity() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [historicalAttacks, setHistoricalAttacks] = useState<HistoricalAttack[]>([]);
  const [filteredAttacks, setFilteredAttacks] = useState<HistoricalAttack[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['IED', 'Ambush']);
  const [dateRange, setDateRange] = useState<number>(6); // months
  const [drawnRoute, setDrawnRoute] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskJustification, setRiskJustification] = useState<string>('');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    // Initialize drawing controls
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      styles: [
        // Line style for drawing
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#2a7fff',
            'line-width': 4,
          },
        },
        // Vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 7,
            'circle-color': '#FFF',
          },
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#2a7fff',
          },
        },
      ],
    });

    map.current.addControl(draw.current);
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Handle draw events
    map.current.on('draw.create', updateRoute);
    map.current.on('draw.update', updateRoute);
    map.current.on('draw.delete', () => {
      setDrawnRoute(null);
      setRiskScore(null);
      setRiskJustification('');
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Fetch historical attacks
  useEffect(() => {
    fetch(`${API_URL}/api/v1/historical_attacks`)
      .then((res) => res.json())
      .then((data) => {
        setHistoricalAttacks(data);
      })
      .catch((err) => console.error('Failed to fetch historical attacks:', err));
  }, []);

  // Filter attacks based on type and date range
  useEffect(() => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - dateRange);

    const filtered = historicalAttacks.filter((attack) => {
      const attackDate = new Date(attack.timestamp);
      const typeMatch = selectedTypes.includes(attack.type);
      const dateMatch = attackDate >= cutoffDate;
      return typeMatch && dateMatch;
    });

    setFilteredAttacks(filtered);
  }, [historicalAttacks, selectedTypes, dateRange]);

  // Update map with filtered attacks
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const sourceId = 'historical-attacks';
    const layerId = 'attack-markers';

    // Remove existing layer and source
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Add new source and layer
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredAttacks.map((attack) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: attack.location,
        },
        properties: {
          id: attack.id,
          type: attack.type,
          timestamp: attack.timestamp,
          casualties: attack.casualties,
          narrative: attack.narrative,
        },
      })),
    };

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });

    map.current.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 4,
          12, 8,
        ],
        'circle-color': [
          'match',
          ['get', 'type'],
          'IED',
          '#ff4444',
          'Ambush',
          '#ffaa00',
          '#ff4444',
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Add click handler for attack markers
    map.current.on('click', layerId, (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const props = feature.properties;

      new mapboxgl.Popup()
        .setLngLat(feature.geometry.type === 'Point' ? feature.geometry.coordinates as [number, number] : [0, 0])
        .setHTML(
          `
          <div style="color: #000; padding: 8px;">
            <strong>${props.type} Attack</strong><br/>
            <small>${new Date(props.timestamp).toLocaleDateString()}</small><br/>
            ${props.narrative}<br/>
            <strong>Casualties:</strong> ${props.casualties}
          </div>
          `
        )
        .addTo(map.current!);
    });

    // Change cursor on hover
    map.current.on('mouseenter', layerId, () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', layerId, () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
  }, [filteredAttacks, mapLoaded]);

  const updateRoute = () => {
    if (!draw.current) return;
    const data = draw.current.getAll();
    if (data.features.length > 0) {
      const feature = data.features[0];
      setDrawnRoute(feature);
    }
  };

  const calculateRisk = () => {
    if (!drawnRoute) return;

    // Get route coordinates
    const routeCoords = drawnRoute.geometry.coordinates;

    // Calculate buffer zone around route (approximately 2km)
    const bufferDistance = 0.02; // degrees (roughly 2km at this latitude)

    // Find attacks within buffer zone in the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let nearbyIEDs = 0;
    let nearbyAmbushes = 0;

    filteredAttacks.forEach((attack) => {
      const attackDate = new Date(attack.timestamp);
      if (attackDate < sixMonthsAgo) return;

      // Check if attack is near any point on the route
      const [attackLng, attackLat] = attack.location;

      for (const [routeLng, routeLat] of routeCoords) {
        const distance = Math.sqrt(
          Math.pow(attackLng - routeLng, 2) + Math.pow(attackLat - routeLat, 2)
        );

        if (distance < bufferDistance) {
          if (attack.type === 'IED') nearbyIEDs++;
          else if (attack.type === 'Ambush') nearbyAmbushes++;
          break;
        }
      }
    });

    const totalNearby = nearbyIEDs + nearbyAmbushes;

    // Calculate risk score
    let score = 0;
    let justification = '';

    if (totalNearby >= 3) {
      score = 75;
      justification = `Automated Alert: Convoy departing Lakki Marwat at 0730 is traversing a segment with ${nearbyIEDs >= 3 ? nearbyIEDs : totalNearby}+ IED incidents in the past 6 months.`;
    } else if (totalNearby >= 2) {
      score = 50;
      justification = `Medium Risk: Route passes through area with ${totalNearby} recent incidents (${nearbyIEDs} IED, ${nearbyAmbushes} Ambush) in the past 6 months.`;
    } else if (totalNearby >= 1) {
      score = 25;
      justification = `Low Risk: Route has ${totalNearby} nearby incident in the past 6 months. Exercise standard precautions.`;
    } else {
      score = 10;
      justification = `Minimal Risk: No recent incidents detected within 2km of planned route. Maintain situational awareness.`;
    }

    setRiskScore(score);
    setRiskJustification(justification);
  };

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Map Container */}
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

      {/* Filter Panel */}
      <FilterPanel
        selectedTypes={selectedTypes}
        dateRange={dateRange}
        onTypesChange={setSelectedTypes}
        onDateRangeChange={setDateRange}
        totalAttacks={filteredAttacks.length}
      />

      {/* Route Planner */}
      <RoutePlanner
        hasRoute={!!drawnRoute}
        onCalculateRisk={calculateRisk}
        onClearRoute={() => {
          if (draw.current) {
            draw.current.deleteAll();
            setDrawnRoute(null);
            setRiskScore(null);
            setRiskJustification('');
          }
        }}
      />

      {/* Risk Assessment Display */}
      {riskScore !== null && (
        <RiskAssessment
          riskScore={riskScore}
          justification={riskJustification}
          onClose={() => {
            setRiskScore(null);
            setRiskJustification('');
          }}
        />
      )}
    </Box>
  );
}
