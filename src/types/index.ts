import { Node, Edge } from 'reactflow';

// Component Types for the architecture diagram
export type ComponentType =
  | 'webApplication'
  | 'mobileApp'
  | 'apiGateway'
  | 'database'
  | 'cache'
  | 'messageQueue'
  | 'externalService'
  | 'userActor'
  | 'trustBoundary';

// STRIDE Categories
export type StrideCategory =
  | 'spoofing'
  | 'tampering'
  | 'repudiation'
  | 'informationDisclosure'
  | 'denialOfService'
  | 'elevationOfPrivilege';

// Threat Severity Levels
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Priority Score for Mitigations
export type PriorityScore = 1 | 2 | 3 | 4 | 5;

// Component Definition for the sidebar
export interface ComponentDefinition {
  id: ComponentType;
  name: string;
  icon: string;
  description: string;
  category: 'application' | 'infrastructure' | 'external' | 'boundary';
  defaultThreats: StrideCategory[];
}

// Custom Node Data
export interface ThreatNodeData {
  label: string;
  componentType: ComponentType;
  description?: string;
  threats: Threat[];
  mitigations: Mitigation[];
  trustLevel?: 'trusted' | 'untrusted' | 'semi-trusted';
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
}

// Custom Edge Data for Data Flows
export interface DataFlowEdgeData {
  label: string;
  protocol?: string;
  encrypted?: boolean;
  authenticated?: boolean;
  dataTypes?: string[];
  threats: Threat[];
}

// Threat Definition
export interface Threat {
  id: string;
  category: StrideCategory;
  title: string;
  description: string;
  severity: ThreatSeverity;
  likelihood: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  attackVector?: string;
  cweId?: string;
  mitigationIds: string[];
}

// Mitigation Definition
export interface Mitigation {
  id: string;
  title: string;
  description: string;
  priority: PriorityScore;
  status: 'implemented' | 'planned' | 'not-implemented';
  controlType: 'preventive' | 'detective' | 'corrective';
  nistControl?: string;
  owaspRecommendation?: string;
}

// Attack Tree Node
export interface AttackTreeNode {
  id: string;
  label: string;
  type: 'goal' | 'subgoal' | 'attack' | 'mitigation';
  children?: AttackTreeNode[];
  probability?: number;
  cost?: number;
  mitigated?: boolean;
}

// Threat Model Export Format
export interface ThreatModelExport {
  metadata: {
    name: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    author?: string;
    description?: string;
  };
  diagram: {
    nodes: Node<ThreatNodeData>[];
    edges: Edge<DataFlowEdgeData>[];
  };
  threats: Threat[];
  mitigations: Mitigation[];
  attackTrees: Record<string, AttackTreeNode>;
  summary: {
    totalThreats: number;
    criticalThreats: number;
    highThreats: number;
    mediumThreats: number;
    lowThreats: number;
    mitigationCoverage: number;
  };
}

// STRIDE Descriptions
export const STRIDE_DESCRIPTIONS: Record<StrideCategory, { name: string; description: string }> = {
  spoofing: {
    name: 'Spoofing',
    description: 'Pretending to be something or someone other than yourself',
  },
  tampering: {
    name: 'Tampering',
    description: 'Modifying data or code without authorization',
  },
  repudiation: {
    name: 'Repudiation',
    description: 'Claiming to not have performed an action',
  },
  informationDisclosure: {
    name: 'Information Disclosure',
    description: 'Exposing information to unauthorized individuals',
  },
  denialOfService: {
    name: 'Denial of Service',
    description: 'Denying or degrading service to users',
  },
  elevationOfPrivilege: {
    name: 'Elevation of Privilege',
    description: 'Gaining capabilities without proper authorization',
  },
};

// Severity Colors
export const SEVERITY_COLORS: Record<ThreatSeverity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
};

// Component Categories
export const COMPONENT_CATEGORIES = {
  application: 'Applications',
  infrastructure: 'Infrastructure',
  external: 'External',
  boundary: 'Boundaries',
} as const;

// Type tuples for validation
export const STRIDE_CATEGORIES = [
  'spoofing',
  'tampering',
  'repudiation',
  'informationDisclosure',
  'denialOfService',
  'elevationOfPrivilege',
] as const;

export const COMPONENT_TYPES = [
  'webApplication',
  'mobileApp',
  'apiGateway',
  'database',
  'cache',
  'messageQueue',
  'externalService',
  'userActor',
  'trustBoundary',
] as const;

export const THREAT_SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const;

export const PRIORITY_SCORES = [1, 2, 3, 4, 5] as const;
