import { Box, Text, Paper } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { EquipmentData } from '../../types/ontology';

interface JointReadinessWidgetProps {
  equipmentData: EquipmentData[];
  onBranchSelect: (branch: string | null) => void;
  selectedBranch: string | null;
}

const COLORS = {
  Army: '#2a7fff',
  'Air Force': '#ff8c00',
  Navy: '#00d4ff',
};

export function JointReadinessWidget({ equipmentData, onBranchSelect, selectedBranch }: JointReadinessWidgetProps) {
  // Calculate operational percentage by branch
  const readinessByBranch = equipmentData.reduce((acc, item) => {
    if (!acc[item.branch]) {
      acc[item.branch] = {
        totalCount: 0,
        operationalCount: 0,
      };
    }
    acc[item.branch].totalCount += item.total_count;
    acc[item.branch].operationalCount += item.operational_count;
    return acc;
  }, {} as Record<string, { totalCount: number; operationalCount: number }>);

  const chartData = Object.entries(readinessByBranch).map(([branch, data]) => ({
    name: branch,
    value: data.totalCount > 0 ? Math.floor((data.operationalCount / data.totalCount) * 100) : 0,
    operationalCount: data.operationalCount,
    totalCount: data.totalCount,
  }));

  const handleClick = (data: any) => {
    const branch = data.name;
    if (selectedBranch === branch) {
      onBranchSelect(null); // Deselect if clicking the same branch
    } else {
      onBranchSelect(branch);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper p="sm" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <Text size="sm" fw={600}>
            {data.name}
          </Text>
          <Text size="sm" c="dimmed">
            Operational: {data.value}%
          </Text>
          <Text size="xs" c="dimmed">
            {data.operationalCount} / {data.totalCount} assets
          </Text>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      p="lg"
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        height: '100%',
        minHeight: 400,
      }}
    >
      <Text size="lg" fw={600} mb="md">
        Joint Asset Readiness
      </Text>
      <Text size="xs" c="dimmed" mb="lg">
        Operational % by Branch
      </Text>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS] || '#808080'}
                opacity={selectedBranch === null || selectedBranch === entry.name ? 1 : 0.3}
                stroke={selectedBranch === entry.name ? '#ffffff' : 'none'}
                strokeWidth={selectedBranch === entry.name ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span style={{ color: '#ffffff', fontSize: '14px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {selectedBranch && (
        <Box
          mt="md"
          p="sm"
          style={{
            background: '#0a0a0a',
            border: '1px solid #2a7fff',
            borderRadius: 8,
          }}
        >
          <Text size="sm" c="#2a7fff">
            <strong>Drill-down active:</strong> Showing {selectedBranch} data only
          </Text>
          <Text size="xs" c="dimmed" mt="xs">
            Click the slice again to show all branches
          </Text>
        </Box>
      )}
    </Paper>
  );
}
