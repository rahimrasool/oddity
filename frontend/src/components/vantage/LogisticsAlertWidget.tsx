import { Box, Text, Paper, Alert, SimpleGrid, Progress, Badge } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import type { LogisticsData } from '../../types/ontology';

interface LogisticsAlertWidgetProps {
  logisticsData: LogisticsData[];
}

interface Alert {
  id: string;
  unitName: string;
  resourceType: string;
  currentPct: number;
  current: number;
  capacity: number;
  severity: 'critical' | 'warning';
}

export function LogisticsAlertWidget({ logisticsData }: LogisticsAlertWidgetProps) {
  // Generate alerts based on thresholds
  const alerts: Alert[] = [];

  logisticsData.forEach((unit) => {
    // Check 125mm ammo
    if (unit.ammo_125mm_capacity > 0) {
      const pct = (unit.ammo_125mm_rounds / unit.ammo_125mm_capacity) * 100;
      if (pct < 50) {
        alerts.push({
          id: `${unit.id}-125mm`,
          unitName: unit.unit_name,
          resourceType: '125mm rounds',
          currentPct: pct,
          current: unit.ammo_125mm_rounds,
          capacity: unit.ammo_125mm_capacity,
          severity: pct < 30 ? 'critical' : 'warning',
        });
      }
    }

    // Check 120mm ammo
    if (unit.ammo_120mm_capacity > 0) {
      const pct = (unit.ammo_120mm_rounds / unit.ammo_120mm_capacity) * 100;
      if (pct < 50) {
        alerts.push({
          id: `${unit.id}-120mm`,
          unitName: unit.unit_name,
          resourceType: '120mm rounds',
          currentPct: pct,
          current: unit.ammo_120mm_rounds,
          capacity: unit.ammo_120mm_capacity,
          severity: pct < 30 ? 'critical' : 'warning',
        });
      }
    }

    // Check fuel
    const fuelPct = (unit.fuel_liters / unit.fuel_capacity) * 100;
    if (fuelPct < 40) {
      alerts.push({
        id: `${unit.id}-fuel`,
        unitName: unit.unit_name,
        resourceType: 'Fuel',
        currentPct: fuelPct,
        current: unit.fuel_liters,
        capacity: unit.fuel_capacity,
        severity: fuelPct < 25 ? 'critical' : 'warning',
      });
    }

    // Check rations
    if (unit.rations_days < 15) {
      alerts.push({
        id: `${unit.id}-rations`,
        unitName: unit.unit_name,
        resourceType: 'Rations',
        currentPct: (unit.rations_days / 30) * 100,
        current: unit.rations_days,
        capacity: 30,
        severity: unit.rations_days < 10 ? 'critical' : 'warning',
      });
    }
  });

  // Sort alerts by severity (critical first) and then by percentage (lowest first)
  const sortedAlerts = alerts.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return a.currentPct - b.currentPct;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <Paper
      p="lg"
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
      }}
    >
      <Box mb="md">
        <Text size="lg" fw={600}>
          Logistics Red Alert
        </Text>
        <Text size="xs" c="dimmed">
          Units with critical or low supply levels
        </Text>
      </Box>

      <Box mb="lg" style={{ display: 'flex', gap: '12px' }}>
        <Badge size="lg" color="red" variant="filled">
          {criticalCount} Critical
        </Badge>
        <Badge size="lg" color="yellow" variant="filled">
          {warningCount} Warning
        </Badge>
        {alerts.length === 0 && (
          <Badge size="lg" color="green" variant="filled" leftSection={<IconCheck size={16} />}>
            All Systems Normal
          </Badge>
        )}
      </Box>

      {sortedAlerts.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {sortedAlerts.map((alert) => (
            <Alert
              key={alert.id}
              icon={<IconAlertTriangle size={20} />}
              title={
                <Box>
                  <Text size="sm" fw={600}>
                    {alert.unitName}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {alert.resourceType}
                  </Text>
                </Box>
              }
              color={alert.severity === 'critical' ? 'red' : 'yellow'}
              variant="filled"
              styles={{
                root: {
                  background: alert.severity === 'critical' ? '#4a1a1a' : '#4a3a1a',
                  border: `1px solid ${alert.severity === 'critical' ? '#ff4444' : '#ffaa00'}`,
                },
              }}
            >
              <Box mt="xs">
                <Progress
                  value={alert.currentPct}
                  color={alert.severity === 'critical' ? 'red' : 'yellow'}
                  size="lg"
                  radius="xl"
                />
                <Text size="sm" mt="xs">
                  <strong>{alert.currentPct.toFixed(1)}%</strong> remaining
                </Text>
                <Text size="xs" c="dimmed">
                  {alert.resourceType === 'Rations'
                    ? `${alert.current} days supply`
                    : `${alert.current.toLocaleString()} / ${alert.capacity.toLocaleString()}`}
                </Text>
              </Box>
            </Alert>
          ))}
        </SimpleGrid>
      ) : (
        <Box
          p="xl"
          style={{
            textAlign: 'center',
            background: '#0a4a0a',
            border: '1px solid #22c55e',
            borderRadius: 8,
          }}
        >
          <IconCheck size={48} style={{ color: '#22c55e', marginBottom: '12px' }} />
          <Text size="lg" fw={600} c="#22c55e">
            All Logistics Systems Nominal
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            No critical or warning-level supply shortages detected
          </Text>
        </Box>
      )}
    </Paper>
  );
}
