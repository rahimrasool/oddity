import { Paper, Stack, Text, Group, ScrollArea, Divider } from '@mantine/core';
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
  IconRobot,
  IconNetwork,
  IconCloudComputing,
} from '@tabler/icons-react';

interface ComponentItem {
  id: string;
  label: string;
  type: 'input' | 'llm' | 'tool' | 'output';
  subtype: string;
  icon: any;
  description: string;
}

const components: ComponentItem[] = [
  // Input Sources
  { id: 'input-email', label: 'Email Input', type: 'input', subtype: 'email', icon: IconMail, description: 'Monitor incoming emails' },
  { id: 'input-stream', label: 'Data Stream', type: 'input', subtype: 'datastream', icon: IconDatabase, description: 'Real-time data ingestion' },
  { id: 'input-intel', label: 'Intel Source', type: 'input', subtype: 'intel', icon: IconRadar, description: 'SIGINT/HUMINT/OSINT feeds' },
  { id: 'input-signal', label: 'Signal Chat', type: 'input', subtype: 'signal', icon: IconMessage, description: 'Encrypted messaging' },

  // LLM Providers
  { id: 'llm-claude', label: 'Claude', type: 'llm', subtype: 'claude', icon: IconBrain, description: 'Anthropic Claude AI' },
  { id: 'llm-gemini', label: 'Gemini', type: 'llm', subtype: 'gemini', icon: IconBrain, description: 'Google Gemini AI' },
  { id: 'llm-chatgpt', label: 'ChatGPT', type: 'llm', subtype: 'chatgpt', icon: IconBrandOpenai, description: 'OpenAI GPT-4' },
  { id: 'llm-llama', label: 'Llama', type: 'llm', subtype: 'llama', icon: IconRobot, description: 'Meta Llama (Local)' },

  // Tools
  { id: 'tool-search', label: 'Web Search', type: 'tool', subtype: 'search', icon: IconSearch, description: 'Google/Bing search' },
  { id: 'tool-document', label: 'Document Search', type: 'tool', subtype: 'document', icon: IconFileText, description: 'Search classified docs' },
  { id: 'tool-email', label: 'Send Email', type: 'tool', subtype: 'email', icon: IconMail, description: 'Email automation' },
  { id: 'tool-database', label: 'Database Query', type: 'tool', subtype: 'database', icon: IconDatabase, description: 'SQL query execution' },
  { id: 'tool-api', label: 'API Call', type: 'tool', subtype: 'api', icon: IconNetwork, description: 'REST API integration' },
  { id: 'tool-analysis', label: 'Threat Analysis', type: 'tool', subtype: 'analysis', icon: IconRadar, description: 'AI threat assessment' },

  // Outputs
  { id: 'output-email', label: 'Email Output', type: 'output', subtype: 'emailout', icon: IconMail, description: 'Send email notification' },
  { id: 'output-chat', label: 'Chat Message', type: 'output', subtype: 'chat', icon: IconMessage, description: 'Send to chat platform' },
  { id: 'output-dashboard', label: 'Dashboard', type: 'output', subtype: 'dashboard', icon: IconChartBar, description: 'Update dashboard widget' },
  { id: 'output-alert', label: 'Alert', type: 'output', subtype: 'alert', icon: IconAlertTriangle, description: 'Trigger alert system' },
  { id: 'output-api', label: 'API Response', type: 'output', subtype: 'api', icon: IconCloudComputing, description: 'Return API result' },
];

interface ComponentPaletteProps {
  onAddNode: (type: string, subtype: string, label: string) => void;
}

export function ComponentPalette({ onAddNode }: ComponentPaletteProps) {
  const renderSection = (title: string, items: ComponentItem[], color: string) => (
    <>
      <Text size="xs" fw={700} c={color} tt="uppercase" mb="xs">
        {title}
      </Text>
      <Stack gap="xs" mb="md">
        {items.map((item) => (
          <Paper
            key={item.id}
            p="xs"
            radius="sm"
            style={{
              cursor: 'grab',
              backgroundColor: 'var(--mantine-color-dark-6)',
              border: '1px solid var(--mantine-color-dark-4)',
            }}
            onClick={() => onAddNode(item.type, item.subtype, item.label)}
            onDragStart={(e) => {
              e.dataTransfer.setData('application/reactflow', JSON.stringify({
                type: item.type,
                subtype: item.subtype,
                label: item.label,
              }));
              e.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Group gap="xs">
              <item.icon size={18} color={`var(--mantine-color-${color}-5)`} />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} c="white">
                  {item.label}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {item.description}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </Stack>
    </>
  );

  const inputComponents = components.filter((c) => c.type === 'input');
  const llmComponents = components.filter((c) => c.type === 'llm');
  const toolComponents = components.filter((c) => c.type === 'tool');
  const outputComponents = components.filter((c) => c.type === 'output');

  return (
    <Paper
      p="md"
      radius={0}
      style={{
        width: 280,
        height: '100%',
        backgroundColor: 'var(--mantine-color-dark-7)',
        borderRight: '1px solid var(--mantine-color-dark-4)',
        overflow: 'hidden',
      }}
    >
      <Text size="lg" fw={700} mb="md" c="white">
        AGENT COMPONENTS
      </Text>
      <Divider mb="md" color="dark.4" />

      <ScrollArea h="calc(100% - 60px)">
        {renderSection('Input Sources', inputComponents, 'blue')}
        {renderSection('AI Models', llmComponents, 'violet')}
        {renderSection('Tools & Actions', toolComponents, 'orange')}
        {renderSection('Output Channels', outputComponents, 'green')}
      </ScrollArea>
    </Paper>
  );
}
