import { ComponentDefinition, ComponentType, StrideCategory } from '@/types';

export const COMPONENT_LIBRARY: ComponentDefinition[] = [
  // Applications
  {
    id: 'webApplication',
    name: 'Web Application',
    icon: 'Globe',
    description: 'Browser-based web application',
    category: 'application',
    defaultThreats: [
      'spoofing',
      'tampering',
      'repudiation',
      'informationDisclosure',
      'denialOfService',
      'elevationOfPrivilege',
    ],
  },
  {
    id: 'mobileApp',
    name: 'Mobile App',
    icon: 'Smartphone',
    description: 'iOS or Android mobile application',
    category: 'application',
    defaultThreats: [
      'spoofing',
      'tampering',
      'repudiation',
      'informationDisclosure',
      'elevationOfPrivilege',
    ],
  },
  {
    id: 'apiGateway',
    name: 'API Gateway',
    icon: 'Workflow',
    description: 'API gateway or reverse proxy',
    category: 'application',
    defaultThreats: ['spoofing', 'tampering', 'denialOfService', 'elevationOfPrivilege'],
  },

  // Infrastructure
  {
    id: 'database',
    name: 'Database',
    icon: 'Database',
    description: 'SQL or NoSQL database',
    category: 'infrastructure',
    defaultThreats: ['tampering', 'informationDisclosure', 'denialOfService'],
  },
  {
    id: 'cache',
    name: 'Cache',
    icon: 'HardDrive',
    description: 'In-memory cache (Redis, Memcached)',
    category: 'infrastructure',
    defaultThreats: ['tampering', 'informationDisclosure', 'denialOfService'],
  },
  {
    id: 'messageQueue',
    name: 'Message Queue',
    icon: 'MessagesSquare',
    description: 'Message broker (RabbitMQ, Kafka)',
    category: 'infrastructure',
    defaultThreats: ['tampering', 'repudiation', 'informationDisclosure', 'denialOfService'],
  },

  // External
  {
    id: 'externalService',
    name: 'External Service',
    icon: 'Cloud',
    description: 'Third-party API or service',
    category: 'external',
    defaultThreats: ['spoofing', 'tampering', 'informationDisclosure', 'denialOfService'],
  },
  {
    id: 'userActor',
    name: 'User/Actor',
    icon: 'User',
    description: 'Human user or automated actor',
    category: 'external',
    defaultThreats: ['spoofing', 'repudiation', 'elevationOfPrivilege'],
  },

  // Boundaries
  {
    id: 'trustBoundary',
    name: 'Trust Boundary',
    icon: 'Shield',
    description: 'Security or network boundary',
    category: 'boundary',
    defaultThreats: [],
  },
];

// Default Threats by Component Type
export const DEFAULT_THREATS_BY_COMPONENT: Record<
  ComponentType,
  Array<{
    category: StrideCategory;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    likelihood: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
    cweId?: string;
  }>
