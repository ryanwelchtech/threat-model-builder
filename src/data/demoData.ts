import { ThreatModelExport } from '@/types';
import { Node, Edge, MarkerType } from 'reactflow';

const DEMO_NODES: Node<any>[] = [
  { id: 'user-1', type: 'threatNode', position: { x: 100, y: 100 }, data: { label: 'User Browser', componentType: 'webApplication', description: 'End-user web browser', threats: [], mitigations: [], trustLevel: 'untrusted', dataClassification: 'public' } },
  { id: 'lb-1', type: 'threatNode', position: { x: 300, y: 100 }, data: { label: 'Load Balancer', componentType: 'loadBalancer', description: 'Application Load Balancer', threats: [], mitigations: [], trustLevel: 'semi-trusted', dataClassification: 'internal' } },
  { id: 'api-1', type: 'threatNode', position: { x: 500, y: 100 }, data: { label: 'API Gateway', componentType: 'apiGateway', description: 'REST API Gateway', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'confidential' } },
  { id: 'auth-1', type: 'threatNode', position: { x: 500, y: 250 }, data: { label: 'Auth Service', componentType: 'identityProvider', description: 'Authentication Service', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'restricted' } },
  { id: 'db-1', type: 'threatNode', position: { x: 700, y: 175 }, data: { label: 'User Database', componentType: 'database', description: 'PostgreSQL Database', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'restricted' } },
  { id: 'cache-1', type: 'threatNode', position: { x: 700, y: 300 }, data: { label: 'Redis Cache', componentType: 'cache', description: 'Session Cache', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'confidential' } },
  { id: 's3-1', type: 'threatNode', position: { x: 900, y: 100 }, data: { label: 'S3 Assets', componentType: 'fileStorage', description: 'Static Assets Bucket', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'public' } },
  { id: 'queue-1', type: 'threatNode', position: { x: 900, y: 250 }, data: { label: 'Message Queue', componentType: 'messageQueue', description: 'SQS Queue', threats: [], mitigations: [], trustLevel: 'trusted', dataClassification: 'internal' } },
];

const DEMO_EDGES: Edge<any>[] = [
  { id: 'e1-2', source: 'user-1', target: 'lb-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: 'lb-1', target: 'api-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: 'api-1', target: 'auth-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-5', source: 'api-1', target: 'db-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: 'db-1', target: 'cache-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-7', source: 'api-1', target: 's3-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-8', source: 'api-1', target: 'queue-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export function getDemoModel(): ThreatModelExport {
  return {
    metadata: {
      name: 'Demo Architecture',
      description: 'Sample microservices architecture',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'System',
    },
    diagram: {
      nodes: DEMO_NODES,
      edges: DEMO_EDGES,
    },
    threats: [
      { id: 'T1', title: 'SQL Injection', description: 'SQL injection through API', category: 'tampering', severity: 'critical', likelihood: 'medium', impact: 'high', mitigationIds: ['M1'] },
      { id: 'T2', title: 'Session Hijacking', description: 'Session token theft', category: 'spoofing', severity: 'high', likelihood: 'medium', impact: 'high', mitigationIds: ['M2'] },
      { id: 'T3', title: 'DDoS Attack', description: 'Service overwhelmed', category: 'denialOfService', severity: 'high', likelihood: 'high', impact: 'medium', mitigationIds: ['M3'] },
      { id: 'T4', title: 'Data Exposure', description: 'Data intercepted in transit', category: 'informationDisclosure', severity: 'critical', likelihood: 'low', impact: 'high', mitigationIds: ['M4'] },
      { id: 'T5', title: 'Privilege Escalation', description: 'Unauthorized access gain', category: 'elevationOfPrivilege', severity: 'critical', likelihood: 'low', impact: 'high', mitigationIds: ['M5'] },
    ],
    mitigations: [
      { id: 'M1', title: 'Parameterized Queries', description: 'Use prepared statements', priority: 5, status: 'in-progress', controlType: 'preventive', owaspRecommendation: 'A03:2021', nistControl: 'SI-10' },
      { id: 'M2', title: 'Secure Sessions', description: 'HTTP-only cookies', priority: 5, status: 'implemented', controlType: 'preventive', owaspRecommendation: 'A07:2021', nistControl: 'AC-11' },
      { id: 'M3', title: 'Rate Limiting', description: 'API rate limits', priority: 4, status: 'not-implemented', controlType: 'detective', owaspRecommendation: 'A07:2021', nistControl: 'SC-5' },
      { id: 'M4', title: 'TLS 1.3', description: 'Enable TLS 1.3', priority: 5, status: 'implemented', controlType: 'preventive', owaspRecommendation: 'A02:2021', nistControl: 'SC-8' },
      { id: 'M5', title: 'RBAC', description: 'Role-based access control', priority: 5, status: 'in-progress', controlType: 'preventive', owaspRecommendation: 'A01:2021', nistControl: 'AC-6' },
    ],
    attackTrees: {},
    summary: {
      totalThreats: 5,
      criticalThreats: 2,
      highThreats: 3,
      mediumThreats: 0,
      lowThreats: 0,
      mitigationCoverage: 40,
    },
  };
}
