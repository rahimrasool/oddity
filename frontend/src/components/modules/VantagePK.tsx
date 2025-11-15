import { useState, useEffect } from 'react';
import { Box, Grid, Text, LoadingOverlay } from '@mantine/core';
import type { PersonnelData, LogisticsData, EquipmentData } from '../../types/ontology';
import { JointReadinessWidget } from '../vantage/JointReadinessWidget';
import { PersonnelStatusWidget } from '../vantage/PersonnelStatusWidget';
import { LogisticsAlertWidget } from '../vantage/LogisticsAlertWidget';
import { LiveLogisticsFeed } from '../vantage/LiveLogisticsFeed';
import { LLMQAPanel } from '../vantage/LLMQAPanel';

export function VantagePK() {
  const [personnelData, setPersonnelData] = useState<PersonnelData[]>([]);
  const [logisticsData, setLogisticsData] = useState<LogisticsData[]>([]);
  const [equipmentData, setEquipmentData] = useState<EquipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Fetch data from three separate API endpoints (simulating data silos)
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      try {
        // Make three separate API calls in parallel
        const [personnelRes, logisticsRes, equipmentRes] = await Promise.all([
          fetch(`${API_URL}/api/vantage/db_personnel`),
          fetch(`${API_URL}/api/vantage/db_logistics`),
          fetch(`${API_URL}/api/vantage/db_equipment`),
        ]);

        if (!personnelRes.ok || !logisticsRes.ok || !equipmentRes.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const [personnel, logistics, equipment] = await Promise.all([
          personnelRes.json(),
          logisticsRes.json(),
          equipmentRes.json(),
        ]);

        console.log('[VANTAGE-PK] Data fusion complete:');
        console.log('  Personnel records:', personnel.length);
        console.log('  Logistics records:', logistics.length);
        console.log('  Equipment records:', equipment.length);

        setPersonnelData(personnel);
        setLogisticsData(logistics);
        setEquipmentData(equipment);
      } catch (err) {
        console.error('[VANTAGE-PK] Error fetching data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle drill-down from readiness chart
  const handleBranchSelect = (branch: string | null) => {
    console.log('[VANTAGE-PK] Drill-down: Selected branch:', branch);
    setSelectedBranch(branch);
  };

  if (error) {
    return (
      <Box
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box style={{ textAlign: 'center', maxWidth: 500 }}>
          <Text size="xl" fw={700} c="red" mb="md">
            Data Loading Error
          </Text>
          <Text c="dimmed">
            Failed to load VANTAGE-PK data. Make sure the backend is running on port 3001.
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Error: {error}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <LoadingOverlay visible={loading} />

      {/* Header */}
      <Box mb="xl">
        <Text size="xl" fw={700} mb="xs">
          VANTAGE-PK: Joint Readiness & Logistics Command
        </Text>
        <Text size="sm" c="dimmed">
          Real-time operational readiness and logistics status across X Corps
        </Text>
      </Box>

      {/* Dashboard Grid */}
      <Grid gutter="lg">
        {/* Widget 1: Joint Asset Readiness */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <JointReadinessWidget
            equipmentData={equipmentData}
            onBranchSelect={handleBranchSelect}
            selectedBranch={selectedBranch}
          />
        </Grid.Col>

        {/* Widget 2: Personnel Status */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <PersonnelStatusWidget
            personnelData={personnelData}
            equipmentData={equipmentData}
            selectedBranch={selectedBranch}
          />
        </Grid.Col>

        {/* Widget 3: Logistics Red Alert */}
        <Grid.Col span={12}>
          <LogisticsAlertWidget
            logisticsData={logisticsData}
          />
        </Grid.Col>

        {/* Widget 4: Live Logistics Feed */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <LiveLogisticsFeed />
        </Grid.Col>

        {/* Widget 5: AI Logistics Assistant */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <LLMQAPanel
            logisticsData={logisticsData}
            equipmentData={equipmentData}
            personnelData={personnelData}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
}
