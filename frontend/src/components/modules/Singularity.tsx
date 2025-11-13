import { useState } from 'react';
import { Box, Drawer, Modal, Text, Badge, Group, Stack } from '@mantine/core';
import { MapComponent } from '../map/MapComponent';
import { ObjectExplorer } from '../map/ObjectExplorer';
import { TimeSeriesSlider } from '../map/TimeSeriesSlider';
import { EnvDiagnostics } from '../EnvDiagnostics';
import type { IntelReport, ISRFeed } from '../../types/ontology';

export function Singularity() {
  const [objectExplorerOpen, setObjectExplorerOpen] = useState(true);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(
    new Set(['ISRFeeds', 'IntelReports', 'EnemyUnits'])
  );
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 100]);
  const [selectedIntelReport, setSelectedIntelReport] = useState<IntelReport | null>(null);
  const [selectedISRFeed, setSelectedISRFeed] = useState<ISRFeed | null>(null);

  const handleLayerToggle = (layer: string) => {
    const newLayers = new Set(selectedLayers);
    if (newLayers.has(layer)) {
      newLayers.delete(layer);
    } else {
      newLayers.add(layer);
    }
    setSelectedLayers(newLayers);
  };

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Environment Diagnostics - helps debug .env issues */}
      <EnvDiagnostics />

      {/* Map Component */}
      <MapComponent
        selectedLayers={selectedLayers}
        timeRange={timeRange}
        onIntelReportClick={setSelectedIntelReport}
        onISRFeedClick={setSelectedISRFeed}
      />

      {/* Object Explorer Drawer */}
      <Drawer
        opened={objectExplorerOpen}
        onClose={() => setObjectExplorerOpen(false)}
        position="left"
        size={280}
        withCloseButton={false}
        styles={{
          body: { padding: 0, height: '100%' },
          content: {
            background: '#161616',
            borderRight: '1px solid #2a2a2a',
          },
        }}
        overlayProps={{ opacity: 0 }}
      >
        <ObjectExplorer
          selectedLayers={selectedLayers}
          onLayerToggle={handleLayerToggle}
          onClose={() => setObjectExplorerOpen(false)}
        />
      </Drawer>

      {/* Time Series Slider */}
      <Box
        style={{
          position: 'absolute',
          bottom: 20,
          left: objectExplorerOpen ? 300 : 20,
          right: 20,
          zIndex: 400,
          transition: 'left 0.3s ease',
        }}
      >
        <TimeSeriesSlider value={timeRange} onChange={setTimeRange} />
      </Box>

      {/* Toggle Object Explorer Button */}
      {!objectExplorerOpen && (
        <Box
          onClick={() => setObjectExplorerOpen(true)}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 400,
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            color: '#ffffff',
          }}
        >
          Show Layers
        </Box>
      )}

      {/* Intel Report Modal */}
      <Modal
        opened={selectedIntelReport !== null}
        onClose={() => setSelectedIntelReport(null)}
        title={
          <Group>
            <Text fw={600}>Intelligence Report</Text>
            <Badge color={selectedIntelReport?.type === 'HUMINT' ? 'blue' : 'orange'}>
              {selectedIntelReport?.type}
            </Badge>
          </Group>
        }
        size="lg"
        styles={{
          content: { background: '#1a1a1a' },
          header: { background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' },
          body: { background: '#1a1a1a' },
        }}
      >
        {selectedIntelReport && (
          <Stack gap="md">
            <Box>
              <Text size="sm" c="dimmed">Timestamp</Text>
              <Text>{new Date(selectedIntelReport.timestamp).toLocaleString()}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Location</Text>
              <Text>
                {selectedIntelReport.location[1].toFixed(4)}, {selectedIntelReport.location[0].toFixed(4)}
              </Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Reliability</Text>
              <Badge
                color={
                  selectedIntelReport.reliability === 'A'
                    ? 'green'
                    : selectedIntelReport.reliability === 'B'
                    ? 'yellow'
                    : 'red'
                }
              >
                {selectedIntelReport.reliability} -{' '}
                {selectedIntelReport.reliability === 'A'
                  ? 'Confirmed'
                  : selectedIntelReport.reliability === 'B'
                  ? 'Probable'
                  : 'Unconfirmed'}
              </Badge>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Report</Text>
              <Text>{selectedIntelReport.text}</Text>
            </Box>
          </Stack>
        )}
      </Modal>

      {/* ISR Feed Popup Modal */}
      <Modal
        opened={selectedISRFeed !== null}
        onClose={() => setSelectedISRFeed(null)}
        title={
          <Group>
            <Text fw={600}>ISR Feed</Text>
            <Badge color={selectedISRFeed?.type === 'Drone' ? 'cyan' : 'purple'}>
              {selectedISRFeed?.type}
            </Badge>
          </Group>
        }
        size="md"
        styles={{
          content: { background: '#1a1a1a' },
          header: { background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' },
          body: { background: '#1a1a1a' },
        }}
      >
        {selectedISRFeed && (
          <Stack gap="md">
            <Box>
              <Text size="sm" c="dimmed">Feed ID</Text>
              <Text>{selectedISRFeed.id}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Altitude</Text>
              <Text>{selectedISRFeed.location[2].toFixed(0)} ft</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Status</Text>
              <Badge color={selectedISRFeed.status === 'Streaming' ? 'green' : 'yellow'}>
                {selectedISRFeed.status}
              </Badge>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Unit</Text>
              <Text>{selectedISRFeed.is_part_of}</Text>
            </Box>
            <Box
              p="md"
              style={{
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <Text size="sm" c="dimmed" mb="xs">
                Live Feed URL
              </Text>
              <Text size="xs" c="blue" style={{ fontFamily: 'monospace' }}>
                {selectedISRFeed.feed_url}
              </Text>
              <Box
                mt="md"
                p="lg"
                style={{
                  background: '#000000',
                  border: '1px dashed #404040',
                  borderRadius: 4,
                }}
              >
                <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                  [View Live Feed - Non-functional in prototype]
                </Text>
              </Box>
            </Box>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
