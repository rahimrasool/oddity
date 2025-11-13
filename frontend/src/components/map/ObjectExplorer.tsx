import { Stack, Box, Text, Checkbox, Group, ActionIcon } from '@mantine/core';
import { IconX, IconWorldPin, IconRadar, IconAlertTriangle, IconTank, IconHistory } from '@tabler/icons-react';

interface ObjectExplorerProps {
  selectedLayers: Set<string>;
  onLayerToggle: (layer: string) => void;
  onClose: () => void;
}

interface LayerConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export function ObjectExplorer({ selectedLayers, onLayerToggle, onClose }: ObjectExplorerProps) {
  const layers: LayerConfig[] = [
    {
      id: 'ISRFeeds',
      label: 'ISR Feeds',
      icon: <IconRadar size={18} />,
      color: '#00d4ff',
      description: 'Live drone and satellite feeds',
    },
    {
      id: 'IntelReports',
      label: 'Intel Reports',
      icon: <IconWorldPin size={18} />,
      color: '#2a7fff',
      description: 'HUMINT and SIGINT reports',
    },
    {
      id: 'EnemyUnits',
      label: 'Enemy Units',
      icon: <IconAlertTriangle size={18} />,
      color: '#ff0000',
      description: 'Known TTP positions',
    },
    {
      id: 'Assets',
      label: 'Friendly Assets',
      icon: <IconTank size={18} />,
      color: '#00ff00',
      description: 'Air and ground assets',
    },
    {
      id: 'HistoricalAttacks',
      label: 'Historical Attacks',
      icon: <IconHistory size={18} />,
      color: '#ff6b00',
      description: 'Past incident locations',
    },
  ];

  return (
    <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        p="md"
        style={{
          borderBottom: '1px solid #2a2a2a',
          background: '#1a1a1a',
        }}
      >
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm">
            Object Explorer
          </Text>
          <ActionIcon variant="subtle" color="gray" onClick={onClose}>
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Box>

      {/* Layer Controls */}
      <Box p="md" style={{ flex: 1, overflowY: 'auto' }}>
        <Stack gap="xs">
          {layers.map((layer) => (
            <Box
              key={layer.id}
              p="sm"
              style={{
                background: selectedLayers.has(layer.id) ? '#1a1a1a' : 'transparent',
                border: `1px solid ${selectedLayers.has(layer.id) ? layer.color + '40' : '#2a2a2a'}`,
                borderRadius: 8,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => onLayerToggle(layer.id)}
            >
              <Group gap="sm" wrap="nowrap">
                <Checkbox
                  checked={selectedLayers.has(layer.id)}
                  onChange={() => onLayerToggle(layer.id)}
                  color="blue"
                  styles={{
                    input: {
                      cursor: 'pointer',
                    },
                  }}
                />
                <Box style={{ color: layer.color }}>{layer.icon}</Box>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {layer.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {layer.description}
                  </Text>
                </Box>
              </Group>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Legend */}
      <Box
        p="md"
        style={{
          borderTop: '1px solid #2a2a2a',
          background: '#1a1a1a',
        }}
      >
        <Text size="xs" c="dimmed" mb="xs">
          Legend
        </Text>
        <Stack gap={4}>
          <Group gap="xs">
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#2a7fff',
                border: '1px solid #ffffff',
              }}
            />
            <Text size="xs" c="dimmed">
              HUMINT
            </Text>
          </Group>
          <Group gap="xs">
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ff8c00',
                border: '1px solid #ffffff',
              }}
            />
            <Text size="xs" c="dimmed">
              SIGINT
            </Text>
          </Group>
          <Group gap="xs">
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#00d4ff',
                border: '1px solid #ffffff',
              }}
            />
            <Text size="xs" c="dimmed">
              Drone
            </Text>
          </Group>
          <Group gap="xs">
            <Box
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#9d4edd',
                border: '1px solid #ffffff',
              }}
            />
            <Text size="xs" c="dimmed">
              Satellite
            </Text>
          </Group>
        </Stack>
      </Box>
    </Box>
  );
}
