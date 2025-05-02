
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ComponentType } from '../../types/componentTypes';
import CloudComponent from './components/CloudComponent';
import { Button } from '@/components/ui/button';
import { Trash, ZoomIn, ZoomOut, Move } from 'lucide-react';

const nodeTypes: NodeTypes = {
  cloudComponent: CloudComponent,
};

// Initial demo data
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'cloudComponent',
    position: { x: 250, y: 100 },
    data: { 
      type: ComponentType.SERVER,
      label: 'Web Server',
      properties: {
        cpu: '2 vCPU',
        memory: '4 GB',
        region: 'us-west-1'
      }
    },
  },
  {
    id: '2',
    type: 'cloudComponent',
    position: { x: 250, y: 300 },
    data: { 
      type: ComponentType.DATABASE,
      label: 'Database',
      properties: {
        engine: 'PostgreSQL',
        storage: '20 GB',
        region: 'us-west-1'
      }
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
];

interface CanvasProps {
  onComponentSelect: (id: string | null) => void;
  onSaveRequest: (nodes: Node[], edges: Edge[]) => void;
}

const Canvas = ({ onComponentSelect, onSaveRequest }: CanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true,
      style: { stroke: '#3b82f6' } 
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as ComponentType;
      
      // Check if we have a valid component type
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate default label based on component type
      const getDefaultLabel = () => {
        switch (type) {
          case ComponentType.SERVER: return 'Server';
          case ComponentType.DATABASE: return 'Database';
          case ComponentType.NETWORK: return 'Network';
          case ComponentType.VIRTUAL_MACHINE: return 'VM';
          case ComponentType.STORAGE: return 'Storage';
          case ComponentType.LOAD_BALANCER: return 'Load Balancer';
          case ComponentType.API_GATEWAY: return 'API Gateway';
          case ComponentType.QUEUE: return 'Queue';
          case ComponentType.CACHE: return 'Cache';
          case ComponentType.BACKUP: return 'Backup';
          default: return 'Component';
        }
      };

      // Create a new node
      const newNode = {
        id: `node_${Date.now()}`,
        type: 'cloudComponent',
        position,
        data: { 
          type,
          label: getDefaultLabel(),
          properties: {} 
        },
      };

      setNodes((nds) => nds.concat(newNode));
      toast(`Added ${getDefaultLabel()}`);
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onComponentSelect(node.id);
  }, [onComponentSelect]);

  const onPaneClick = useCallback(() => {
    onComponentSelect(null);
  }, [onComponentSelect]);

  const onSave = useCallback(() => {
    if (nodes.length === 0) {
      toast.warning("Nothing to save. Add some components first!");
      return;
    }
    onSaveRequest(nodes, edges);
    toast.success("Design saved successfully!");
  }, [nodes, edges, onSaveRequest]);

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="canvas-grid"
      >
        <Panel position="top-right" className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={onSave}
          >
            Save
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onDeleteSelected}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </Panel>
        <Controls />
        <MiniMap />
        <Background gap={40} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
