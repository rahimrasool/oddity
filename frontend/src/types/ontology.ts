/**
 * Core Ontology Data Models for Mil-OS
 * This file defines the shared data structures for all modules
 */

export interface AssetArmor {
  id: string;
  name: string;
  status: "Operational" | "Maintenance";
  location: [number, number]; // [longitude, latitude]
  fuel_pct: number;
  ammo_125mm: number;
  is_part_of: string; // Unit ID
}

export interface AssetAir {
  id: string;
  callsign: string;
  type: "JF-17";
  location: [number, number, number]; // [longitude, latitude, altitude]
  status: "On Station";
  ordnance: string;
  is_part_of: string; // Unit ID
}

export interface ISRFeed {
  id: string;
  type: "Drone" | "Satellite";
  location: [number, number, number]; // [longitude, latitude, altitude]
  feed_url: string;
  status: "Tasked" | "Streaming";
  is_part_of: string; // Unit ID
  timestamp?: string; // ISO 8601 format
}

export interface Unit {
  id: string;
  name: "X Corps" | "101st Brigade";
  branch: "Army" | "Air Force" | "ISI";
  location_hq: [number, number]; // [longitude, latitude]
}

export interface IntelReport {
  id: string;
  type: "HUMINT" | "SIGINT";
  timestamp: string; // ISO 8601 format
  location: [number, number]; // [longitude, latitude]
  text: string;
  reliability: "A" | "B" | "C";
}

export interface HistoricalAttack {
  id: string;
  type: "IED" | "Ambush" | "Rocket";
  timestamp: string; // ISO 8601 format
  location: [number, number]; // [longitude, latitude]
  casualties: number;
  narrative: string;
}

export interface EnemyUnit {
  id: string;
  name: string;
  allegiance: "TTP";
  location_last_seen: [number, number]; // [longitude, latitude]
  timestamp?: string; // ISO 8601 format
}

export interface Location {
  id: string;
  name: string;
  geo_polygon: [number, number][]; // Array of [longitude, latitude] pairs
}

export interface Narrative {
  id: string;
  keyword: string;
  source_id: string;
  platform: "Twitter" | "Facebook";
  sentiment: "Negative" | "Positive" | "Neutral";
  text: string;
  timestamp?: string; // ISO 8601 format
}

// Layer types for the map
export type LayerType = 'ISRFeeds' | 'IntelReports' | 'EnemyUnits' | 'Assets' | 'HistoricalAttacks';

// Module types for navigation
export type ModuleType = 'singularity' | 'guardian' | 'prophet' | 'nexus' | 'vanguard' | 'sentinel';
