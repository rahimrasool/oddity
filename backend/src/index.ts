import express, { Request, Response } from 'express';
import cors from 'cors';
import { generateMockTracks, generateMockIntelReports } from './mockData';
import { generatePersonnelData, generateLogisticsData, generateEquipmentData } from './vantageData';
import { generateHistoricalAttacks } from './oddityData';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store for tracking clients receiving streaming data
const streamClients = new Map<string, Response>();

/**
 * GET /api/v1/tracks
 * Streaming endpoint that pushes new ISRFeed and AssetAir objects every 2 seconds
 */
app.get('/api/v1/tracks', (req: Request, res: Response) => {
  const clientId = `${Date.now()}-${Math.random()}`;

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  streamClients.set(clientId, res);

  console.log(`Client ${clientId} connected to tracks stream`);

  // Send initial data
  const initialData = generateMockTracks();
  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  // Send updates every 2 seconds
  const interval = setInterval(() => {
    if (res.writableEnded) {
      clearInterval(interval);
      streamClients.delete(clientId);
      return;
    }

    const tracks = generateMockTracks();
    res.write(`data: ${JSON.stringify(tracks)}\n\n`);
  }, 2000);

  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client ${clientId} disconnected from tracks stream`);
    clearInterval(interval);
    streamClients.delete(clientId);
  });
});

/**
 * GET /api/v1/intel_reports
 * Static endpoint returning GeoJSON of IntelReport and EnemyUnit objects
 */
app.get('/api/v1/intel_reports', (req: Request, res: Response) => {
  const reports = generateMockIntelReports();
  res.json(reports);
});

/**
 * VANTAGE-PK Endpoints (Simulating separate data silos)
 */

/**
 * GET /api/vantage/db_personnel
 * Simulates HR system - returns personnel data
 */
app.get('/api/vantage/db_personnel', (req: Request, res: Response) => {
  const personnel = generatePersonnelData();
  console.log(`[VANTAGE] Serving personnel data: ${personnel.length} records`);
  res.json(personnel);
});

/**
 * GET /api/vantage/db_logistics
 * Simulates inventory system - returns ammo/fuel data
 */
app.get('/api/vantage/db_logistics', (req: Request, res: Response) => {
  const logistics = generateLogisticsData();
  console.log(`[VANTAGE] Serving logistics data: ${logistics.length} records`);
  res.json(logistics);
});

/**
 * GET /api/vantage/db_equipment
 * Simulates maintenance system - returns equipment status data
 */
app.get('/api/vantage/db_equipment', (req: Request, res: Response) => {
  const equipment = generateEquipmentData();
  console.log(`[VANTAGE] Serving equipment data: ${equipment.length} records`);
  res.json(equipment);
});

/**
 * ODDITY Endpoints (Predictive Threat Modeling)
 */

/**
 * GET /api/v1/historical_attacks
 * Returns 250+ historical attack records for South Waziristan region
 */
app.get('/api/v1/historical_attacks', (req: Request, res: Response) => {
  const attacks = generateHistoricalAttacks();
  console.log(`[ODDITY] Serving historical attacks data: ${attacks.length} records`);
  res.json(attacks);
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mil-OS Backend API running on port ${PORT}`);
  console.log(`Tracks stream: http://localhost:${PORT}/api/v1/tracks`);
  console.log(`Intel reports: http://localhost:${PORT}/api/v1/intel_reports`);
  console.log(`VANTAGE Personnel: http://localhost:${PORT}/api/vantage/db_personnel`);
  console.log(`VANTAGE Logistics: http://localhost:${PORT}/api/vantage/db_logistics`);
  console.log(`VANTAGE Equipment: http://localhost:${PORT}/api/vantage/db_equipment`);
  console.log(`ODDITY Historical Attacks: http://localhost:${PORT}/api/v1/historical_attacks`);
});
