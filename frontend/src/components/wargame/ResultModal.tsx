import { Modal, Text, Alert, Badge, Button, Divider, Box } from '@mantine/core';
import { IconAlertTriangle, IconBulb, IconTarget } from '@tabler/icons-react';

interface ResultModalProps {
  opened: boolean;
  onClose: () => void;
  blueUnitsCount: number;
  redPositionsCount: number;
}

export function ResultModal({ opened, onClose, blueUnitsCount, redPositionsCount }: ResultModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTarget size={28} color="#ff4444" />
          <Text size="xl" fw={700}>
            Simulation Complete
          </Text>
        </div>
      }
      centered
      styles={{
        header: {
          background: '#161616',
        },
        content: {
          background: '#161616',
        },
        body: {
          padding: 24,
        },
      }}
    >
      {/* Outcome Alert */}
      <Alert
        icon={<IconAlertTriangle size={24} />}
        title="OUTCOME: High Casualties (Blue)"
        color="red"
        variant="filled"
        mb="xl"
      >
        <Text size="sm">
          Simulation indicates significant losses for Blue forces during engagement
        </Text>
      </Alert>

      {/* Engagement Summary */}
      <Box mb="xl">
        <Text size="lg" fw={600} mb="md">
          Engagement Summary
        </Text>
        <div
          style={{
            padding: 16,
            background: '#0a0a0a',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}
        >
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Blue Forces Deployed
              </Text>
              <Badge color="blue" size="xl">
                {blueUnitsCount} Units
              </Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Red Positions Engaged
              </Text>
              <Badge color="red" size="xl">
                {redPositionsCount} Positions
              </Badge>
            </div>
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Estimated Blue Casualties
              </Text>
              <Badge color="red" size="xl">
                60-75%
              </Badge>
            </div>
          </div>
        </div>
      </Box>

      <Divider mb="xl" color="#2a2a2a" />

      {/* AI Analysis */}
      <Box mb="xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IconBulb size={24} color="#ffaa00" />
          <Text size="lg" fw={600}>
            AI Analysis
          </Text>
        </div>

        <Alert color="yellow" variant="light" mb="md">
          <Text size="sm" fw={600} mb={8}>
            Critical Issue Identified:
          </Text>
          <Text size="sm">
            AI analysis indicates Red air defense was not suppressed prior to ground assault.
            Blue armor units were exposed to enemy anti-aircraft systems, resulting in heavy
            losses during approach phase.
          </Text>
        </Alert>

        <div
          style={{
            padding: 16,
            background: '#1a2a1a',
            borderRadius: 8,
            border: '2px solid #22c55e',
          }}
        >
          <Text size="sm" fw={600} mb={12} c="green">
            Recommended Course of Action:
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Text size="sm">
              • <strong>Priority 1:</strong> Re-task AssetAir for SEAD (Suppression of Enemy Air Defenses)
            </Text>
            <Text size="sm">
              • <strong>Priority 2:</strong> Delay ground assault until air superiority is established
            </Text>
            <Text size="sm">
              • <strong>Priority 3:</strong> Deploy electronic warfare assets to disrupt enemy radar
            </Text>
            <Text size="sm">
              • <strong>Priority 4:</strong> Coordinate with ISR assets for real-time threat updates
            </Text>
          </div>
        </div>
      </Box>

      <Divider mb="xl" color="#2a2a2a" />

      {/* Next Steps */}
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="md">
          This simulation demonstrates how WARGAME integrates live readiness data from VANTAGE-PK
          to provide realistic wargaming outcomes. The system is not PowerPoint-based—it uses actual
          operational data to inform tactical decisions.
        </Text>
      </Box>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button flex={1} color="blue" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button flex={1} color="green" onClick={onClose}>
          Revise Plan
        </Button>
      </div>
    </Modal>
  );
}
