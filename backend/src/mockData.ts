/**
 * Mock data generators for Mil-OS backend
 * Generates realistic military data for Pakistan/Afghanistan border region
 */

interface ISRFeed {
  id: string;
  type: 'Drone' | 'Satellite';
  location: [number, number, number];
  feed_url: string;
  status: 'Tasked' | 'Streaming';
  is_part_of: string;
  timestamp: string;
}

interface AssetAir {
  id: string;
  callsign: string;
  type: 'JF-17';
  location: [number, number, number];
  status: 'On Station';
  ordnance: string;
  is_part_of: string;
  timestamp: string;
}

interface IntelReport {
  id: string;
  type: 'HUMINT' | 'SIGINT';
  timestamp: string;
  location: [number, number];
  text: string;
  reliability: 'A' | 'B' | 'C';
}

interface EnemyUnit {
  id: string;
  name: string;
  allegiance: 'TTP';
  location_last_seen: [number, number];
  timestamp: string;
}

// Center on Khyber Pakhtunkhwa / FATA region (Pakistan-Afghanistan border)
const BASE_LAT = 33.5;
const BASE_LON = 70.5;
const SPREAD = 2.0; // degrees

// Track state for moving objects
const trackState = new Map<string, { location: [number, number, number]; velocity: [number, number, number] }>();

/**
 * Initialize or update a track's position
 */
function updateTrackPosition(id: string, initialLat?: number, initialLon?: number, initialAlt?: number): [number, number, number] {
  if (!trackState.has(id)) {
    // Initialize new track
    const lat = initialLat ?? BASE_LAT + (Math.random() - 0.5) * SPREAD;
    const lon = initialLon ?? BASE_LON + (Math.random() - 0.5) * SPREAD;
    const alt = initialAlt ?? 3000 + Math.random() * 7000;
    const velocity: [number, number, number] = [
      (Math.random() - 0.5) * 0.005, // lon velocity
      (Math.random() - 0.5) * 0.005, // lat velocity
      (Math.random() - 0.5) * 50      // alt velocity
    ];
    trackState.set(id, { location: [lon, lat, alt], velocity });
    return [lon, lat, alt];
  }

  // Update existing track
  const track = trackState.get(id)!;
  track.location[0] += track.velocity[0];
  track.location[1] += track.velocity[1];
  track.location[2] += track.velocity[2];

  // Bounce off boundaries
  if (Math.abs(track.location[0] - BASE_LON) > SPREAD / 2) {
    track.velocity[0] *= -1;
  }
  if (Math.abs(track.location[1] - BASE_LAT) > SPREAD / 2) {
    track.velocity[1] *= -1;
  }
  if (track.location[2] < 2000 || track.location[2] > 12000) {
    track.velocity[2] *= -1;
  }

  return [...track.location] as [number, number, number];
}

/**
 * Generate mock ISR feeds and air assets (streaming)
 */
export function generateMockTracks() {
  const now = new Date().toISOString();

  const isrFeeds: ISRFeed[] = [
    {
      id: 'isr-001',
      type: 'Drone',
      location: updateTrackPosition('isr-001'),
      feed_url: 'rtsp://isr-feed-001.mil',
      status: 'Streaming',
      is_part_of: 'unit-xcorps',
      timestamp: now
    },
    {
      id: 'isr-002',
      type: 'Drone',
      location: updateTrackPosition('isr-002'),
      feed_url: 'rtsp://isr-feed-002.mil',
      status: 'Streaming',
      is_part_of: 'unit-xcorps',
      timestamp: now
    },
    {
      id: 'isr-003',
      type: 'Satellite',
      location: updateTrackPosition('isr-003', BASE_LAT + 0.5, BASE_LON - 0.5, 35000),
      feed_url: 'rtsp://sat-feed-001.mil',
      status: 'Tasked',
      is_part_of: 'unit-isi',
      timestamp: now
    },
    {
      id: 'isr-004',
      type: 'Drone',
      location: updateTrackPosition('isr-004'),
      feed_url: 'rtsp://isr-feed-004.mil',
      status: 'Streaming',
      is_part_of: 'unit-101brigade',
      timestamp: now
    },
    {
      id: 'isr-005',
      type: 'Drone',
      location: updateTrackPosition('isr-005'),
      feed_url: 'rtsp://isr-feed-005.mil',
      status: 'Streaming',
      is_part_of: 'unit-101brigade',
      timestamp: now
    }
  ];

  const assetAir: AssetAir[] = [
    {
      id: 'air-001',
      callsign: 'VIPER-1',
      type: 'JF-17',
      location: updateTrackPosition('air-001', BASE_LAT, BASE_LON + 0.3, 8000),
      status: 'On Station',
      ordnance: '2x PL-5, 2x PL-9',
      is_part_of: 'unit-airforce',
      timestamp: now
    },
    {
      id: 'air-002',
      callsign: 'VIPER-2',
      type: 'JF-17',
      location: updateTrackPosition('air-002', BASE_LAT + 0.2, BASE_LON - 0.3, 7500),
      status: 'On Station',
      ordnance: '2x PL-5, 2x SD-10',
      is_part_of: 'unit-airforce',
      timestamp: now
    },
    {
      id: 'air-003',
      callsign: 'VIPER-3',
      type: 'JF-17',
      location: updateTrackPosition('air-003', BASE_LAT - 0.3, BASE_LON + 0.2, 9000),
      status: 'On Station',
      ordnance: '2x PL-9, 1x C-802',
      is_part_of: 'unit-airforce',
      timestamp: now
    },
    {
      id: 'air-004',
      callsign: 'VIPER-4',
      type: 'JF-17',
      location: updateTrackPosition('air-004', BASE_LAT + 0.4, BASE_LON + 0.4, 8500),
      status: 'On Station',
      ordnance: '2x PL-5, 2x PL-9',
      is_part_of: 'unit-airforce',
      timestamp: now
    }
  ];

  return { isrFeeds, assetAir, timestamp: now };
}

