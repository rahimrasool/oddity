import { Paper, Text, Checkbox, Stack, Select, Badge } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

interface FilterPanelProps {
  selectedTypes: string[];
  dateRange: number;
  onTypesChange: (types: string[]) => void;
  onDateRangeChange: (months: number) => void;
  totalAttacks: number;
}

export function FilterPanel({
  selectedTypes,
  dateRange,
  onTypesChange,
  onDateRangeChange,
  totalAttacks,
}: FilterPanelProps) {
  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <Paper
      p="md"
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        width: 300,
        background: 'rgba(22, 22, 22, 0.95)',
        border: '1px solid #2a2a2a',
        zIndex: 1000,
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconFilter size={20} color="#2a7fff" />
          <Text size="lg" fw={600}>
            Historical Analysis
          </Text>
        </div>

        {/* Attack Type Filters */}
        <div>
          <Text size="sm" c="dimmed" mb="xs">
            Attack Type
          </Text>
          <Stack gap="xs">
            <Checkbox
              label="IED Attacks"
              checked={selectedTypes.includes('IED')}
              onChange={() => handleTypeToggle('IED')}
              styles={{
                label: { color: '#fff' },
              }}
            />
            <Checkbox
              label="Ambush Attacks"
              checked={selectedTypes.includes('Ambush')}
              onChange={() => handleTypeToggle('Ambush')}
              styles={{
                label: { color: '#fff' },
              }}
            />
          </Stack>
        </div>

        {/* Date Range Filter */}
        <div>
          <Text size="sm" c="dimmed" mb="xs">
            Time Period
          </Text>
          <Select
            value={String(dateRange)}
            onChange={(value) => onDateRangeChange(Number(value))}
            data={[
              { value: '3', label: 'Last 3 months' },
              { value: '6', label: 'Last 6 months' },
              { value: '12', label: 'Last 12 months' },
              { value: '18', label: 'Last 18 months' },
            ]}
          />
        </div>

        {/* Results Summary */}
        <div
          style={{
            padding: 12,
            background: '#0a0a0a',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}
        >
          <Text size="xs" c="dimmed" mb={4}>
            Showing Results
          </Text>
          <Badge size="lg" color="red" variant="filled">
            {totalAttacks} Incidents
          </Badge>
        </div>

        {/* Legend */}
        <div>
          <Text size="xs" c="dimmed" mb="xs">
            Map Legend
          </Text>
          <Stack gap="xs">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ff4444',
                }}
              />
              <Text size="xs">IED Attack</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ffaa00',
                }}
              />
              <Text size="xs">Ambush Attack</Text>
            </div>
          </Stack>
        </div>
      </Stack>
    </Paper>
  );
}
