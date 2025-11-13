/**
 * Mock data generators for VANTAGE-PK (Joint Readiness & Logistics Command)
 * Simulates three separate data silos: Personnel, Logistics, and Equipment
 */

interface PersonnelData {
  id: string;
  unit_id: string;
  unit_name: string;
  branch: "Army" | "Air Force" | "Navy" | "ISI";
  total_personnel: number;
  trained_drivers: number;
  on_leave: number;
  fit_for_duty_pct: number;
  last_updated: string;
}

interface LogisticsData {
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
  last_updated: string;
}

interface EquipmentData {
  id: string;
  unit_id: string;
  unit_name: string;
  branch: "Army" | "Air Force" | "Navy";
  asset_type: string;
  total_count: number;
  operational_count: number;
  maintenance_count: number;
  operational_pct: number;
  last_updated: string;
}

// Unit definitions for X Corps
const units = [
  { id: 'unit-xcorps-hq', name: 'X Corps HQ', branch: 'Army' as const },
  { id: 'unit-101-brigade', name: '101st Armored Brigade', branch: 'Army' as const },
  { id: 'unit-102-brigade', name: '102nd Mechanized Brigade', branch: 'Army' as const },
  { id: 'unit-7-infantry', name: '7th Infantry Division', branch: 'Army' as const },
  { id: 'unit-air-9-sqn', name: 'No. 9 Squadron', branch: 'Air Force' as const },
  { id: 'unit-air-11-sqn', name: 'No. 11 Squadron', branch: 'Air Force' as const },
  { id: 'unit-navy-pns', name: 'PNS Karachi', branch: 'Navy' as const },
];

/**
 * Generate personnel data (simulates HR system)
 */
export function generatePersonnelData(): PersonnelData[] {
  const now = new Date().toISOString();

  return units.map((unit, index) => {
    const total = 500 + Math.floor(Math.random() * 1500);
    const onLeave = Math.floor(total * (0.05 + Math.random() * 0.10)); // 5-15% on leave
    const trainedDrivers = Math.floor(total * (0.6 + Math.random() * 0.3)); // 60-90% trained
    const fitForDuty = Math.floor((85 + Math.random() * 15) * 100) / 100; // 85-100%

    return {
      id: `personnel-${index + 1}`,
      unit_id: unit.id,
      unit_name: unit.name,
      branch: unit.branch,
      total_personnel: total,
      trained_drivers: trainedDrivers,
      on_leave: onLeave,
      fit_for_duty_pct: fitForDuty,
      last_updated: now,
    };
  });
}

/**
 * Generate logistics data (simulates inventory system)
 */
export function generateLogisticsData(): LogisticsData[] {
  const now = new Date().toISOString();

  return units.map((unit, index) => {
    // Some units intentionally have low ammo to trigger red alerts
    const ammo125mmPct = index === 1 ? 0.35 : (0.6 + Math.random() * 0.4); // 101st Brigade has 35%
    const ammo120mmPct = index === 2 ? 0.42 : (0.65 + Math.random() * 0.35); // 102nd Brigade has 42%
    const fuelPct = 0.7 + Math.random() * 0.3; // 70-100%

    const ammo125mmCapacity = unit.branch === 'Army' ? 10000 : 0;
    const ammo120mmCapacity = unit.branch === 'Army' ? 8000 : 0;
    const fuelCapacity = unit.branch === 'Navy' ? 500000 : 50000;

    return {
      id: `logistics-${index + 1}`,
      unit_id: unit.id,
      unit_name: unit.name,
      ammo_125mm_rounds: Math.floor(ammo125mmCapacity * ammo125mmPct),
      ammo_125mm_capacity: ammo125mmCapacity,
      ammo_120mm_rounds: Math.floor(ammo120mmCapacity * ammo120mmPct),
      ammo_120mm_capacity: ammo120mmCapacity,
      fuel_liters: Math.floor(fuelCapacity * fuelPct),
      fuel_capacity: fuelCapacity,
      rations_days: Math.floor(20 + Math.random() * 40), // 20-60 days
      last_updated: now,
    };
  });
}

/**
 * Generate equipment data (simulates maintenance system)
 */
export function generateEquipmentData(): EquipmentData[] {
  const now = new Date().toISOString();
  const data: EquipmentData[] = [];

  // Army equipment
  const armyUnits = units.filter(u => u.branch === 'Army');
  armyUnits.forEach((unit, index) => {
    // Al-Khalid Tanks
    const tankTotal = unit.name.includes('Armored') ? 45 : (unit.name.includes('HQ') ? 0 : 15);
    if (tankTotal > 0) {
      const tankMaintenance = Math.floor(tankTotal * (0.1 + Math.random() * 0.15)); // 10-25% in maintenance
      data.push({
        id: `equipment-army-tank-${index + 1}`,
        unit_id: unit.id,
        unit_name: unit.name,
        branch: 'Army',
        asset_type: 'Al-Khalid Tank',
        total_count: tankTotal,
        operational_count: tankTotal - tankMaintenance,
        maintenance_count: tankMaintenance,
        operational_pct: Math.floor(((tankTotal - tankMaintenance) / tankTotal) * 10000) / 100,
        last_updated: now,
      });
    }

    // APCs
    const apcTotal = unit.name.includes('Mechanized') ? 60 : (unit.name.includes('HQ') ? 0 : 25);
    if (apcTotal > 0) {
      const apcMaintenance = Math.floor(apcTotal * (0.08 + Math.random() * 0.12)); // 8-20% in maintenance
      data.push({
        id: `equipment-army-apc-${index + 1}`,
        unit_id: unit.id,
        unit_name: unit.name,
        branch: 'Army',
        asset_type: 'M113 APC',
        total_count: apcTotal,
        operational_count: apcTotal - apcMaintenance,
        maintenance_count: apcMaintenance,
        operational_pct: Math.floor(((apcTotal - apcMaintenance) / apcTotal) * 10000) / 100,
        last_updated: now,
      });
    }
  });

  // Air Force equipment
  const airUnits = units.filter(u => u.branch === 'Air Force');
  airUnits.forEach((unit, index) => {
    const aircraftTotal = 18;
    const aircraftMaintenance = Math.floor(aircraftTotal * (0.15 + Math.random() * 0.15)); // 15-30% in maintenance
    data.push({
      id: `equipment-air-${index + 1}`,
      unit_id: unit.id,
      unit_name: unit.name,
      branch: 'Air Force',
      asset_type: 'JF-17 Thunder',
      total_count: aircraftTotal,
      operational_count: aircraftTotal - aircraftMaintenance,
      maintenance_count: aircraftMaintenance,
      operational_pct: Math.floor(((aircraftTotal - aircraftMaintenance) / aircraftTotal) * 10000) / 100,
      last_updated: now,
    });
  });

  // Navy equipment
  const navyUnits = units.filter(u => u.branch === 'Navy');
  navyUnits.forEach((unit, index) => {
    data.push({
      id: `equipment-navy-${index + 1}`,
      unit_id: unit.id,
      unit_name: unit.name,
      branch: 'Navy',
      asset_type: 'F-22P Frigate',
      total_count: 1,
      operational_count: 1,
      maintenance_count: 0,
      operational_pct: 100,
      last_updated: now,
    });
  });

  return data;
}