/**
 * Generate mock intel reports and enemy units (static/historical)
 */
export function generateMockIntelReports() {
  const reports: IntelReport[] = [];
  const enemyUnits: EnemyUnit[] = [];

  // Generate 100+ intel reports
  for (let i = 0; i < 120; i++) {
    const lat = BASE_LAT + (Math.random() - 0.5) * SPREAD;
    const lon = BASE_LON + (Math.random() - 0.5) * SPREAD;
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000).toISOString();

    const reportTypes = ['HUMINT', 'SIGINT'] as const;
    const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];

    const reliabilities = ['A', 'B', 'C'] as const;
    const reliability = reliabilities[Math.floor(Math.random() * reliabilities.length)];

    const humintTexts = [
      'Local informant reports suspicious vehicle activity near checkpoint',
      'Village elder indicates recent TTP presence in area',
      'Shopkeeper reports unfamiliar individuals purchasing supplies',
      'Tribal liaison confirms movement of armed group through valley',
      'Informant network reports cache of weapons discovered',
      'Source indicates meeting of TTP commanders planned',
      'Local contact reports increased security posture in village',
      'Informant confirms IED placement team active in sector'
    ];

    const sigintTexts = [
      'Intercept: Radio chatter discussing logistics movement',
      'SIGINT: Cell phone traffic spike detected in area',
      'Electronic intercept: Coded message pattern identified',
      'Radio monitoring: Tactical frequency usage detected',
      'Communications analysis: Network node identified',
      'Signal intercept: Suspicious encrypted traffic',
      'ELINT: Radio frequency emissions from suspected site',
      'COMINT: Command net activation detected'
    ];

    const text = type === 'HUMINT'
      ? humintTexts[Math.floor(Math.random() * humintTexts.length)]
      : sigintTexts[Math.floor(Math.random() * sigintTexts.length)];

    reports.push({
      id: `intel-${i + 1}`,
      type,
      timestamp,
      location: [lon, lat],
      text,
      reliability
    });
  }

  // Generate 20-30 enemy unit sightings
  const ttpGroups = [
    'TTP-Alpha Cell', 'TTP-Bravo Cell', 'TTP-Charlie Cell',
    'TTP-Delta Cell', 'TTP-Echo Cell', 'TTP-North Sector',
    'TTP-South Sector', 'TTP-East Sector', 'TTP-West Sector',
    'TTP-Central Command', 'TTP-Logistics Unit', 'TTP-Training Camp',
    'TTP-Recon Element', 'TTP-Heavy Weapons', 'TTP-IED Cell'
  ];

  for (let i = 0; i < 25; i++) {
    const lat = BASE_LAT + (Math.random() - 0.5) * SPREAD;
    const lon = BASE_LON + (Math.random() - 0.5) * SPREAD;
    const daysAgo = Math.floor(Math.random() * 15);
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    enemyUnits.push({
      id: `enemy-${i + 1}`,
      name: ttpGroups[i % ttpGroups.length] + ` (Group ${i + 1})`,
      allegiance: 'TTP',
      location_last_seen: [lon, lat],
      timestamp
    });
  }

  // Return as GeoJSON FeatureCollection
  const features = [
    ...reports.map(report => ({
      type: 'Feature',
      properties: {
        ...report,
        dataType: 'IntelReport'
      },
      geometry: {
        type: 'Point',
        coordinates: report.location
      }
    })),
    ...enemyUnits.map(unit => ({
      type: 'Feature',
      properties: {
        ...unit,
        dataType: 'EnemyUnit'
      },
      geometry: {
        type: 'Point',
        coordinates: unit.location_last_seen
      }
    }))
  ];

  return {
    type: 'FeatureCollection',
    features
  };
}
