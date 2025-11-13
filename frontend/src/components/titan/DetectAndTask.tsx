import { Box, Text, Button, Badge, Paper } from '@mantine/core';
import { IconAlertTriangle, IconRadar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface DetectAndTaskProps {
  onNext: () => void;
}

export function DetectAndTask({ onNext }: DetectAndTaskProps) {
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    // Flash animation
    const interval = setInterval(() => {
      setIsFlashing((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

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
        <Badge size="xl" color="red" variant="filled" mb="md" leftSection={<IconRadar size={20} />}>
          STEP 1 of 4
        </Badge>
        <Text size="32px" fw={700} mb="xs" c="red">
          NEW THREAT DETECTED
        </Text>
        <Text size="lg" c="dimmed">
          Detect & Task Phase
        </Text>
      </Box>

      {/* Map Simulation */}
      <Paper
        p="xl"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 900,
          height: 500,
          background: '#161616',
          border: '2px solid #ff4444',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0.1 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#2a7fff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Flashing Enemy Unit Marker */}
        <Box
          style={{
            position: 'absolute',
            top: '40%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            opacity: isFlashing ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        >
          <IconAlertTriangle size={60} color="#ff4444" />
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isFlashing ? 120 : 80,
              height: isFlashing ? 120 : 80,
              border: '3px solid #ff4444',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Coordinate Label */}
        <Box
          style={{
            position: 'absolute',
            top: '40%',
            left: '55%',
            transform: 'translate(40px, -40px)',
          }}
        >
          <Paper p="xs" style={{ background: '#1a1a1a', border: '1px solid #ff4444' }}>
            <Text size="xs" c="red" fw={600}>
              33.7142°N, 70.8456°E
            </Text>
            <Text size="xs" c="dimmed">
              Threat Detected
            </Text>
          </Paper>
        </Box>

        {/* Drone Position */}
        <Box
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
          }}
        >
          <IconRadar size={40} color="#2a7fff" />
          <Paper
            p="xs"
            mt="xs"
            style={{ background: '#1a1a1a', border: '1px solid #2a7fff' }}
          >
            <Text size="xs" c="#2a7fff" fw={600}>
              ISR Feed Active
            </Text>
            <Text size="xs" c="dimmed">
              Shahpar-2 Drone
            </Text>
          </Paper>
        </Box>
      </Paper>

      {/* Intelligence Data */}
      <Paper
        p="lg"
        mb="xl"
        style={{
          width: '100%',
          maxWidth: 900,
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
        }}
      >
        <Text size="lg" fw={600} mb="md">
          Intelligence Summary
        </Text>
        <Box style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              SOURCE
            </Text>
            <Text size="sm" fw={600}>
              ISRFeed Drone (Callsign: Shahpar-2)
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              DETECTION TIME
            </Text>
            <Text size="sm" fw={600}>
              {new Date().toLocaleTimeString()} Local
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              CLASSIFICATION
            </Text>
            <Badge color="red" size="lg">
              High Priority Target
            </Badge>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              STATUS
            </Text>
            <Badge color="yellow" size="lg">
              Awaiting Identification
            </Badge>
          </Box>
        </Box>
      </Paper>

      {/* Action Button */}
      <Button
        size="xl"
        color="blue"
        onClick={onNext}
        style={{ minWidth: 300 }}
      >
        PROCEED TO TARGET IDENTIFICATION
      </Button>
    </Box>
  );
}
