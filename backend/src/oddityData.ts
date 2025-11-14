import type { HistoricalAttack } from './types';

// South Waziristan region coordinates
// Latitude: 32.0 to 32.8°N
// Longitude: 69.3 to 70.0°E

const LOCATIONS = {
  lakkiMarwat: { lat: 32.6, lng: 70.9 },
  wana: { lat: 32.3, lng: 69.57 },
  razmak: { lat: 32.77, lng: 69.71 },
  sarwakai: { lat: 32.3, lng: 69.7 },
  tiarza: { lat: 32.48, lng: 69.5 },
};

// Hot zones with higher incident rates
const HOT_ZONES = [
  { center: LOCATIONS.lakkiMarwat, name: 'Lakki Marwat corridor', radius: 0.15 },
  { center: LOCATIONS.wana, name: 'Wana district', radius: 0.1 },
  { center: LOCATIONS.sarwakai, name: 'Sarwakai valley', radius: 0.12 },
];

const NARRATIVES = {
  IED: [
    'Pressure plate IED detonated under lead vehicle',
    'Command-wire IED targeting patrol',
    'Roadside IED struck convoy',
    'Buried IED found and neutralized',
    'VBIED attempt thwarted at checkpoint',
    'Improvised mine damaged vehicle',
    'Double-stacked IED on Route Indus',
    'Cell-phone triggered IED',
    'Motorcycle-borne IED intercepted',
  ],
  Ambush: [
    'Small arms fire from tree line',
    'RPG attack on convoy',
    'Coordinated ambush with IED trigger',
    'Sniper fire at checkpoint',
    'Complex attack with multiple firing points',
    'Mortars targeting FOB perimeter',
    'Rocket attack on supply convoy',
    'Attempted vehicle hijacking',
  ],
};

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateLocationInHotZone(): [number, number] {
  // 60% of attacks in hot zones
  if (Math.random() < 0.6) {
    const zone = HOT_ZONES[Math.floor(Math.random() * HOT_ZONES.length)];
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * zone.radius;
    return [
      zone.center.lng + distance * Math.cos(angle),
      zone.center.lat + distance * Math.sin(angle),
    ];
  } else {
    // 40% scattered throughout region
    return [randomInRange(69.3, 71.0), randomInRange(32.0, 32.8)];
  }
}

export function generateHistoricalAttacks(): HistoricalAttack[] {
  const attacks: HistoricalAttack[] = [];
  const now = new Date();
  const eighteenMonthsAgo = new Date(now.getTime() - 18 * 30 * 24 * 60 * 60 * 1000);

  // Generate 250 attacks over 18 months
  for (let i = 0; i < 250; i++) {
    const type = Math.random() < 0.65 ? 'IED' : 'Ambush'; // 65% IED, 35% Ambush
    const location = generateLocationInHotZone();
    const timestamp = randomDate(eighteenMonthsAgo, now);
    const narrativePool = NARRATIVES[type];
    const narrative = narrativePool[Math.floor(Math.random() * narrativePool.length)];

    // Casualties: 0-8, weighted toward lower numbers
    const casualties = Math.floor(Math.random() * Math.random() * 9);

    attacks.push({
      id: `attack-${String(i + 1).padStart(4, '0')}`,
      type,
      timestamp: timestamp.toISOString(),
      location,
      casualties,
      narrative,
    });
  }

  // Sort by timestamp (oldest first)
  attacks.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return attacks;
}
