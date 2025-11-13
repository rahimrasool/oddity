import { Group, Box, Text } from '@mantine/core';

export function TopBar() {
  return (
    <Group h="100%" px="md" justify="space-between" style={{ flexWrap: 'nowrap' }}>
      <Group gap="md">
        <Text
          size="lg"
          fw={700}
          style={{
            background: 'linear-gradient(45deg, #2a7fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          MIL-OS
        </Text>
        <Box
          style={{
            width: 1,
            height: 24,
            background: '#404040',
          }}
        />
        <Text size="sm" c="dimmed">
          Military Operating System
        </Text>
      </Group>

      <Group gap="lg">
        <Text size="sm" c="dimmed">
          User: <span style={{ color: '#ffffff', fontWeight: 500 }}>Commander, X Corps</span>
        </Text>
        <Box
          px="md"
          py={4}
          style={{
            background: '#8b0000',
            borderRadius: 4,
            border: '1px solid #ff0000',
          }}
        >
          <Text size="sm" fw={700} c="#ffffff" style={{ letterSpacing: '1px' }}>
            CLASSIFICATION: SECRET
          </Text>
        </Box>
      </Group>
    </Group>
  );
}
