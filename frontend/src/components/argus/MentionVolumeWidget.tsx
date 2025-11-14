import { Paper, Text } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Narrative } from '../../types/ontology';

interface MentionVolumeWidgetProps {
  narratives: Narrative[];
}

export function MentionVolumeWidget({ narratives }: MentionVolumeWidgetProps) {
  // Group narratives by minute and count mentions of top keywords
  const getMentionData = () => {
    const now = new Date();
    const data: { time: string; military: number; terrorism: number; security: number }[] = [];

    // Last 10 minutes
    for (let i = 9; i >= 0; i--) {
      const targetTime = new Date(now.getTime() - i * 60000);
      const timeStr = targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const militaryCount = narratives.filter((n) => {
        if (!n.timestamp) return false;
        const nTime = new Date(n.timestamp);
        return (
          n.keyword === 'military' &&
          Math.abs(nTime.getTime() - targetTime.getTime()) < 60000
        );
      }).length;

      const terrorismCount = narratives.filter((n) => {
        if (!n.timestamp) return false;
        const nTime = new Date(n.timestamp);
        return (
          n.keyword === 'terrorism' &&
          Math.abs(nTime.getTime() - targetTime.getTime()) < 60000
        );
      }).length;

      const securityCount = narratives.filter((n) => {
        if (!n.timestamp) return false;
        const nTime = new Date(n.timestamp);
        return (
          n.keyword === 'security' &&
          Math.abs(nTime.getTime() - targetTime.getTime()) < 60000
        );
      }).length;

      data.push({
        time: timeStr,
        military: militaryCount,
        terrorism: terrorismCount,
        security: securityCount,
      });
    }

    return data;
  };

  const data = getMentionData();

  return (
    <Paper
      p="md"
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        height: 300,
      }}
    >
      <Text size="lg" fw={600} mb="md">
        Mention Volume
      </Text>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="time" stroke="#a0a0a0" style={{ fontSize: 12 }} />
          <YAxis stroke="#a0a0a0" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 4,
              color: '#fff',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="military" stroke="#2a7fff" strokeWidth={2} />
          <Line type="monotone" dataKey="terrorism" stroke="#ff4444" strokeWidth={2} />
          <Line type="monotone" dataKey="security" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