> = {
  webApplication: [
    {
      category: 'spoofing',
      title: 'Session Hijacking',
      description: 'Attacker steals or predicts session tokens to impersonate legitimate users',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-384',
    },
    {
      category: 'tampering',
      title: 'Cross-Site Scripting (XSS)',
      description: 'Injection of malicious scripts into web pages viewed by other users',
      severity: 'high',
      likelihood: 'high',
      impact: 'medium',
      cweId: 'CWE-79',
    },
    {
      category: 'informationDisclosure',
      title: 'Sensitive Data Exposure',
      description: 'Unintended exposure of sensitive information through error messages or logs',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-200',
    },
    {
      category: 'denialOfService',
      title: 'Application-Layer DoS',
      description: 'Resource exhaustion through expensive operations or slow requests',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-400',
    },
    {
      category: 'elevationOfPrivilege',
      title: 'Broken Access Control',
      description: 'Bypass of authorization checks to access restricted functionality',
      severity: 'critical',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-284',
    },
  ],
  mobileApp: [
    {
      category: 'spoofing',
      title: 'Insecure Authentication',
      description: 'Weak or bypassable authentication mechanisms in mobile app',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-287',
    },
    {
      category: 'tampering',
      title: 'Code Tampering',
      description: 'Modification of app binary or runtime manipulation',
      severity: 'high',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-494',
    },
    {
      category: 'informationDisclosure',
      title: 'Insecure Data Storage',
      description: 'Sensitive data stored insecurely on device',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-922',
    },
    {
      category: 'elevationOfPrivilege',
      title: 'Root/Jailbreak Bypass',
      description: 'Security controls bypassed on rooted/jailbroken devices',
      severity: 'medium',
      likelihood: 'low',
      impact: 'medium',
      cweId: 'CWE-919',
    },
  ],
  apiGateway: [
    {
      category: 'spoofing',
      title: 'API Key Theft',
      description: 'Unauthorized access through stolen or leaked API credentials',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-522',
    },
    {
      category: 'tampering',
      title: 'Request Manipulation',
      description: 'Modification of API requests in transit',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-472',
    },
    {
      category: 'denialOfService',
      title: 'Rate Limit Bypass',
      description: 'Circumvention of rate limiting controls',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-770',
    },
    {
      category: 'elevationOfPrivilege',
      title: 'Broken Function Level Authorization',
      description: 'Access to administrative APIs by regular users',
      severity: 'critical',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-285',
    },
  ],
  database: [
    {
      category: 'tampering',
      title: 'SQL Injection',
      description: 'Execution of arbitrary SQL commands through unsanitized input',
      severity: 'critical',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-89',
    },
    {
      category: 'informationDisclosure',
      title: 'Unauthorized Data Access',
      description: 'Direct database access bypassing application layer controls',
      severity: 'critical',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-284',
    },
    {
      category: 'denialOfService',
      title: 'Resource Exhaustion',
      description: 'Database overload through expensive queries or connection flooding',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-400',
    },
  ],
  cache: [
    {
      category: 'tampering',
      title: 'Cache Poisoning',
      description: 'Injection of malicious data into cache storage',
      severity: 'high',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-349',
    },
    {
      category: 'informationDisclosure',
      title: 'Cache Side-Channel',
      description: 'Information leakage through cache timing attacks',
      severity: 'medium',
      likelihood: 'low',
      impact: 'medium',
      cweId: 'CWE-208',
    },
    {
      category: 'denialOfService',
      title: 'Cache Exhaustion',
      description: 'Memory exhaustion through cache flooding',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-400',
    },
  ],
  messageQueue: [
    {
      category: 'tampering',
      title: 'Message Manipulation',
      description: 'Modification of messages in transit or storage',
      severity: 'high',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-471',
    },
    {
      category: 'repudiation',
      title: 'Message Repudiation',
      description: 'Denial of message publication or consumption',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-778',
    },
    {
      category: 'informationDisclosure',
      title: 'Unencrypted Message Data',
      description: 'Sensitive data exposed in plaintext messages',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-311',
    },
    {
      category: 'denialOfService',
      title: 'Queue Flooding',
      description: 'Message queue overwhelmed with malicious messages',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-400',
    },
  ],
  externalService: [
    {
      category: 'spoofing',
      title: 'Service Impersonation',
      description: 'Malicious service posing as legitimate third-party',
      severity: 'high',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-290',
    },
    {
      category: 'tampering',
      title: 'Response Manipulation',
      description: 'Man-in-the-middle modification of service responses',
      severity: 'high',
      likelihood: 'low',
      impact: 'high',
      cweId: 'CWE-300',
    },
    {
      category: 'informationDisclosure',
      title: 'Data Leakage to Third-Party',
      description: 'Excessive data shared with external service',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-359',
    },
    {
      category: 'denialOfService',
      title: 'Service Dependency Failure',
      description: 'Application failure due to external service unavailability',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-636',
    },
  ],
  userActor: [
    {
      category: 'spoofing',
      title: 'Identity Spoofing',
      description: 'Attacker impersonating legitimate user',
      severity: 'high',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-290',
    },
    {
      category: 'repudiation',
      title: 'Action Repudiation',
      description: 'User denying performed actions',
      severity: 'medium',
      likelihood: 'medium',
      impact: 'medium',
      cweId: 'CWE-778',
    },
    {
      category: 'elevationOfPrivilege',
      title: 'Privilege Escalation',
      description: 'User gaining unauthorized elevated access',
      severity: 'critical',
      likelihood: 'medium',
      impact: 'high',
      cweId: 'CWE-269',
    },
  ],
  trustBoundary: [],
};

// Default Mitigations by Threat Category
export const DEFAULT_MITIGATIONS: Record<
  StrideCategory,
  Array<{
    title: string;
    description: string;
    priority: 1 | 2 | 3 | 4 | 5;
    controlType: 'preventive' | 'detective' | 'corrective';
    nistControl?: string;
    owaspRecommendation?: string;
  }>
