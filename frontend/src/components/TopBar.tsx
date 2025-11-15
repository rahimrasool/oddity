import { Group, Box, Text } from '@mantine/core';

export function TopBar() {
  return (
    <Group h="100%" px="md" justify="space-between" style={{ flexWrap: 'nowrap' }}>
      <Group gap="md">
        <Text
          size="lg"
          fw={700}
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #00D9FF 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
          }}
        >
          MIL-OS
        </Text>
        <Box
          style={{
            width: 2,
            height: 28,
            background: 'linear-gradient(180deg, transparent, #00D9FF, transparent)',
            opacity: 0.5,
          }}
        />
        <Text
          size="sm"
          c="dimmed"
          style={{
            fontFamily: 'Saira Condensed, sans-serif',
            letterSpacing: '0.5px',
            color: '#8BB4C7',
          }}
        >
          Military Operating System
        </Text>
      </Group>

      <Group gap="lg">
        <Text
          size="sm"
          style={{
            fontFamily: 'Saira Condensed, sans-serif',
            color: '#7CA5B8',
          }}
        >
          User:{' '}
          <span
            style={{
              color: '#00D9FF',
              fontWeight: 600,
              fontFamily: 'Electrolize, monospace',
              fontSize: '0.85rem',
            }}
          >
            Commander, X Corps
          </span>
        </Text>
        <Box
          px="md"
          py={6}
          style={{
            background: 'rgba(139, 0, 0, 0.3)',
            borderRadius: 2,
            border: '1px solid #FF3D3D',
            boxShadow: '0 0 10px rgba(255, 61, 61, 0.2), inset 0 0 10px rgba(255, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <Text
            size="xs"
            fw={700}
            c="#FF3D3D"
            style={{
              letterSpacing: '1.5px',
              fontFamily: 'Electrolize, monospace',
              textShadow: '0 0 5px rgba(255, 61, 61, 0.5)',
            }}
          >
            CLASSIFICATION: SECRET
          </Text>
        </Box>
      </Group>
    </Group>
  );
}
