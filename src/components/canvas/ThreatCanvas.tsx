'use client';

import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThreatNode } from './ThreatNode';
import { useThreatModelStore } from '@/store/threatModelStore';
import { ComponentType } from '@/types';
import { ARCHITECTURE_TEMPLATES } from '@/data/components';

const nodeTypes: NodeTypes = {
  threatNode: ThreatNode,
  trustBoundary: ThreatNode,
};

function ThreatCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, project } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
  } = useThreatModelStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleTemplateDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const isTemplate = event.dataTransfer.getData('isTemplate');
      if (isTemplate !== 'true') return;

      const templateId = event.dataTransfer.getData('templateId');
      const template = ARCHITECTURE_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;

      const dropPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const offsetX = dropPosition.x - 300;
      const offsetY = dropPosition.y - 250;

      template.components.forEach((comp) => {
        const finalPosition = {
          x: comp.position.x + offsetX,
          y: comp.position.y + offsetY,
        };
        addNode(comp.type, finalPosition);
      });

      template.trustBoundaries?.forEach((boundary) => {
        const finalPosition = {
          x: boundary.position.x + offsetX,
          y: boundary.position.y + offsetY,
        };
        addNode('trustBoundary', finalPosition);
      });
    },
    [screenToFlowPosition, addNode]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const isTemplate = event.dataTransfer.getData('isTemplate');
      if (isTemplate === 'true') {
        handleTemplateDrop(event);
        return;
      }

      const componentType = event.dataTransfer.getData('componentType') as ComponentType;
      if (!componentType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(componentType, position);
    },
    [screenToFlowPosition, addNode, handleTemplateDrop]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background color="#888" gap={20} size={1} />
        <Controls className="!rounded-xl !border !border-border" />
        <MiniMap
          nodeColor={(node) => {
            const type = node.data?.componentType;
            if (type === 'trustBoundary') return '#6b7280';
            if (['webApplication', 'mobileApp', 'apiGateway'].includes(type)) return '#3b82f6';
            if (['database', 'cache', 'messageQueue'].includes(type)) return '#8b5cf6';
            return '#f97316';
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          className="!rounded-xl !border !border-border"
        />
      </ReactFlow>
    </div>
  );
}

export function ThreatCanvas() {
  return (
    <ReactFlowProvider>
      <ThreatCanvasInner />
    </ReactFlowProvider>
  );
}
