import { useState, useEffect } from 'react';
import { Paper, Text, Stack, Badge, Group, ScrollArea } from '@mantine/core';
import { IconClock, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';

interface LogisticsFeedItem {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'success';
}

const feedMessages = [
  { message: '101st Brigade: Ammo resupply convoy departed FOB Alpha', type: 'info' as const },
  { message: 'X Corps: Fuel reserves at 87% - Normal levels', type: 'success' as const },
  { message: 'Air Force: JF-17 maintenance completed - 2 aircraft RTB', type: 'success' as const },
  { message: '101st Brigade: Low 125mm ammunition - Below 60% threshold', type: 'warning' as const },
  { message: 'X Corps: Rations delivery scheduled for 1400 hours', type: 'info' as const },
  { message: 'Air Force: Ordnance replenishment in progress - PL-5 missiles', type: 'info' as const },
  { message: 'X Corps: Fuel tanker convoy ETA 45 minutes', type: 'info' as const },
  { message: '101st Brigade: Spare parts shipment received - Tank tracks', type: 'success' as const },
  { message: 'Air Force: Critical maintenance parts delayed - ETA tomorrow', type: 'warning' as const },
  { message: 'X Corps: Medical supplies inventory check complete', type: 'success' as const },
  { message: '101st Brigade: Requesting priority ammo resupply', type: 'warning' as const },
  { message: 'X Corps: Water purification systems operational', type: 'success' as const },
];

export function LiveLogisticsFeed() {
  const [feedItems, setFeedItems] = useState<LogisticsFeedItem[]>([]);

  useEffect(() => {
    // Generate initial feed items
    const initialItems: LogisticsFeedItem[] = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(now.getTime() - i * 3000);
      const randomMessage = feedMessages[Math.floor(Math.random() * feedMessages.length)];
      initialItems.push({
        id: `feed-${timestamp.getTime()}`,
        timestamp,
        message: randomMessage.message,
        type: randomMessage.type,
      });
    }

    setFeedItems(initialItems);

    // Add new feed item every 3 seconds
    const interval = setInterval(() => {
      const randomMessage = feedMessages[Math.floor(Math.random() * feedMessages.length)];
      const newItem: LogisticsFeedItem = {
        id: `feed-${Date.now()}`,
        timestamp: new Date(),
        message: randomMessage.message,
        type: randomMessage.type,
      };

      setFeedItems((prev) => [newItem, ...prev].slice(0, 20)); // Keep only latest 20 items
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <IconAlertCircle size={16} />;
      case 'success':
        return <IconCircleCheck size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'yellow';
      case 'success':
        return 'green';
      default:
        return 'blue';
    }
  };

  return (
    <Paper
      p="md"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-dark-7)',
        borderColor: 'var(--mantine-color-dark-4)',
        height: '100%',
      }}
    >
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={700} c="white">
          Live Logistics Feed
        </Text>
        <Badge size="sm" color="green" variant="dot">
          LIVE
        </Badge>
      </Group>

      <ScrollArea h={300}>
        <Stack gap="xs">
          {feedItems.map((item) => (
            <Paper
              key={item.id}
              p="xs"
              style={{
                backgroundColor: 'var(--mantine-color-dark-6)',
                borderLeft: `3px solid var(--mantine-color-${getColor(item.type)}-6)`,
              }}
            >
              <Group gap="xs" mb={4}>
                <Badge
                  size="xs"
                  color={getColor(item.type)}
                  variant="light"
                  leftSection={getIcon(item.type)}
                >
                  {item.type.toUpperCase()}
                </Badge>
                <Text size="xs" c="dimmed">
                  {item.timestamp.toLocaleTimeString()}
                </Text>
              </Group>
              <Text size="sm" c="white">
                {item.message}
              </Text>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
