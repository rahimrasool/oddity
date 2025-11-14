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
  author_name: string; // Bot or user name
  is_bot: boolean; // Whether this is a bot account
  platform: "Twitter" | "Facebook";
  sentiment: "Negative" | "Positive" | "Neutral";
  text: string;
  hashtags: string[]; // Extracted hashtags
  timestamp?: string; // ISO 8601 format
}

// VANTAGE-PK (Logistics & Readiness) Data Models

export interface PersonnelData {
  id: string;
  unit_id: string;
  unit_name: string;
  branch: "Army" | "Air Force" | "Navy" | "ISI";
  total_personnel: number;
  trained_drivers: number;
  on_leave: number;
  fit_for_duty_pct: number;
  last_updated: string; // ISO 8601 format
}

export interface LogisticsData {
  id: string;
  unit_id: string;
  unit_name: string;
  ammo_125mm_rounds: number;
  ammo_125mm_capacity: number;
  ammo_120mm_rounds: number;
  ammo_120mm_capacity: number;
  fuel_liters: number;
  fuel_capacity: number;
  rations_days: number;
  last_updated: string; // ISO 8601 format
}

export interface EquipmentData {
  id: string;
  unit_id: string;
  unit_name: string;
  branch: "Army" | "Air Force" | "Navy";
  asset_type: string; // e.g., "Al-Khalid Tank", "JF-17 Thunder", "F-22P Frigate"
  total_count: number;
  operational_count: number;
  maintenance_count: number;
  operational_pct: number;
  last_updated: string; // ISO 8601 format
}

// Layer types for the map
export type LayerType = 'ISRFeeds' | 'IntelReports' | 'EnemyUnits' | 'Assets' | 'HistoricalAttacks';

// Module types for navigation
export type ModuleType = 'singularity' | 'guardian' | 'prophet' | 'nexus' | 'vanguard' | 'sentinel' | 'oddity' | 'argus' | 'chakravyuh';
