import { useState, useEffect } from 'react';
import { Box, SimpleGrid } from '@mantine/core';
import type { Narrative } from '../../types/ontology';
import { MentionVolumeWidget } from '../argus/MentionVolumeWidget';
import { SentimentAnalysisWidget } from '../argus/SentimentAnalysisWidget';
import { EmergingNarrativesWidget } from '../argus/EmergingNarrativesWidget';
import { BotNetworkWidget } from '../argus/BotNetworkWidget';
import { LiveFeedWidget } from '../argus/LiveFeedWidget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function Argus() {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/v1/social_feed`);

    eventSource.onmessage = (event) => {
      const newNarratives: Narrative[] = JSON.parse(event.data);
      setNarratives((prev) => {
        // Keep last 200 narratives
        const updated = [...newNarratives, ...prev];
        return updated.slice(0, 200);
      });
    };

    eventSource.onerror = (error) => {
      console.error('[ARGUS] EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleBotClick = (botId: string) => {
    if (selectedBot === botId) {
      setSelectedBot(null); // Deselect if clicking same bot
    } else {
      setSelectedBot(botId);
    }
  };

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        padding: '20px',
        background: '#0a0a0a',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Row: 3 widgets */}
      <SimpleGrid cols={3} spacing="md" mb="md">
        <MentionVolumeWidget narratives={narratives} />
        <SentimentAnalysisWidget narratives={narratives} />
        <EmergingNarrativesWidget narratives={narratives} />
      </SimpleGrid>

      {/* Bottom Row: 2 widgets */}
      <SimpleGrid cols={2} spacing="md" style={{ height: 'calc(100% - 350px)' }}>
        <BotNetworkWidget
          narratives={narratives}
          selectedBot={selectedBot}
          onBotClick={handleBotClick}
        />
        <LiveFeedWidget narratives={narratives} selectedBot={selectedBot} />
      </SimpleGrid>
    </Box>
  );
}
