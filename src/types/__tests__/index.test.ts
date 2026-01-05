import {
  STRIDE_DESCRIPTIONS,
  SEVERITY_COLORS,
  COMPONENT_CATEGORIES,
  STRIDE_CATEGORIES,
  COMPONENT_TYPES,
  THREAT_SEVERITIES,
  PRIORITY_SCORES,
} from '@/types';

describe('types', () => {
  describe('STRIDE_DESCRIPTIONS', () => {
    it('should have descriptions for all STRIDE categories', () => {
      expect(STRIDE_DESCRIPTIONS.spoofing).toBeDefined();
      expect(STRIDE_DESCRIPTIONS.tampering).toBeDefined();
      expect(STRIDE_DESCRIPTIONS.repudiation).toBeDefined();
      expect(STRIDE_DESCRIPTIONS.informationDisclosure).toBeDefined();
      expect(STRIDE_DESCRIPTIONS.denialOfService).toBeDefined();
      expect(STRIDE_DESCRIPTIONS.elevationOfPrivilege).toBeDefined();
    });

    it('should have name and description for each category', () => {
      Object.values(STRIDE_DESCRIPTIONS).forEach((info) => {
        expect(info).toHaveProperty('name');
        expect(info).toHaveProperty('description');
        expect(typeof info.name).toBe('string');
        expect(typeof info.description).toBe('string');
      });
    });
  });

  describe('SEVERITY_COLORS', () => {
    it('should have colors for all severity levels', () => {
      expect(SEVERITY_COLORS.critical).toBeDefined();
      expect(SEVERITY_COLORS.high).toBeDefined();
      expect(SEVERITY_COLORS.medium).toBeDefined();
      expect(SEVERITY_COLORS.low).toBeDefined();
      expect(SEVERITY_COLORS.info).toBeDefined();
    });

    it('should use hex color format', () => {
      Object.values(SEVERITY_COLORS).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('COMPONENT_CATEGORIES', () => {
    it('should have all expected categories', () => {
      expect(COMPONENT_CATEGORIES.application).toBe('Applications');
      expect(COMPONENT_CATEGORIES.infrastructure).toBe('Infrastructure');
      expect(COMPONENT_CATEGORIES.external).toBe('External');
      expect(COMPONENT_CATEGORIES.boundary).toBe('Boundaries');
    });
  });

  describe('Type exports', () => {
    it('should have STRIDE_CATEGORIES as tuple', () => {
      const categories: readonly [
        'spoofing',
        'tampering',
        'repudiation',
        'informationDisclosure',
        'denialOfService',
        'elevationOfPrivilege',
      ] = STRIDE_CATEGORIES;
      expect(categories.length).toBe(6);
    });

    it('should have COMPONENT_TYPES as tuple', () => {
      const types = COMPONENT_TYPES;
      expect(types.length).toBe(17);
      expect(types).toContain('webApplication');
      expect(types).toContain('mobileApp');
      expect(types).toContain('apiGateway');
      expect(types).toContain('database');
      expect(types).toContain('cache');
      expect(types).toContain('messageQueue');
      expect(types).toContain('externalService');
      expect(types).toContain('userActor');
      expect(types).toContain('trustBoundary');
      expect(types).toContain('loadBalancer');
      expect(types).toContain('dns');
      expect(types).toContain('fileStorage');
      expect(types).toContain('cdn');
      expect(types).toContain('authService');
      expect(types).toContain('emailService');
      expect(types).toContain('searchService');
      expect(types).toContain('loggingService');
    });

    it('should have THREAT_SEVERITIES as tuple', () => {
      const severities = THREAT_SEVERITIES;
      expect(severities.length).toBe(5);
      expect(severities).toContain('critical');
      expect(severities).toContain('high');
      expect(severities).toContain('medium');
      expect(severities).toContain('low');
      expect(severities).toContain('info');
    });

    it('should have PRIORITY_SCORES as tuple', () => {
      const priorities: readonly [1, 2, 3, 4, 5] = PRIORITY_SCORES;
      expect(priorities.length).toBe(5);
    });
  });
});
