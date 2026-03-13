import { useState, useEffect, useRef } from 'react';
import { Box } from '@mantine/core';
import mapboxgl from 'mapbox-gl';
import type { EquipmentData } from '../../types/ontology';
import { AvailableAssetsPanel } from '../chakravyuh/AvailableAssetsPanel';
import { SimulationControls } from '../chakravyuh/SimulationControls';
import { ResultModal } from '../chakravyuh/ResultModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Pakistan operational area
const INITIAL_CENTER: [number, number] = [70.5, 33.5];
const INITIAL_ZOOM = 8;

interface DeployedUnit {
  id: string;
  type: 'tank' | 'aircraft';
  position: [number, number];
  side: 'blue' | 'red';
}

export function Chakravyuh() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [equipmentData, setEquipmentData] = useState<EquipmentData[]>([]);
  const [deployedUnits, setDeployedUnits] = useState<DeployedUnit[]>([]);
  const [redPositions, setRedPositions] = useState<[number, number][]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isSimulatingRef = useRef(isSimulating);
  isSimulatingRef.current = isSimulating;

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

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Enable map click for placing red units
    map.current.on('click', (e) => {
      if (!isSimulatingRef.current) {
        const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setRedPositions((prev) => [...prev, lngLat]);
      }
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

  // Fetch equipment data
  useEffect(() => {
    fetch(`${API_URL}/api/vantage/db_equipment`)
      .then((res) => res.json())
      .then((data: EquipmentData[]) => {
        setEquipmentData(data);
      })
      .catch((err) => console.error('[CHAKRAVYUH] Failed to fetch equipment data:', err));
  }, []);

  // Update map markers when units change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    document.querySelectorAll('.chakravyuh-marker').forEach((el) => el.remove());

    // Add deployed blue units
    deployedUnits.forEach((unit) => {
      const el = document.createElement('div');
      el.className = 'chakravyuh-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = unit.type === 'aircraft' ? '50%' : '4px';
      el.style.background = unit.side === 'blue' ? '#2a7fff' : '#ff4444';
      el.style.border = '2px solid #ffffff';
      el.style.cursor = 'pointer';
      el.textContent = unit.type === 'tank' ? '🛡️' : '✈️';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      new mapboxgl.Marker(el).setLngLat(unit.position).addTo(map.current!);
    });

    // Add red positions
    redPositions.forEach((pos) => {
      const el = document.createElement('div');
      el.className = 'chakravyuh-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '4px';
      el.style.background = '#ff4444';
      el.style.border = '2px solid #ffffff';
      el.textContent = '⚠️';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      new mapboxgl.Marker(el).setLngLat(pos).addTo(map.current!);
    });
  }, [deployedUnits, redPositions, mapLoaded]);

  const handleDeployUnit = (type: 'tank' | 'aircraft') => {
    if (!map.current) return;

    const center = map.current.getCenter();
    // Random offset around center
    const offset = 0.1;
    const position: [number, number] = [
      center.lng + (Math.random() - 0.5) * offset,
      center.lat + (Math.random() - 0.5) * offset,
    ];

    const newUnit: DeployedUnit = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      side: 'blue',
    };

    setDeployedUnits((prev) => [...prev, newUnit]);
  };

  const handleClearAll = () => {
    setDeployedUnits([]);
    setRedPositions([]);
    setShowResult(false);
  };

  const handleRunSimulation = () => {
    if (deployedUnits.length === 0 || redPositions.length === 0) {
      alert('Please deploy blue units and place red positions first!');
      return;
    }

    setIsSimulating(true);

    // Simulate for 3 seconds
    setTimeout(() => {
      setIsSimulating(false);
      setShowResult(true);
    }, 3000);
  };

  const getTotalOperationalAssets = () => {
    const tanks = equipmentData
      .filter((e) => e.asset_type.includes('Tank'))
      .reduce((sum, e) => sum + e.operational_count, 0);

    const aircraft = equipmentData
      .filter((e) => e.asset_type.includes('JF-17') || e.asset_type.includes('Thunder'))
      .reduce((sum, e) => sum + e.operational_count, 0);

    return { tanks, aircraft };
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

      {/* Available Assets Panel */}
      <AvailableAssetsPanel
        onDeployTank={() => handleDeployUnit('tank')}
        onDeployAircraft={() => handleDeployUnit('aircraft')}
        totalOperational={getTotalOperationalAssets()}
      />

      {/* Simulation Controls */}
      <SimulationControls
        deployedUnitsCount={deployedUnits.length}
        redPositionsCount={redPositions.length}
        isSimulating={isSimulating}
        onRunSimulation={handleRunSimulation}
        onClearAll={handleClearAll}
      />

      {/* Result Modal */}
      <ResultModal
        opened={showResult}
        onClose={() => setShowResult(false)}
        blueUnitsCount={deployedUnits.length}
        redPositionsCount={redPositions.length}
      />

      {/* Simulation Overlay */}
      {isSimulating && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <Box
            style={{
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 20,
                animation: 'pulse 1s infinite',
              }}
            >
              ⚔️
            </div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>
              RUNNING SIMULATION...
            </div>
            <div style={{ fontSize: 16, color: '#a0a0a0', marginTop: 8 }}>
              Analyzing battlefield dynamics
            </div>
          </Box>
        </Box>
      )}

      {/* Add CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
}
