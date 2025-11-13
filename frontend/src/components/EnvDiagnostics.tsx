import { Box, Text, Stack, Code, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function EnvDiagnostics() {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <Box
      style={{
        position: 'fixed',
        top: 60,
        right: 20,
        zIndex: 1000,
        maxWidth: 400,
      }}
    >
      <Alert
        icon={<IconInfoCircle size={16} />}
        title="Environment Variables"
        color="blue"
        styles={{
          root: { background: '#1a1a1a', border: '1px solid #2a7fff' },
        }}
      >
        <Stack gap="xs">
          <Box>
            <Text size="xs" fw={600} c="dimmed">VITE_MAPBOX_TOKEN:</Text>
            <Code
              block
              style={{
                background: '#0a0a0a',
                fontSize: '10px',
                wordBreak: 'break-all',
                marginTop: 4,
              }}
            >
              {mapboxToken || 'undefined'}
            </Code>
            <Text size="xs" c={mapboxToken?.startsWith('pk.') ? 'green' : 'red'} mt={4}>
              {mapboxToken?.startsWith('pk.')
                ? '✓ Format looks correct'
                : '✗ Token missing or invalid format'}
            </Text>
            {mapboxToken?.includes('demo_token') && (
              <Text size="xs" c="red" mt={4}>
                ⚠️ Still using demo/placeholder token!
              </Text>
            )}
          </Box>

          <Box>
            <Text size="xs" fw={600} c="dimmed">VITE_API_URL:</Text>
            <Code block style={{ background: '#0a0a0a', fontSize: '10px', marginTop: 4 }}>
              {apiUrl || 'http://localhost:3001 (default)'}
            </Code>
          </Box>

          <Text size="xs" c="dimmed" mt="xs">
            💡 If you just updated .env, restart the dev server (Ctrl+C, then npm run dev)
          </Text>
        </Stack>
      </Alert>
    </Box>
  );
}
