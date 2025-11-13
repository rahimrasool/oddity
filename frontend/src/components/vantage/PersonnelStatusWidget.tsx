import { Box, Text, Paper, Table, Badge, ScrollArea } from '@mantine/core';
import type { PersonnelData, EquipmentData } from '../../types/ontology';

interface PersonnelStatusWidgetProps {
  personnelData: PersonnelData[];
  equipmentData: EquipmentData[];
  selectedBranch: string | null;
}

export function PersonnelStatusWidget({
  personnelData,
  equipmentData,
  selectedBranch,
}: PersonnelStatusWidgetProps) {
  // Filter data based on selected branch (drill-down from readiness chart)
  const filteredPersonnelData = selectedBranch
    ? personnelData.filter((p) => p.branch === selectedBranch)
    : personnelData;

  // Fuse personnel data with equipment data for comprehensive view
  const fusedData = filteredPersonnelData.map((personnel) => {
    // Find equipment data for this unit
    const unitEquipment = equipmentData.filter((e) => e.unit_id === personnel.unit_id);

    const totalEquipment = unitEquipment.reduce((sum, e) => sum + e.total_count, 0);
    const operationalEquipment = unitEquipment.reduce((sum, e) => sum + e.operational_count, 0);
    const equipmentReadinessPct =
      totalEquipment > 0 ? Math.floor((operationalEquipment / totalEquipment) * 100) : 0;

    return {
      ...personnel,
      totalEquipment,
      operationalEquipment,
      equipmentReadinessPct,
    };
  });

  // Sort by fit_for_duty_pct descending
  const sortedData = [...fusedData].sort((a, b) => b.fit_for_duty_pct - a.fit_for_duty_pct);

  const getReadinessColor = (pct: number) => {
    if (pct >= 90) return 'green';
    if (pct >= 75) return 'yellow';
    return 'red';
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
      <Box mb="md">
        <Text size="lg" fw={600}>
          Personnel Status: X Corps
        </Text>
        <Text size="xs" c="dimmed">
          {selectedBranch ? `Filtered by: ${selectedBranch}` : 'All branches'} • {sortedData.length} units
        </Text>
      </Box>

      <ScrollArea style={{ height: 'calc(100% - 80px)' }}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr style={{ background: '#0a0a0a' }}>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Branch</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Personnel</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Trained Drivers</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>On Leave</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Fit For Duty</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Equipment Ready</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {row.unit_name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="outline">
                    {row.branch}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm">{row.total_personnel.toLocaleString()}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm">{row.trained_drivers.toLocaleString()}</Text>
                  <Text size="xs" c="dimmed">
                    {Math.floor((row.trained_drivers / row.total_personnel) * 100)}%
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text size="sm">{row.on_leave.toLocaleString()}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                  <Badge color={getReadinessColor(row.fit_for_duty_pct)} size="lg">
                    {row.fit_for_duty_pct.toFixed(1)}%
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                  <Badge color={getReadinessColor(row.equipmentReadinessPct)} size="lg">
                    {row.equipmentReadinessPct}%
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {row.operationalEquipment}/{row.totalEquipment}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {sortedData.length === 0 && (
          <Box p="xl" style={{ textAlign: 'center' }}>
            <Text c="dimmed">No data available</Text>
          </Box>
        )}
      </ScrollArea>
    </Paper>
  );
}
