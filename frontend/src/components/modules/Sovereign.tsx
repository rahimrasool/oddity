import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import type { Node, Connection, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Group, Button, Text, Badge, ActionIcon } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconDownload, IconUpload, IconTrash } from '@tabler/icons-react';
import { CustomNode } from '../sovereign/CustomNode';
import type { CustomNodeData } from '../sovereign/CustomNode';
import { ComponentPalette } from '../sovereign/ComponentPalette';
import { NodeConfigPanel } from '../sovereign/NodeConfigPanel';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

function SovereignFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const nodeDataString = event.dataTransfer.getData('application/reactflow');
      if (!nodeDataString) return;

      const nodeData = JSON.parse(nodeDataString);

      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: Node<CustomNodeData> = {
        id: getNodeId(),
        type: 'custom',
        position,
        data: {
          label: nodeData.label,
          type: nodeData.type,
          subtype: nodeData.subtype,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onAddNode = useCallback(
    (type: string, subtype: string, label: string) => {
      const position = {
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      };

      const newNode: Node<CustomNodeData> = {
        id: getNodeId(),
        type: 'custom',
        position,
        data: {
          label,
          type: type as CustomNodeData['type'],
          subtype,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node as Node<CustomNodeData>);
    },
    []
  );

  const onUpdateNode = useCallback(
    (config: Record<string, any>) => {
      if (!selectedNode) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                config,
              },
            };
          }
          return node;
        })
      );
    },
    [selectedNode, setNodes]
  );

  const onDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const onClearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const onRunWorkflow = useCallback(() => {
    setIsRunning(!isRunning);
    // In a real implementation, this would execute the workflow
    console.log('Workflow execution:', { nodes, edges });
  }, [isRunning, nodes, edges]);

  const onExport = useCallback(() => {
    const workflow = { nodes, edges };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agent-workflow.json';
    link.click();
  }, [nodes, edges]);

  return (
    <Box style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ComponentPalette onAddNode={onAddNode} />

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <Box
          p="md"
          style={{
            backgroundColor: 'var(--mantine-color-dark-7)',
            borderBottom: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          <Group justify="space-between">
            <Group gap="md">
              <Text size="xl" fw={700} c="white">
                SOVEREIGN
              </Text>
              <Badge size="lg" color="violet" variant="light">
                AI Agent Builder
              </Badge>
              {isRunning && (
                <Badge size="sm" color="green" variant="filled">
                  Running
                </Badge>
              )}
            </Group>
            <Group gap="xs">
              <Button
                variant="light"
                color={isRunning ? 'red' : 'green'}
                leftSection={isRunning ? <IconPlayerStop size={18} /> : <IconPlayerPlay size={18} />}
                onClick={onRunWorkflow}
                disabled={nodes.length === 0}
              >
                {isRunning ? 'Stop' : 'Run Workflow'}
              </Button>
              <ActionIcon variant="light" color="blue" size="lg" onClick={onExport} disabled={nodes.length === 0}>
                <IconDownload size={20} />
              </ActionIcon>
              <ActionIcon variant="light" color="gray" size="lg">
                <IconUpload size={20} />
              </ActionIcon>
              <ActionIcon variant="light" color="red" size="lg" onClick={onClearAll} disabled={nodes.length === 0}>
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </Box>

        {/* React Flow Canvas */}
        <Box ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            style={{ backgroundColor: '#1a1b1e' }}
          >
            <Background color="#2c2e33" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const customNode = node as Node<CustomNodeData>;
                switch (customNode.data.type) {
                  case 'input':
                    return '#339af0';
                  case 'llm':
                    return '#7950f2';
                  case 'tool':
                    return '#fd7e14';
                  case 'output':
                    return '#51cf66';
                  default:
                    return '#adb5bd';
                }
              }}
              style={{
                backgroundColor: 'var(--mantine-color-dark-7)',
              }}
            />
          </ReactFlow>
        </Box>

        {/* Instructions when empty */}
        {nodes.length === 0 && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <Text size="xl" fw={700} c="dimmed" mb="xs">
              Build Your AI Agent Workflow
            </Text>
            <Text size="sm" c="dimmed">
              Drag components from the left palette onto the canvas
            </Text>
            <Text size="sm" c="dimmed">
              Connect nodes to create intelligent automation workflows
            </Text>
          </Box>
        )}
      </Box>

      <NodeConfigPanel nodeData={selectedNode?.data || null} onUpdateNode={onUpdateNode} onDeleteNode={onDeleteNode} />
    </Box>
  );
}

export function Sovereign() {
  return (
    <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlowProvider>
        <SovereignFlow />
      </ReactFlowProvider>
    </Box>
  );
}
