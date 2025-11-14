import { Paper, Text, Badge, Box } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Narrative } from '../../types/ontology';

interface SentimentAnalysisWidgetProps {
  narratives: Narrative[];
}

export function SentimentAnalysisWidget({ narratives }: SentimentAnalysisWidgetProps) {
  const getSentimentData = () => {
    const negative = narratives.filter((n) => n.sentiment === 'Negative').length;
    const positive = narratives.filter((n) => n.sentiment === 'Positive').length;
    const neutral = narratives.filter((n) => n.sentiment === 'Neutral').length;

    return [
      { name: 'Negative', value: negative, color: '#ff4444' },
      { name: 'Positive', value: positive, color: '#22c55e' },
      { name: 'Neutral', value: neutral, color: '#a0a0a0' },
    ];
  };

  const data = getSentimentData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
        Sentiment Analysis
      </Text>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 4,
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <Box style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
        {data.map((item) => (
          <div key={item.name} style={{ textAlign: 'center' }}>
            <Badge
              color={
                item.name === 'Negative' ? 'red' : item.name === 'Positive' ? 'green' : 'gray'
              }
              size="lg"
              mb={4}
            >
              {item.value}
            </Badge>
            <Text size="xs" c="dimmed">
              {item.name}
            </Text>
          </div>
        ))}
      </Box>
    </Paper>
  );
}
