import { Box, Text, Button, Badge, Paper, Timeline, Alert } from '@mantine/core';
import {
  IconCheck,
  IconRocket,
  IconPlane,
  IconAlertCircle,
  IconRefresh,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

interface DisseminateProps {
  selectedEffector: 'army' | 'airforce' | null;
  onReset: () => void;
}

export function Disseminate({ selectedEffector, onReset }: DisseminateProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime] = useState(new Date());
  const messageId = useRef(`TKG-${Math.floor(Math.random() * 100000)}`).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const effectorName =
    selectedEffector === 'army' ? '101st Brigade MLRS' : 'PAF JF-17 "Sherdil 1"';
  const effectorIcon = selectedEffector === 'army' ? IconRocket : IconPlane;
  const EffectorIcon = effectorIcon;
  const targetHQ = selectedEffector === 'army' ? 'Army GHQ' : 'Air HQ (JADOCS)';

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
        <Badge
          size="xl"
          color="green"
          variant="filled"
          mb="md"
          leftSection={<IconShieldCheck size={20} />}
        >
          STEP 4 of 4
        </Badge>
        <Text size="32px" fw={700} mb="xs" c="green">
          ENGAGEMENT AUTHORIZED
        </Text>
        <Text size="lg" c="dimmed">
          Disseminate Phase
        </Text>
      </Box>

      {/* Success Alert */}
      {showSuccess && (
        <Alert
          icon={<IconCheck size={24} />}
          title="Tasking Successfully Transmitted"
          color="green"
          variant="filled"
          mb="xl"
          style={{ maxWidth: 900, width: '100%' }}
        >
          Strike order has been sent to {targetHQ}. The effector is now executing the engagement.
        </Alert>
      )}

      {/* Engagement Summary */}
      <Paper
        p="lg"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 900,
          background: '#1a1a1a',
          border: '2px solid #22c55e',
        }}
      >
        <Box mb="lg" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <EffectorIcon size={32} color="#22c55e" />
          <Box>
            <Text size="xs" c="dimmed">
              SELECTED EFFECTOR
            </Text>
            <Text size="xl" fw={700}>
              {effectorName}
            </Text>
          </Box>
        </Box>

        <Box style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              TARGET
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
              TIME TO TARGET
            </Text>
            <Badge color="green" size="lg">
              {selectedEffector === 'army' ? '5 minutes' : '1 minute'}
            </Badge>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              AUTHORIZATION TIME
            </Text>
            <Text size="sm" fw={600}>
              {currentTime.toLocaleTimeString()}
            </Text>
          </Box>
        </Box>
      </Paper>

      {/* Audit Trail Timeline */}
      <Paper
        p="lg"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 900,
          background: '#161616',
          border: '1px solid #2a2a2a',
        }}
      >
        <Text size="lg" fw={600} mb="lg">
          Complete Audit Trail (Kill Chain Timeline)
        </Text>
        <Timeline color="green" active={4} bulletSize={24} lineWidth={3}>
          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title="DETECT & TASK"
          >
            <Text c="dimmed" size="sm">
              ISR Feed from Shahpar-2 drone detected threat at 33.7142°N, 70.8456°E
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {new Date(currentTime.getTime() - 120000).toLocaleTimeString()} - Automated
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title="PROCESS & EXPLOIT"
          >
            <Text c="dimmed" size="sm">
              Palantir AIP identified target as T-90 Tank (92% confidence)
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {new Date(currentTime.getTime() - 90000).toLocaleTimeString()} - AI-Assisted
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title="HUMAN CONFIRMATION"
          >
            <Text c="dimmed" size="sm">
              Target confirmed by Operator (User ID: OPS-2471)
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {new Date(currentTime.getTime() - 60000).toLocaleTimeString()} - Human-in-the-Loop
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title="DECISION & EFFECTOR PAIRING"
          >
            <Text c="dimmed" size="sm">
              Analyzed 2 strike options across Army and Air Force assets
            </Text>
            <Text c="dimmed" size="sm" mt={4}>
              Selected: {effectorName}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {new Date(currentTime.getTime() - 30000).toLocaleTimeString()} - AI-Recommended
            </Text>
          </Timeline.Item>

          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title="DISSEMINATE"
          >
            <Text c="dimmed" size="sm">
              Strike order transmitted to {targetHQ}
            </Text>
            <Text c="dimmed" size="sm" mt={4}>
              Message ID: {messageId}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {currentTime.toLocaleTimeString()} - Completed
            </Text>
          </Timeline.Item>
        </Timeline>
      </Paper>

      {/* Key Metrics */}
      <Paper
        p="lg"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 900,
          background: '#0a4a0a',
          border: '2px solid #22c55e',
        }}
      >
        <Text size="lg" fw={600} mb="md" c="green">
          Kill Chain Compression Achievement
        </Text>
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed" mb="xs">
              LEGACY PROCESS TIME
            </Text>
            <Text size="32px" fw={700} c="red">
              3-6 hours
            </Text>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed" mb="xs">
              TITAN-PK TIME
            </Text>
            <Text size="32px" fw={700} c="green">
              2 minutes
            </Text>
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed" mb="xs">
              IMPROVEMENT
            </Text>
            <Text size="32px" fw={700} c="green">
              99.4%
            </Text>
          </Box>
        </Box>
      </Paper>

      {/* Important Note */}
      <Alert
        icon={<IconAlertCircle size={20} />}
        title="Audit & Compliance"
        color="blue"
        variant="light"
        mb="xl"
        style={{ maxWidth: 900, width: '100%' }}
      >
        Complete audit trail logged to Joint Operations Database. All actions traceable for
        post-strike analysis and accountability.
      </Alert>

      {/* Action Buttons */}
      <Box style={{ display: 'flex', gap: '16px' }}>
        <Button
          size="lg"
          color="blue"
          variant="outline"
          leftSection={<IconRefresh size={20} />}
          onClick={onReset}
        >
          RESTART WORKFLOW
        </Button>
      </Box>
    </Box>
  );
}
