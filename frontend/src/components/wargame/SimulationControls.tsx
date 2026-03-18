import { Paper, Button, Stack, Text, Badge } from '@mantine/core';
import { IconPlayerPlay, IconTrash } from '@tabler/icons-react';

interface SimulationControlsProps {
  deployedUnitsCount: number;
  redPositionsCount: number;
  isSimulating: boolean;
  onRunSimulation: () => void;
  onClearAll: () => void;
}

export function SimulationControls({
  deployedUnitsCount,
  redPositionsCount,
  isSimulating,
  onRunSimulation,
  onClearAll,
}: SimulationControlsProps) {
  const isReady = deployedUnitsCount > 0 && redPositionsCount > 0;

  return (
    <Paper
      p="md"
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 400,
        background: 'rgba(22, 22, 22, 0.95)',
        border: '2px solid #2a7fff',
        zIndex: 1000,
      }}
    >
      <Stack gap="md">
        {/* Status */}
        <div>
          <Text size="lg" fw={600} mb="xs">
            Wargame Status
          </Text>
          <div style={{ display: 'flex', gap: 12 }}>
            <div>
              <Text size="xs" c="dimmed">
                Blue Units
              </Text>
              <Badge color="blue" size="lg">
                {deployedUnitsCount}
              </Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Red Positions
              </Text>
              <Badge color="red" size="lg">
                {redPositionsCount}
              </Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Status
              </Text>
              <Badge color={isReady ? 'green' : 'gray'} size="lg">
                {isReady ? 'Ready' : 'Setup'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            flex={1}
            size="lg"
            color="green"
            leftSection={<IconPlayerPlay size={20} />}
            onClick={onRunSimulation}
            disabled={!isReady || isSimulating}
          >
            RUN SIMULATION
          </Button>
          <Button
            size="lg"
            color="red"
            variant="outline"
            leftSection={<IconTrash size={20} />}
            onClick={onClearAll}
            disabled={isSimulating}
          >
            Clear
          </Button>
        </div>

        {!isReady && (
          <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
            Deploy blue units and place red positions to begin
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
