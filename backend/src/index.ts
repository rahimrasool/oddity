import express, { Request, Response } from 'express';
import cors from 'cors';
import { generateMockTracks, generateMockIntelReports } from './mockData';

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
});
