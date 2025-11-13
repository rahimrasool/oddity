import { Box, Text, Button, Badge, Paper, Card } from '@mantine/core';
import { IconRocket, IconPlane, IconClock, IconTarget } from '@tabler/icons-react';

interface DecisionAndEffectorProps {
  onSelect: (effector: 'army' | 'airforce') => void;
}

export function DecisionAndEffector({ onSelect }: DecisionAndEffectorProps) {
  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      {/* Header */}
      <Box mb="xl" style={{ textAlign: 'center' }}>
        <Badge size="xl" color="blue" variant="filled" mb="md" leftSection={<IconTarget size={20} />}>
          STEP 3 of 4
        </Badge>
        <Text size="32px" fw={700} mb="xs" c="blue">
          RECOMMEND EFFECTOR
        </Text>
        <Text size="lg" c="dimmed">
          Decision & Effector Pairing Phase
        </Text>
      </Box>

      {/* Target Summary */}
      <Paper
        p="lg"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 1000,
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
        }}
      >
        <Text size="lg" fw={600} mb="md">
          Confirmed Target
        </Text>
        <Box style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              TARGET TYPE
            </Text>
            <Text size="sm" fw={600}>
              T-90 Main Battle Tank
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              LOCATION
            </Text>
            <Text size="sm" fw={600}>
              33.7142°N, 70.8456°E
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              PRIORITY
            </Text>
            <Badge color="red" size="lg">
              Critical
            </Badge>
          </Box>
        </Box>
      </Paper>

      {/* Effector Options */}
      <Text size="xl" fw={600} mb="lg" style={{ textAlign: 'center' }}>
        Select Strike Asset (Inter-Service Coordination)
      </Text>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: 1000,
          marginBottom: '24px',
        }}
      >
        {/* Option 1: Army MLRS */}
        <Card
          padding="xl"
          style={{
            background: '#161616',
            border: '2px solid #2a7fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.borderColor = '#4a9fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#2a7fff';
          }}
        >
          <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
            <IconRocket size={60} color="#2a7fff" style={{ marginBottom: '12px' }} />
            <Badge color="blue" size="xl" mb="md">
              OPTION 1: ARMY
            </Badge>
            <Text size="xl" fw={700} mb="xs">
              101st Brigade MLRS
            </Text>
            <Text size="sm" c="dimmed">
              Multiple Launch Rocket System
            </Text>
          </Box>

          <Box style={{ marginBottom: '20px' }}>
            <Box mb="md" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconTarget size={20} color="#2a7fff" />
              <Box>
                <Text size="xs" c="dimmed">
                  RANGE TO TARGET
                </Text>
                <Text size="lg" fw={600}>
                  10 kilometers
                </Text>
              </Box>
            </Box>

            <Box mb="md" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconClock size={20} color="#ffaa00" />
              <Box>
                <Text size="xs" c="dimmed">
                  ESTIMATED TIME-TO-TARGET
                </Text>
                <Text size="lg" fw={600} c="yellow">
                  5 minutes
                </Text>
              </Box>
            </Box>

            <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box
                style={{
                  width: 20,
                  height: 20,
                  background: '#22c55e',
                  borderRadius: '50%',
                }}
              />
              <Box>
                <Text size="xs" c="dimmed">
                  READINESS STATUS
                </Text>
                <Text size="lg" fw={600} c="green">
                  Ready to Fire
                </Text>
              </Box>
            </Box>
          </Box>

          <Box
            p="md"
            mb="lg"
            style={{
              background: '#0a0a0a',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
            }}
          >
            <Text size="xs" c="dimmed" mb="xs">
              ADVANTAGES
            </Text>
            <Text size="sm" mb="xs">
              • Proven accuracy at this range
            </Text>
            <Text size="sm" mb="xs">
              • Ground-based redundancy
            </Text>
            <Text size="sm">• Multiple warhead coverage</Text>
          </Box>

          <Button
            size="lg"
            color="blue"
            fullWidth
            leftSection={<IconRocket size={20} />}
            onClick={() => onSelect('army')}
          >
            SELECT ARMY MLRS
          </Button>
        </Card>

        {/* Option 2: Air Force JF-17 */}
        <Card
          padding="xl"
          style={{
            background: '#161616',
            border: '2px solid #22c55e',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.borderColor = '#44ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#22c55e';
          }}
        >
          <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
            <IconPlane size={60} color="#22c55e" style={{ marginBottom: '12px' }} />
            <Badge color="green" size="xl" mb="md">
              OPTION 2: AIR FORCE (RECOMMENDED)
            </Badge>
            <Text size="xl" fw={700} mb="xs">
              PAF JF-17 "Sherdil 1"
            </Text>
            <Text size="sm" c="dimmed">
              Thunder Multi-role Fighter
            </Text>
          </Box>

          <Box style={{ marginBottom: '20px' }}>
            <Box mb="md" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconTarget size={20} color="#22c55e" />
              <Box>
                <Text size="xs" c="dimmed">
                  RANGE TO TARGET
                </Text>
                <Text size="lg" fw={600}>
                  On Station (Overhead)
                </Text>
              </Box>
            </Box>

            <Box mb="md" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconClock size={20} color="#22c55e" />
              <Box>
                <Text size="xs" c="dimmed">
                  ESTIMATED TIME-TO-TARGET
                </Text>
                <Text size="lg" fw={600} c="green">
                  1 minute
                </Text>
              </Box>
            </Box>

            <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box
                style={{
                  width: 20,
                  height: 20,
                  background: '#22c55e',
                  borderRadius: '50%',
                }}
              />
              <Box>
                <Text size="xs" c="dimmed">
                  READINESS STATUS
                </Text>
                <Text size="lg" fw={600} c="green">
                  Weapons Hot
                </Text>
              </Box>
            </Box>
          </Box>

          <Box
            p="md"
            mb="lg"
            style={{
              background: '#0a4a0a',
              border: '1px solid #22c55e',
              borderRadius: 8,
            }}
          >
            <Text size="xs" c="dimmed" mb="xs">
              ADVANTAGES
            </Text>
            <Text size="sm" mb="xs">
              • 5x faster response time
            </Text>
            <Text size="sm" mb="xs">
              • Precision-guided munition
            </Text>
            <Text size="sm">• Real-time BDA capability</Text>
          </Box>

          <Button
            size="lg"
            color="green"
            fullWidth
            leftSection={<IconPlane size={20} />}
            onClick={() => onSelect('airforce')}
            variant="filled"
          >
            SELECT AIR FORCE JF-17
          </Button>
        </Card>
      </Box>

      <Text size="sm" c="dimmed" style={{ textAlign: 'center', maxWidth: 700 }}>
        This demonstrates cross-domain coordination: TITAN-PK automatically queries both Army and Air
        Force assets, calculating optimal response based on time-to-target and readiness status.
      </Text>
    </Box>
  );
}
