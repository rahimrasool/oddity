import { Paper, Text, ScrollArea, Badge, Box } from '@mantine/core';
import { IconBrandTwitter, IconBrandFacebook, IconRobot, IconUser } from '@tabler/icons-react';
import type { Narrative } from '../../types/ontology';

interface LiveFeedWidgetProps {
  narratives: Narrative[];
  selectedBot: string | null;
}

export function LiveFeedWidget({ narratives, selectedBot }: LiveFeedWidgetProps) {
  const filteredNarratives = selectedBot
    ? narratives.filter((n) => n.source_id === selectedBot)
    : narratives;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Negative':
        return 'red';
      case 'Positive':
        return 'green';
      case 'Neutral':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Paper
      p="md"
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text size="lg" fw={600}>
          Live Feed
        </Text>
        {selectedBot && (
          <Badge color="orange" variant="filled">
            Filtered
          </Badge>
        )}
      </div>

      <ScrollArea style={{ flex: 1 }} type="auto">
        {filteredNarratives.length === 0 && (
          <Text size="sm" c="dimmed" style={{ textAlign: 'center', padding: 40 }}>
            {selectedBot ? 'No posts from selected bot' : 'Waiting for social media data...'}
          </Text>
        )}

        {filteredNarratives.map((narrative) => (
          <Box
            key={narrative.id}
            mb="md"
            p="md"
            style={{
              background: narrative.is_bot ? '#1a1a0a' : '#0a0a0a',
              border: narrative.is_bot ? '1px solid #ff8800' : '1px solid #2a2a2a',
              borderRadius: 8,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {narrative.is_bot ? (
                  <IconRobot size={18} color="#ff8800" />
                ) : (
                  <IconUser size={18} color="#2a7fff" />
                )}
                <Text size="sm" fw={600}>
                  {narrative.author_name}
                </Text>
                {narrative.is_bot && (
                  <Badge color="orange" size="xs" variant="filled">
                    BOT
                  </Badge>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {narrative.platform === 'Twitter' ? (
                  <IconBrandTwitter size={16} color="#1DA1F2" />
                ) : (
                  <IconBrandFacebook size={16} color="#4267B2" />
                )}
                <Text size="xs" c="dimmed">
                  {formatTimestamp(narrative.timestamp)}
                </Text>
              </div>
            </div>

            {/* Content */}
            <Text size="sm" mb="xs">
              {narrative.text}
            </Text>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {narrative.hashtags.map((hashtag) => (
                  <Badge key={hashtag} color="blue" size="xs" variant="outline">
                    {hashtag}
                  </Badge>
                ))}
              </div>
              <Badge color={getSentimentColor(narrative.sentiment)} size="sm" variant="light">
                {narrative.sentiment}
              </Badge>
            </div>
          </Box>
        ))}
      </ScrollArea>
    </Paper>
  );
}
