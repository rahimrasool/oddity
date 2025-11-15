import { Paper, Stack, Text, TextInput, Select, Textarea, Button, Group, Divider, Switch } from '@mantine/core';
import { IconSettings, IconTrash } from '@tabler/icons-react';
import type { CustomNodeData } from './CustomNode';

interface NodeConfigPanelProps {
  nodeData: CustomNodeData | null;
  onUpdateNode: (config: Record<string, any>) => void;
  onDeleteNode: () => void;
}

export function NodeConfigPanel({ nodeData, onDeleteNode }: NodeConfigPanelProps) {
  if (!nodeData) {
    return (
      <Paper
        p="md"
        radius={0}
        style={{
          width: 300,
          height: '100%',
          backgroundColor: 'var(--mantine-color-dark-7)',
          borderLeft: '1px solid var(--mantine-color-dark-4)',
        }}
      >
        <Text size="sm" c="dimmed" ta="center" mt="xl">
          Select a node to configure
        </Text>
      </Paper>
    );
  }

  const renderInputConfig = () => (
    <Stack gap="md">
      {nodeData.subtype === 'email' && (
        <>
          <TextInput label="Email Address" placeholder="monitor@mil-os.mil" />
          <TextInput label="IMAP Server" placeholder="mail.mil-os.mil" />
          <Select
            label="Filter"
            placeholder="Select filter"
            data={[
              { value: 'all', label: 'All Messages' },
              { value: 'unread', label: 'Unread Only' },
              { value: 'classified', label: 'Classified Only' },
            ]}
          />
        </>
      )}
      {nodeData.subtype === 'intel' && (
        <>
          <Select
            label="Intel Type"
            placeholder="Select type"
            data={[
              { value: 'sigint', label: 'SIGINT' },
              { value: 'humint', label: 'HUMINT' },
              { value: 'osint', label: 'OSINT' },
              { value: 'geoint', label: 'GEOINT' },
            ]}
          />
          <TextInput label="Source ID" placeholder="SOURCE-001" />
          <Switch label="Real-time updates" defaultChecked />
        </>
      )}
      {nodeData.subtype === 'datastream' && (
        <>
          <TextInput label="Stream URL" placeholder="wss://data.mil-os.mil/stream" />
          <TextInput label="Topic" placeholder="sensor-data" />
          <Select
            label="Format"
            data={[
              { value: 'json', label: 'JSON' },
              { value: 'xml', label: 'XML' },
              { value: 'binary', label: 'Binary' },
            ]}
          />
        </>
      )}
    </Stack>
  );

  const renderLLMConfig = () => (
    <Stack gap="md">
      <Select
        label="Model"
        placeholder="Select model"
        data={
          nodeData.subtype === 'claude'
            ? [
                { value: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5' },
                { value: 'claude-opus-4', label: 'Claude Opus 4' },
                { value: 'claude-haiku-3.5', label: 'Claude Haiku 3.5' },
              ]
            : nodeData.subtype === 'gemini'
            ? [
                { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
                { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
              ]
            : nodeData.subtype === 'chatgpt'
            ? [
                { value: 'gpt-4o', label: 'GPT-4o' },
                { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                { value: 'o1', label: 'o1' },
              ]
            : [
                { value: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
                { value: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
              ]
        }
      />
      <Textarea
        label="System Prompt"
        placeholder="You are a military intelligence analyst..."
        minRows={4}
      />
      <TextInput label="Temperature" placeholder="0.7" type="number" step="0.1" />
      <TextInput label="Max Tokens" placeholder="4096" type="number" />
    </Stack>
  );

  const renderToolConfig = () => (
    <Stack gap="md">
      {nodeData.subtype === 'search' && (
        <>
          <Select
            label="Search Engine"
            data={[
              { value: 'google', label: 'Google' },
              { value: 'bing', label: 'Bing' },
              { value: 'duckduckgo', label: 'DuckDuckGo' },
            ]}
          />
          <TextInput label="Max Results" placeholder="10" type="number" />
          <Switch label="Include images" />
        </>
      )}
      {nodeData.subtype === 'document' && (
        <>
          <TextInput label="Knowledge Base" placeholder="classified-intel-2025" />
          <Select
            label="Classification Level"
            data={[
              { value: 'top-secret', label: 'TOP SECRET' },
              { value: 'secret', label: 'SECRET' },
              { value: 'confidential', label: 'CONFIDENTIAL' },
            ]}
          />
          <Switch label="Semantic search" defaultChecked />
        </>
      )}
      {nodeData.subtype === 'email' && (
        <>
          <TextInput label="To" placeholder="command@mil-os.mil" />
          <TextInput label="Subject" placeholder="Intel Report" />
          <Textarea label="Template" placeholder="Report: {{content}}" minRows={3} />
        </>
      )}
      {nodeData.subtype === 'database' && (
        <>
          <Select
            label="Database"
            data={[
              { value: 'operations', label: 'Operations DB' },
              { value: 'intelligence', label: 'Intelligence DB' },
              { value: 'logistics', label: 'Logistics DB' },
            ]}
          />
          <Textarea label="Query Template" placeholder="SELECT * FROM..." minRows={3} />
        </>
      )}
    </Stack>
  );

  const renderOutputConfig = () => (
    <Stack gap="md">
      {nodeData.subtype === 'alert' && (
        <>
          <Select
            label="Priority"
            data={[
              { value: 'critical', label: 'CRITICAL' },
              { value: 'high', label: 'HIGH' },
              { value: 'medium', label: 'MEDIUM' },
              { value: 'low', label: 'LOW' },
            ]}
          />
          <TextInput label="Alert Channel" placeholder="#operations-alerts" />
          <Switch label="Require acknowledgment" defaultChecked />
        </>
      )}
      {nodeData.subtype === 'dashboard' && (
        <>
          <Select
            label="Dashboard"
            data={[
              { value: 'command', label: 'Command Dashboard' },
              { value: 'intel', label: 'Intelligence Dashboard' },
              { value: 'ops', label: 'Operations Dashboard' },
            ]}
          />
          <TextInput label="Widget ID" placeholder="intel-summary-1" />
        </>
      )}
      {nodeData.subtype === 'chat' && (
        <>
          <Select
            label="Platform"
            data={[
              { value: 'signal', label: 'Signal' },
              { value: 'mattermost', label: 'Mattermost' },
              { value: 'slack', label: 'Slack' },
            ]}
          />
          <TextInput label="Channel" placeholder="#intel-updates" />
        </>
      )}
    </Stack>
  );

  return (
    <Paper
      p="md"
      radius={0}
      style={{
        width: 300,
        height: '100%',
        backgroundColor: 'var(--mantine-color-dark-7)',
        borderLeft: '1px solid var(--mantine-color-dark-4)',
        overflowY: 'auto',
      }}
    >
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconSettings size={20} />
          <Text size="lg" fw={700} c="white">
            CONFIGURE
          </Text>
        </Group>
      </Group>

      <Divider mb="md" color="dark.4" />

      <Text size="sm" fw={500} c="dimmed" mb="xs">
        Node Type
      </Text>
      <Text size="lg" fw={700} c="white" mb="md">
        {nodeData.label}
      </Text>

      {nodeData.type === 'input' && renderInputConfig()}
      {nodeData.type === 'llm' && renderLLMConfig()}
      {nodeData.type === 'tool' && renderToolConfig()}
      {nodeData.type === 'output' && renderOutputConfig()}

      <Divider my="md" color="dark.4" />

      <Button
        fullWidth
        variant="light"
        color="red"
        leftSection={<IconTrash size={18} />}
        onClick={onDeleteNode}
      >
        Delete Node
      </Button>
    </Paper>
  );
}