> = {
  spoofing: [
    {
      title: 'Multi-Factor Authentication',
      description: 'Implement MFA for all user authentication',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'IA-2',
      owaspRecommendation: 'ASVS 2.8',
    },
    {
      title: 'Certificate-Based Authentication',
      description: 'Use mutual TLS for service-to-service authentication',
      priority: 2,
      controlType: 'preventive',
      nistControl: 'IA-3',
    },
    {
      title: 'Session Management',
      description: 'Implement secure session handling with rotation and timeout',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SC-23',
      owaspRecommendation: 'ASVS 3.3',
    },
  ],
  tampering: [
    {
      title: 'Input Validation',
      description: 'Validate and sanitize all user input',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SI-10',
      owaspRecommendation: 'ASVS 5.1',
    },
    {
      title: 'Data Integrity Checks',
      description: 'Implement cryptographic integrity verification',
      priority: 2,
      controlType: 'detective',
      nistControl: 'SI-7',
    },
    {
      title: 'Parameterized Queries',
      description: 'Use parameterized queries or ORM to prevent injection',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SI-10',
      owaspRecommendation: 'ASVS 5.3',
    },
  ],
  repudiation: [
    {
      title: 'Comprehensive Logging',
      description: 'Log all security-relevant events with timestamps',
      priority: 2,
      controlType: 'detective',
      nistControl: 'AU-2',
      owaspRecommendation: 'ASVS 7.1',
    },
    {
      title: 'Digital Signatures',
      description: 'Implement digital signatures for critical transactions',
      priority: 3,
      controlType: 'preventive',
      nistControl: 'AU-10',
    },
    {
      title: 'Audit Trail Protection',
      description: 'Protect audit logs from modification or deletion',
      priority: 2,
      controlType: 'preventive',
      nistControl: 'AU-9',
    },
  ],
  informationDisclosure: [
    {
      title: 'Data Encryption at Rest',
      description: 'Encrypt sensitive data in storage',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SC-28',
      owaspRecommendation: 'ASVS 6.2',
    },
    {
      title: 'Data Encryption in Transit',
      description: 'Use TLS 1.3 for all data transmission',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SC-8',
      owaspRecommendation: 'ASVS 9.1',
    },
    {
      title: 'Access Control Lists',
      description: 'Implement least privilege access controls',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'AC-6',
      owaspRecommendation: 'ASVS 4.1',
    },
    {
      title: 'Data Masking',
      description: 'Mask sensitive data in logs and error messages',
      priority: 2,
      controlType: 'preventive',
      nistControl: 'SI-11',
    },
  ],
  denialOfService: [
    {
      title: 'Rate Limiting',
      description: 'Implement request rate limiting and throttling',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'SC-5',
      owaspRecommendation: 'ASVS 11.1',
    },
    {
      title: 'Resource Quotas',
      description: 'Set resource limits per user/request',
      priority: 2,
      controlType: 'preventive',
      nistControl: 'SC-6',
    },
    {
      title: 'Auto-Scaling',
      description: 'Implement auto-scaling infrastructure',
      priority: 3,
      controlType: 'corrective',
      nistControl: 'CP-2',
    },
    {
      title: 'DDoS Protection',
      description: 'Deploy DDoS mitigation services',
      priority: 2,
      controlType: 'preventive',
      nistControl: 'SC-5',
    },
  ],
  elevationOfPrivilege: [
    {
      title: 'Role-Based Access Control',
      description: 'Implement RBAC with principle of least privilege',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'AC-2',
      owaspRecommendation: 'ASVS 4.2',
    },
    {
      title: 'Privilege Separation',
      description: 'Separate administrative and user functions',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'AC-6',
    },
    {
      title: 'Authorization Checks',
      description: 'Verify authorization for every request',
      priority: 1,
      controlType: 'preventive',
      nistControl: 'AC-3',
      owaspRecommendation: 'ASVS 4.1',
    },
    {
      title: 'Security Monitoring',
      description: 'Monitor for privilege escalation attempts',
      priority: 2,
      controlType: 'detective',
      nistControl: 'SI-4',
    },
  ],
};

