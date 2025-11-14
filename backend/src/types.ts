export interface HistoricalAttack {
  id: string;
  type: 'IED' | 'Ambush' | 'Rocket';
  timestamp: string; // ISO 8601 format
  location: [number, number]; // [longitude, latitude]
  casualties: number;
  narrative: string;
}

export interface Narrative {
  id: string;
  keyword: string;
  source_id: string;
  author_name: string; // Bot or user name
  is_bot: boolean; // Whether this is a bot account
  platform: 'Twitter' | 'Facebook';
  sentiment: 'Negative' | 'Positive' | 'Neutral';
  text: string;
  hashtags: string[]; // Extracted hashtags
  timestamp?: string; // ISO 8601 format
}
