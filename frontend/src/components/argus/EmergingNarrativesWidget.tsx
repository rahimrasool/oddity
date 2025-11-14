import { Paper, Text, Badge, Stack } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';
import type { Narrative } from '../../types/ontology';

interface EmergingNarrativesWidgetProps {
  narratives: Narrative[];
}

export function EmergingNarrativesWidget({ narratives }: EmergingNarrativesWidgetProps) {
  const getTrendingHashtags = () => {
    const hashtagCounts: Record<string, number> = {};

    narratives.forEach((narrative) => {
      narrative.hashtags.forEach((hashtag) => {
        hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
      });
    });

    const sorted = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([hashtag, count]) => ({ hashtag, count }));

    return sorted;
  };

  const trendingHashtags = getTrendingHashtags();

  return (
    <Paper
      p="md"
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        height: 300,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <IconTrendingUp size={20} color="#2a7fff" />
        <Text size="lg" fw={600}>
          Emerging Narratives
        </Text>
      </div>
      <Stack gap="xs">
        {trendingHashtags.map((item, index) => (
          <div
            key={item.hashtag}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: index < 3 ? '#1a2a3a' : '#1a1a1a',
              borderRadius: 6,
              border: index < 3 ? '1px solid #2a7fff' : '1px solid #2a2a2a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Text size="sm" fw={600} c={index < 3 ? '#2a7fff' : 'dimmed'}>
                #{index + 1}
              </Text>
              <Text size="sm" fw={600}>
                {item.hashtag}
              </Text>
            </div>
            <Badge color={index < 3 ? 'blue' : 'gray'} variant="filled">
              {item.count}
            </Badge>
          </div>
        ))}
        {trendingHashtags.length === 0 && (
          <Text size="sm" c="dimmed" style={{ textAlign: 'center', padding: 20 }}>
            No trending hashtags yet
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