// Prebuilt Architecture Templates
export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  components: Array<{
    type: ComponentType;
    position: { x: number; y: number };
  }>;
  trustBoundaries?: Array<{
    position: { x: number; y: number };
    width: number;
    height: number;
  }>;
}

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'restApi',
    name: 'REST API Service',
    description: 'Standard REST API with database and cache',
    icon: 'Workflow',
    category: 'Full Stack',
    components: [
      { type: 'userActor', position: { x: 400, y: 50 } },
      { type: 'apiGateway', position: { x: 400, y: 180 } },
      { type: 'webApplication', position: { x: 200, y: 350 } },
      { type: 'database', position: { x: 400, y: 450 } },
      { type: 'cache', position: { x: 600, y: 450 } },
      { type: 'externalService', position: { x: 750, y: 180 } },
    ],
    trustBoundaries: [
      { position: { x: 100, y: 130 }, width: 600, height: 400 },
    ],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Distributed microservices with message queue',
    icon: 'MessagesSquare',
    category: 'Distributed',
    components: [
      { type: 'userActor', position: { x: 400, y: 50 } },
      { type: 'apiGateway', position: { x: 400, y: 150 } },
      { type: 'webApplication', position: { x: 150, y: 300 } },
      { type: 'webApplication', position: { x: 400, y: 300 } },
      { type: 'webApplication', position: { x: 650, y: 300 } },
      { type: 'messageQueue', position: { x: 400, y: 450 } },
      { type: 'database', position: { x: 150, y: 550 } },
      { type: 'database', position: { x: 400, y: 550 } },
      { type: 'database', position: { x: 650, y: 550 } },
      { type: 'cache', position: { x: 400, y: 650 } },
    ],
    trustBoundaries: [
      { position: { x: 80, y: 240 }, width: 250, height: 480 },
      { position: { x: 330, y: 240 }, width: 250, height: 480 },
      { position: { x: 580, y: 240 }, width: 250, height: 480 },
    ],
  },
  {
    id: 'mobileBackend',
    name: 'Mobile Backend',
    description: 'Mobile app with backend services',
    icon: 'Smartphone',
    category: 'Mobile',
    components: [
      { type: 'mobileApp', position: { x: 400, y: 50 } },
      { type: 'apiGateway', position: { x: 400, y: 180 } },
      { type: 'webApplication', position: { x: 250, y: 350 } },
      { type: 'database', position: { x: 400, y: 450 } },
      { type: 'externalService', position: { x: 600, y: 250 } },
    ],
    trustBoundaries: [
      { position: { x: 200, y: 130 }, width: 400, height: 400 },
    ],
  },
  {
    id: 'threeTier',
    name: 'Three-Tier Application',
    description: 'Classic three-tier architecture',
    icon: 'Database',
    category: 'Classic',
    components: [
      { type: 'userActor', position: { x: 400, y: 30 } },
      { type: 'webApplication', position: { x: 400, y: 150 } },
      { type: 'apiGateway', position: { x: 400, y: 280 } },
      { type: 'database', position: { x: 400, y: 450 } },
    ],
    trustBoundaries: [
      { position: { x: 150, y: 100 }, width: 500, height: 100 },
      { position: { x: 150, y: 230 }, width: 500, height: 280 },
    ],
  },
  {
    id: 'eventDriven',
    name: 'Event-Driven Architecture',
    description: 'Services communicating via events',
    icon: 'Cloud',
    category: 'Async',
    components: [
      { type: 'userActor', position: { x: 100, y: 50 } },
      { type: 'webApplication', position: { x: 100, y: 150 } },
      { type: 'messageQueue', position: { x: 300, y: 150 } },
      { type: 'webApplication', position: { x: 500, y: 150 } },
      { type: 'database', position: { x: 500, y: 350 } },
      { type: 'cache', position: { x: 300, y: 350 } },
      { type: 'externalService', position: { x: 650, y: 150 } },
    ],
    trustBoundaries: [
      { position: { x: 30, y: 90 }, width: 200, height: 200 },
      { position: { x: 430, y: 90 }, width: 300, height: 200 },
    ],
  },
  {
    id: 'saasPlatform',
    name: 'SaaS Platform',
    description: 'Multi-tenant SaaS with shared services',
    icon: 'HardDrive',
    category: 'Enterprise',
    components: [
      { type: 'userActor', position: { x: 100, y: 50 } },
      { type: 'userActor', position: { x: 300, y: 50 } },
      { type: 'userActor', position: { x: 500, y: 50 } },
      { type: 'apiGateway', position: { x: 300, y: 150 } },
      { type: 'webApplication', position: { x: 100, y: 280 } },
      { type: 'webApplication', position: { x: 300, y: 280 } },
      { type: 'webApplication', position: { x: 500, y: 280 } },
      { type: 'database', position: { x: 300, y: 420 } },
      { type: 'cache', position: { x: 500, y: 420 } },
      { type: 'messageQueue', position: { x: 100, y: 420 } },
      { type: 'externalService', position: { x: 650, y: 200 } },
    ],
    trustBoundaries: [
      { position: { x: 30, y: 220 }, width: 240, height: 280 },
      { position: { x: 280, y: 220 }, width: 240, height: 280 },
      { position: { x: 530, y: 220 }, width: 240, height: 280 },
    ],
  },
];
