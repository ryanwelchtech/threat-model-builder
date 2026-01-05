import {
  getDefaultNodeLabel,
  generateDefaultThreats,
  generateDefaultMitigations,
} from '../threatModelStore';

import { DEFAULT_THREATS_BY_COMPONENT, DEFAULT_MITIGATIONS } from '@/data/components';
import { ComponentType, StrideCategory } from '@/types';

describe('threatModelStore utilities', () => {
  describe('getDefaultNodeLabel', () => {
    it('should return correct labels for all component types', () => {
      expect(getDefaultNodeLabel('webApplication')).toBe('Web Application');
      expect(getDefaultNodeLabel('mobileApp')).toBe('Mobile App');
      expect(getDefaultNodeLabel('apiGateway')).toBe('API Gateway');
      expect(getDefaultNodeLabel('database')).toBe('Database');
      expect(getDefaultNodeLabel('cache')).toBe('Cache');
      expect(getDefaultNodeLabel('messageQueue')).toBe('Message Queue');
      expect(getDefaultNodeLabel('externalService')).toBe('External Service');
      expect(getDefaultNodeLabel('userActor')).toBe('User');
      expect(getDefaultNodeLabel('trustBoundary')).toBe('Trust Boundary');
    });
  });

  describe('generateDefaultThreats', () => {
    it('should generate threats for webApplication', () => {
      const threats = generateDefaultThreats('webApplication');
      expect(threats.length).toBeGreaterThan(0);
      expect(threats[0]).toHaveProperty('id');
      expect(threats[0]).toHaveProperty('category');
      expect(threats[0]).toHaveProperty('title');
      expect(threats[0]).toHaveProperty('description');
      expect(threats[0]).toHaveProperty('severity');
      expect(threats[0]).toHaveProperty('likelihood');
      expect(threats[0]).toHaveProperty('impact');
      expect(threats[0]).toHaveProperty('mitigationIds');
    });

    it('should generate threats with correct categories for webApplication', () => {
      const threats = generateDefaultThreats('webApplication');
      const categories = threats.map((t) => t.category);
      expect(categories).toContain('spoofing');
      expect(categories).toContain('tampering');
      expect(categories).toContain('elevationOfPrivilege');
    });

    it('should generate unique IDs for each threat', () => {
      const threats = generateDefaultThreats('webApplication');
      const ids = threats.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should return empty array for trustBoundary', () => {
      const threats = generateDefaultThreats('trustBoundary');
      expect(threats).toEqual([]);
    });

    it('should generate threats with valid severity values', () => {
      const threats = generateDefaultThreats('webApplication');
      const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
      threats.forEach((threat) => {
        expect(validSeverities).toContain(threat.severity);
      });
    });
  });

  describe('generateDefaultMitigations', () => {
    it('should generate mitigations for threats', () => {
      const threats = generateDefaultThreats('webApplication');
      const mitigations = generateDefaultMitigations(threats);
      expect(mitigations.length).toBeGreaterThan(0);
    });

    it('should generate mitigations with required properties', () => {
      const threats = generateDefaultThreats('webApplication');
      const mitigations = generateDefaultMitigations(threats);
      if (mitigations.length > 0) {
        expect(mitigations[0]).toHaveProperty('id');
        expect(mitigations[0]).toHaveProperty('title');
        expect(mitigations[0]).toHaveProperty('description');
        expect(mitigations[0]).toHaveProperty('priority');
        expect(mitigations[0]).toHaveProperty('status');
        expect(mitigations[0]).toHaveProperty('controlType');
      }
    });

    it('should not duplicate mitigations with same title', () => {
      const threats = generateDefaultThreats('webApplication');
      const mitigations = generateDefaultMitigations(threats);
      const titles = mitigations.map((m) => m.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('should set status to not-implemented by default', () => {
      const threats = generateDefaultThreats('webApplication');
      const mitigations = generateDefaultMitigations(threats);
      mitigations.forEach((mitigation) => {
        expect(mitigation.status).toBe('not-implemented');
      });
    });

    it('should generate mitigations for different STRIDE categories', () => {
      const threats: Array<{
        id: string;
        category: StrideCategory;
        title: string;
        description: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        likelihood: 'high' | 'medium' | 'low';
        impact: 'high' | 'medium' | 'low';
        mitigationIds: string[];
      }> = [
        {
          id: '1',
          category: 'spoofing',
          title: 'Test Spoofing',
          description: 'Test',
          severity: 'high',
          likelihood: 'medium',
          impact: 'high',
          mitigationIds: [],
        },
        {
          id: '2',
          category: 'tampering',
          title: 'Test Tampering',
          description: 'Test',
          severity: 'high',
          likelihood: 'medium',
          impact: 'high',
          mitigationIds: [],
        },
      ];

      const mitigations = generateDefaultMitigations(threats);
      expect(mitigations.length).toBeGreaterThan(1);
    });
  });
});
