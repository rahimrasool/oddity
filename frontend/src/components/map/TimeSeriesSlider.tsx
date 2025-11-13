import { Box, Text, RangeSlider, Group } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

interface TimeSeriesSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function TimeSeriesSlider({ value, onChange }: TimeSeriesSliderProps) {
  // Convert slider value (0-100) to date labels
  const getDateLabel = (percent: number) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const timestamp = thirtyDaysAgo + (percent / 100) * (now - thirtyDaysAgo);
    const date = new Date(timestamp);

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box
      p="md"
      style={{
        background: 'rgba(22, 22, 22, 0.95)',
        border: '1px solid #2a2a2a',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Group gap="xs" mb="sm">
        <IconClock size={18} style={{ color: '#2a7fff' }} />
        <Text size="sm" fw={600}>
          Time Series Filter
        </Text>
        <Text size="xs" c="dimmed" ml="auto">
          {getDateLabel(value[0])} - {getDateLabel(value[1])}
        </Text>
      </Group>

      <RangeSlider
        value={value}
        onChange={onChange}
        min={0}
        max={100}
        step={1}
        minRange={5}
        marks={[
          { value: 0, label: '30 days ago' },
          { value: 25, label: '~23 days' },
          { value: 50, label: '~15 days' },
          { value: 75, label: '~8 days' },
          { value: 100, label: 'Now' },
        ]}
        styles={{
          root: {
            paddingTop: 8,
          },
          markLabel: {
            fontSize: '10px',
            color: '#a0a0a0',
          },
          track: {
            background: '#2a2a2a',
          },
          bar: {
            background: 'linear-gradient(90deg, #2a7fff 0%, #00d4ff 100%)',
          },
          thumb: {
            background: '#2a7fff',
            border: '2px solid #ffffff',
            width: 16,
            height: 16,
          },
        }}
      />
    </Box>
  );
}
