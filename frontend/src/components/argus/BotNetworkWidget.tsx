import { Paper, Text } from '@mantine/core';
import { ForceGraph2D } from 'react-force-graph-2d';
import type { Narrative } from '../../types/ontology';
import { useRef, useEffect, useState } from 'react';

interface BotNetworkWidgetProps {
  narratives: Narrative[];
  selectedBot: string | null;
  onBotClick: (botId: string) => void;
}

interface GraphNode {
  id: string;
  name: string;
  val: number; // Size based on activity
  color: string;
  isBot: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

export function BotNetworkWidget({ narratives, selectedBot, onBotClick }: BotNetworkWidgetProps) {
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    // Update dimensions based on container
    const updateDimensions = () => {
      const container = document.getElementById('bot-network-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getGraphData = () => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const activityCount: Record<string, number> = {};

    // Count activity per source
    narratives.forEach((n) => {
      activityCount[n.source_id] = (activityCount[n.source_id] || 0) + 1;
    });

    // Get unique bots and users
    const sources = new Set<string>();
    const botInfo: Record<string, { name: string; isBot: boolean }> = {};

    narratives.forEach((n) => {
      sources.add(n.source_id);
      botInfo[n.source_id] = {
        name: n.author_name,
        isBot: n.is_bot,
      };
    });

    // Create nodes
    sources.forEach((sourceId) => {
      const info = botInfo[sourceId];
      const activity = activityCount[sourceId] || 0;
      nodes.push({
        id: sourceId,
        name: info.name,
        val: Math.max(activity * 2, 10),
        color: info.isBot
          ? selectedBot === sourceId
            ? '#ff4444'
            : '#ff8800'
          : selectedBot === sourceId
          ? '#4488ff'
          : '#2a7fff',
        isBot: info.isBot,
      });
    });

    // Create links between bots (simulating coordination)
    const botNodes = nodes.filter((n) => n.isBot);
    for (let i = 0; i < botNodes.length; i++) {
      for (let j = i + 1; j < botNodes.length; j++) {
        // 30% chance of connection
        if (Math.random() < 0.3) {
          links.push({
            source: botNodes[i].id,
            target: botNodes[j].id,
          });
        }
      }
    }

    return { nodes, links };
  };

  const graphData = getGraphData();

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
      <Text size="lg" fw={600} mb="md">
        Bot Network
      </Text>
      <div
        id="bot-network-container"
        style={{
          flex: 1,
          background: '#0a0a0a',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="name"
          nodeColor="color"
          nodeVal="val"
          linkColor={() => '#2a2a2a'}
          linkWidth={2}
          onNodeClick={(node: any) => {
            if (node.isBot) {
              onBotClick(node.id);
            }
          }}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;

            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, node.x, node.y + node.val / 2 + fontSize + 2);

            // Draw selection ring
            if (selectedBot === node.id) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2 / globalScale;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val / 2 + 3, 0, 2 * Math.PI, false);
              ctx.stroke();
            }
          }}
          backgroundColor="#0a0a0a"
        />
      </div>
      <Text size="xs" c="dimmed" mt="xs" style={{ textAlign: 'center' }}>
        Orange nodes: Bots • Blue nodes: Users • Click bot to filter feed
      </Text>
    </Paper>
  );
}
