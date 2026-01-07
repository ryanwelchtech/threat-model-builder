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
  const { screenToFlowPosition, project, fitView } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addNodes,
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

      const SPACING_MULTIPLIER = 1.5;

      const minX = Math.min(...template.components.map((c) => c.position.x));
      const maxX = Math.max(...template.components.map((c) => c.position.x));
      const minY = Math.min(...template.components.map((c) => c.position.y));
      const maxY = Math.max(...template.components.map((c) => c.position.y));
      const templateWidth = maxX - minX;
      const templateHeight = maxY - minY;

      const scaledWidth = templateWidth * SPACING_MULTIPLIER;
      const scaledHeight = templateHeight * SPACING_MULTIPLIER;

      const centerX = dropPosition.x;
      const centerY = dropPosition.y;

      const offsetX = centerX - scaledWidth / 2;
      const offsetY = centerY - scaledHeight / 2;

      const scale = SPACING_MULTIPLIER;

      const components = template.components.map((comp) => ({
        type: comp.type,
        position: {
          x: minX + (comp.position.x - minX) * scale + offsetX,
          y: minY + (comp.position.y - minY) * scale + offsetY,
        },
      }));

      const nodeIds = addNodes(components);

      template.edges?.forEach((edge) => {
        if (edge.source < nodeIds.length && edge.target < nodeIds.length) {
          const sourceId = nodeIds[edge.source];
          const targetId = nodeIds[edge.target];
          useThreatModelStore.getState().onConnect({ 
            source: sourceId, 
            target: targetId,
            sourceHandle: null,
            targetHandle: null,
          });
        }
      });

      if (template.trustBoundaries && template.trustBoundaries.length > 0) {
        const boundaryMinX = Math.min(...template.trustBoundaries.map((b) => b.position.x));
        const boundaryMinY = Math.min(...template.trustBoundaries.map((b) => b.position.y));

        template.trustBoundaries.forEach((boundary) => {
          const finalPosition = {
            x: boundaryMinX + (boundary.position.x - boundaryMinX) * scale + offsetX,
            y: boundaryMinY + (boundary.position.y - boundaryMinY) * scale + offsetY,
          };
          addNode('trustBoundary', finalPosition);
        });
      }

      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 100);
    },
    [screenToFlowPosition, addNode, addNodes, fitView]
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

      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 100);
    },
    [screenToFlowPosition, addNode, handleTemplateDrop, fitView]
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
