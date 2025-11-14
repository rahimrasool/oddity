import { Paper, Text, Button, Stack } from '@mantine/core';
import { IconRoute, IconCalculator, IconTrash } from '@tabler/icons-react';

interface RoutePlannerProps {
  hasRoute: boolean;
  onCalculateRisk: () => void;
  onClearRoute: () => void;
}

export function RoutePlanner({ hasRoute, onCalculateRisk, onClearRoute }: RoutePlannerProps) {
  return (
    <Paper
      p="md"
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 280,
        background: 'rgba(22, 22, 22, 0.95)',
        border: '1px solid #2a2a2a',
        zIndex: 1000,
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconRoute size={20} color="#2a7fff" />
          <Text size="lg" fw={600}>
            Route Planner
          </Text>
        </div>

        {/* Instructions */}
        <div
          style={{
            padding: 12,
            background: '#0a0a0a',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}
        >
          <Text size="xs" c="dimmed" mb={8}>
            Instructions:
          </Text>
          <Text size="xs">
            1. Click the line tool to start
          </Text>
          <Text size="xs">2. Click points on map to draw route</Text>
          <Text size="xs">3. Double-click to finish</Text>
          <Text size="xs" mt={8}>
            4. Click "Analyze Risk" when ready
          </Text>
        </div>

        {/* Action Buttons */}
        <Stack gap="xs">
          <Button
            fullWidth
            color="blue"
            leftSection={<IconCalculator size={18} />}
            onClick={onCalculateRisk}
            disabled={!hasRoute}
          >
            Analyze Risk
          </Button>

          <Button
            fullWidth
            color="red"
            variant="outline"
            leftSection={<IconTrash size={18} />}
            onClick={onClearRoute}
            disabled={!hasRoute}
          >
            Clear Route
          </Button>
        </Stack>

        {/* Status */}
        {!hasRoute && (
          <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
            No route drawn
          </Text>
        )}
        {hasRoute && (
          <Text size="xs" c="green" style={{ textAlign: 'center' }}>
            Route ready for analysis
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
