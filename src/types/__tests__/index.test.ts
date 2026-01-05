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
      const types: readonly [
        'webApplication',
        'mobileApp',
        'apiGateway',
        'database',
        'cache',
        'messageQueue',
        'externalService',
        'userActor',
        'trustBoundary',
      ] = COMPONENT_TYPES;
      expect(types.length).toBe(9);
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
