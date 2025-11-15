import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Paper, Text, Badge, Group } from '@mantine/core';
import {
  IconMail,
  IconDatabase,
  IconRadar,
  IconMessage,
  IconBrain,
  IconSearch,
  IconFileText,
  IconAlertTriangle,
  IconChartBar,
  IconBrandOpenai,
  IconRobot
} from '@tabler/icons-react';

export interface CustomNodeData {
  label: string;
  type: 'input' | 'llm' | 'tool' | 'output';
  subtype?: string;
  config?: Record<string, any>;
}

const iconMap: Record<string, any> = {
  // Input types
  email: IconMail,
  datastream: IconDatabase,
  intel: IconRadar,
  signal: IconMessage,

  // LLM types
  claude: IconBrain,
  gemini: IconBrain,
  chatgpt: IconBrandOpenai,
  llama: IconRobot,

  // Tool types
  search: IconSearch,
  document: IconFileText,
  database: IconDatabase,

  // Output types
  alert: IconAlertTriangle,
  dashboard: IconChartBar,
  chat: IconMessage,
  emailout: IconMail,
};

const colorMap: Record<string, string> = {
  input: 'blue',
  llm: 'violet',
  tool: 'orange',
  output: 'green',
};

export const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const Icon = iconMap[data.subtype || data.type] || IconRobot;
  const color = colorMap[data.type] || 'gray';

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        borderColor: selected ? `var(--mantine-color-${color}-6)` : 'var(--mantine-color-dark-4)',
        borderWidth: selected ? 2 : 1,
        backgroundColor: 'var(--mantine-color-dark-7)',
        minWidth: 200,
        cursor: 'grab',
      }}
    >
      {data.type !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: `var(--mantine-color-${color}-6)`,
            width: 10,
            height: 10,
          }}
        />
      )}

      <Group gap="xs" mb="xs">
        <Icon size={20} color={`var(--mantine-color-${color}-5)`} />
        <Badge size="xs" color={color} variant="light">
          {data.type.toUpperCase()}
        </Badge>
      </Group>

      <Text size="sm" fw={500} c="white">
        {data.label}
      </Text>

      {data.config && Object.keys(data.config).length > 0 && (
        <Text size="xs" c="dimmed" mt="xs">
          Configured
        </Text>
      )}

      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: `var(--mantine-color-${color}-6)`,
            width: 10,
            height: 10,
          }}
        />
      )}
    </Paper>
  );
});

CustomNode.displayName = 'CustomNode';
