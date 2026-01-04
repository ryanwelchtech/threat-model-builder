import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from 'reactflow';
import {
  ThreatNodeData,
  DataFlowEdgeData,
  Threat,
  Mitigation,
  AttackTreeNode,
  ComponentType,
  ThreatModelExport,
} from '@/types';
import { DEFAULT_THREATS_BY_COMPONENT, DEFAULT_MITIGATIONS } from '@/data/components';
import { generateId } from '@/lib/utils';

interface ThreatModelState {
  // Diagram State
  nodes: Node<ThreatNodeData>[];
  edges: Edge<DataFlowEdgeData>[];

  // Selection State
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Model Metadata
  modelName: string;
  modelDescription: string;

  // Actions
  setNodes: (nodes: Node<ThreatNodeData>[]) => void;
  setEdges: (edges: Edge<DataFlowEdgeData>[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  // Node Operations
  addNode: (componentType: ComponentType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Partial<ThreatNodeData>) => void;
  deleteNode: (nodeId: string) => void;

  // Selection
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;

  // Threat Operations
  addThreat: (nodeId: string, threat: Threat) => void;
  updateThreat: (nodeId: string, threatId: string, threat: Partial<Threat>) => void;
  removeThreat: (nodeId: string, threatId: string) => void;

  // Mitigation Operations
  addMitigation: (nodeId: string, mitigation: Mitigation) => void;
  updateMitigation: (nodeId: string, mitigationId: string, mitigation: Partial<Mitigation>) => void;
  removeMitigation: (nodeId: string, mitigationId: string) => void;

  // Model Operations
  setModelName: (name: string) => void;
  setModelDescription: (description: string) => void;
  exportModel: () => ThreatModelExport;
  importModel: (model: ThreatModelExport) => void;
  clearModel: () => void;

  // Computed
  getSelectedNode: () => Node<ThreatNodeData> | undefined;
  getAllThreats: () => Threat[];
  getAllMitigations: () => Mitigation[];
  getAttackTree: (nodeId: string) => AttackTreeNode | null;
}

const getDefaultNodeLabel = (componentType: ComponentType): string => {
  const labels: Record<ComponentType, string> = {
    webApplication: 'Web Application',
    mobileApp: 'Mobile App',
    apiGateway: 'API Gateway',
    database: 'Database',
    cache: 'Cache',
    messageQueue: 'Message Queue',
    externalService: 'External Service',
    userActor: 'User',
    trustBoundary: 'Trust Boundary',
  };
  return labels[componentType];
};

const generateDefaultThreats = (componentType: ComponentType): Threat[] => {
  const defaultThreats = DEFAULT_THREATS_BY_COMPONENT[componentType] || [];
  return defaultThreats.map((threat) => ({
    id: generateId(),
    category: threat.category,
    title: threat.title,
    description: threat.description,
    severity: threat.severity,
    likelihood: threat.likelihood,
    impact: threat.impact,
    cweId: threat.cweId,
    mitigationIds: [],
  }));
};

const generateDefaultMitigations = (threats: Threat[]): Mitigation[] => {
  const mitigations: Mitigation[] = [];
  const addedTitles = new Set<string>();

  threats.forEach((threat) => {
    const categoryMitigations = DEFAULT_MITIGATIONS[threat.category] || [];
    categoryMitigations.forEach((mit) => {
      if (!addedTitles.has(mit.title)) {
        addedTitles.add(mit.title);
        const mitigation: Mitigation = {
          id: generateId(),
          title: mit.title,
          description: mit.description,
          priority: mit.priority,
          status: 'not-implemented',
          controlType: mit.controlType,
          nistControl: mit.nistControl,
          owaspRecommendation: mit.owaspRecommendation,
        };
        mitigations.push(mitigation);
      }
    });
  });

  return mitigations;
};

export const useThreatModelStore = create<ThreatModelState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      modelName: 'Untitled Threat Model',
      modelDescription: '',

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as Node<ThreatNodeData>[],
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges) as Edge<DataFlowEdgeData>[],
        });
      },

      onConnect: (connection) => {
        const newEdge: Edge<DataFlowEdgeData> = {
          ...connection,
          id: generateId(),
          type: 'smoothstep',
          animated: true,
          data: {
            label: 'Data Flow',
            encrypted: false,
            authenticated: false,
            threats: [],
          },
        } as Edge<DataFlowEdgeData>;
        set({
          edges: addEdge(newEdge, get().edges),
        });
      },

      addNode: (componentType, position) => {
        const threats = generateDefaultThreats(componentType);
        const mitigations = generateDefaultMitigations(threats);

        // Link threats to mitigations
        threats.forEach((threat) => {
          const relevantMitigations = mitigations.filter((m) => {
            const categoryMits = DEFAULT_MITIGATIONS[threat.category] || [];
            return categoryMits.some((cm) => cm.title === m.title);
          });
          threat.mitigationIds = relevantMitigations.map((m) => m.id);
        });

        const newNode: Node<ThreatNodeData> = {
          id: generateId(),
          type: componentType === 'trustBoundary' ? 'trustBoundary' : 'threatNode',
          position,
          data: {
            label: getDefaultNodeLabel(componentType),
            componentType,
            threats,
            mitigations,
            trustLevel: 'semi-trusted',
            dataClassification: 'internal',
          },
        };

        set({ nodes: [...get().nodes, newNode] });
      },

      updateNode: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
          ),
        });
      },

      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        });
      },

      setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
      setSelectedEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),

      addThreat: (nodeId, threat) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, threats: [...node.data.threats, threat] } }
              : node
          ),
        });
      },

      updateThreat: (nodeId, threatId, threatUpdate) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    threats: node.data.threats.map((t) =>
                      t.id === threatId ? { ...t, ...threatUpdate } : t
                    ),
                  },
                }
              : node
          ),
        });
      },

      removeThreat: (nodeId, threatId) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    threats: node.data.threats.filter((t) => t.id !== threatId),
                  },
                }
              : node
          ),
        });
      },

      addMitigation: (nodeId, mitigation) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: { ...node.data, mitigations: [...node.data.mitigations, mitigation] },
                }
              : node
          ),
        });
      },

      updateMitigation: (nodeId, mitigationId, mitigationUpdate) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    mitigations: node.data.mitigations.map((m) =>
                      m.id === mitigationId ? { ...m, ...mitigationUpdate } : m
                    ),
                  },
                }
              : node
          ),
        });
      },

      removeMitigation: (nodeId, mitigationId) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    mitigations: node.data.mitigations.filter((m) => m.id !== mitigationId),
                  },
                }
              : node
          ),
        });
      },

      setModelName: (name) => set({ modelName: name }),
      setModelDescription: (description) => set({ modelDescription: description }),

      exportModel: () => {
        const { nodes, edges, modelName, modelDescription } = get();
        const allThreats = get().getAllThreats();
        const allMitigations = get().getAllMitigations();

        const criticalThreats = allThreats.filter((t) => t.severity === 'critical').length;
        const highThreats = allThreats.filter((t) => t.severity === 'high').length;
        const mediumThreats = allThreats.filter((t) => t.severity === 'medium').length;
        const lowThreats = allThreats.filter((t) => t.severity === 'low').length;

        const implementedMitigations = allMitigations.filter(
          (m) => m.status === 'implemented'
        ).length;
        const mitigationCoverage =
          allMitigations.length > 0
            ? Math.round((implementedMitigations / allMitigations.length) * 100)
            : 0;

        const attackTrees: Record<string, AttackTreeNode> = {};
        nodes.forEach((node) => {
          const tree = get().getAttackTree(node.id);
          if (tree) {
            attackTrees[node.id] = tree;
          }
        });

        return {
          metadata: {
            name: modelName,
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: modelDescription,
          },
          diagram: { nodes, edges },
          threats: allThreats,
          mitigations: allMitigations,
          attackTrees,
          summary: {
            totalThreats: allThreats.length,
            criticalThreats,
            highThreats,
            mediumThreats,
            lowThreats,
            mitigationCoverage,
          },
        };
      },

      importModel: (model) => {
        set({
          nodes: model.diagram.nodes,
          edges: model.diagram.edges,
          modelName: model.metadata.name,
          modelDescription: model.metadata.description || '',
          selectedNodeId: null,
          selectedEdgeId: null,
        });
      },

      clearModel: () => {
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          selectedEdgeId: null,
          modelName: 'Untitled Threat Model',
          modelDescription: '',
        });
      },

      getSelectedNode: () => {
        const { nodes, selectedNodeId } = get();
        return nodes.find((n) => n.id === selectedNodeId);
      },

      getAllThreats: () => {
        return get().nodes.flatMap((node) => node.data.threats || []);
      },

      getAllMitigations: () => {
        const allMitigations: Mitigation[] = [];
        const seenIds = new Set<string>();

        get().nodes.forEach((node) => {
          (node.data.mitigations || []).forEach((m) => {
            if (!seenIds.has(m.id)) {
              seenIds.add(m.id);
              allMitigations.push(m);
            }
          });
        });

        return allMitigations;
      },

      getAttackTree: (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (!node || !node.data.threats?.length) return null;

        const attackTree: AttackTreeNode = {
          id: nodeId,
          label: `Compromise ${node.data.label}`,
          type: 'goal',
          children: node.data.threats.map((threat) => ({
            id: threat.id,
            label: threat.title,
            type: 'attack',
            probability: threat.likelihood === 'high' ? 0.7 : threat.likelihood === 'medium' ? 0.4 : 0.1,
            children: threat.mitigationIds.map((mitId) => {
              const mitigation = node.data.mitigations.find((m) => m.id === mitId);
              return {
                id: mitId,
                label: mitigation?.title || 'Unknown Mitigation',
                type: 'mitigation' as const,
                mitigated: mitigation?.status === 'implemented',
              };
            }),
          })),
        };

        return attackTree;
      },
    }),
    {
      name: 'threat-model-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        modelName: state.modelName,
        modelDescription: state.modelDescription,
      }),
    }
  )
);
