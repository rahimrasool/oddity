import { Paper, Text, Button, Stack, Badge, Divider } from '@mantine/core';
import { IconTank, IconPlane, IconDatabase } from '@tabler/icons-react';
import type { EquipmentData } from '../../types/ontology';

interface AvailableAssetsPanelProps {
  equipmentData: EquipmentData[];
  onDeployTank: () => void;
  onDeployAircraft: () => void;
  totalOperational: { tanks: number; aircraft: number };
}

export function AvailableAssetsPanel({
  equipmentData,
  onDeployTank,
  onDeployAircraft,
  totalOperational,
}: AvailableAssetsPanelProps) {
  return (
    <Paper
      p="md"
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        width: 320,
        background: 'rgba(22, 22, 22, 0.95)',
        border: '2px solid #2a7fff',
        zIndex: 1000,
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <IconDatabase size={20} color="#2a7fff" />
            <Text size="lg" fw={600}>
              Available Assets
            </Text>
          </div>
          <Badge color="green" variant="filled" size="sm">
            LIVE DATA
          </Badge>
        </div>

        <Divider color="#2a2a2a" />

        {/* Asset Counts from Live API */}
        <div
          style={{
            padding: 16,
            background: '#0a0a0a',
            borderRadius: 8,
            border: '1px solid #2a7fff',
          }}
        >
          <Text size="sm" c="dimmed" mb="xs">
            Digital Twin Status
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconTank size={18} color="#2a7fff" />
                <Text size="sm">AssetArmor (Tanks)</Text>
              </div>
              <Badge color="blue" size="lg">
                {totalOperational.tanks}x Operational
              </Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconPlane size={18} color="#2a7fff" />
                <Text size="sm">AssetAir (Aircraft)</Text>
              </div>
              <Badge color="blue" size="lg">
                {totalOperational.aircraft}x On Standby
              </Badge>
            </div>
          </div>
        </div>

        <Divider color="#2a2a2a" />

        {/* Deployment Instructions */}
        <div>
          <Text size="sm" fw={600} mb="xs">
            Setup: Blue COA
          </Text>
          <Text size="xs" c="dimmed" mb="md">
            Deploy units from your operational inventory to create your Course of Action
          </Text>
        </div>

        {/* Deploy Buttons */}
        <Stack gap="xs">
          <Button
            fullWidth
            color="blue"
            leftSection={<IconTank size={18} />}
            onClick={onDeployTank}
            disabled={totalOperational.tanks === 0}
          >
            Deploy Tank Unit
          </Button>
          <Button
            fullWidth
            color="blue"
            leftSection={<IconPlane size={18} />}
            onClick={onDeployAircraft}
            disabled={totalOperational.aircraft === 0}
          >
            Deploy Aircraft Unit
          </Button>
        </Stack>

        {/* Red COA Instructions */}
        <div
          style={{
            padding: 12,
            background: '#1a0a0a',
            borderRadius: 8,
            border: '1px solid #ff4444',
          }}
        >
          <Text size="sm" fw={600} mb="xs" c="red">
            Red COA (Enemy)
          </Text>
          <Text size="xs" c="dimmed">
            Click anywhere on the map to place enemy positions
          </Text>
        </div>
      </Stack>
    </Paper>
  );
}
