export interface HistoricalAttack {
  id: string;
  type: 'IED' | 'Ambush' | 'Rocket';
  timestamp: string; // ISO 8601 format
  location: [number, number]; // [longitude, latitude]
  casualties: number;
  narrative: string;
}
