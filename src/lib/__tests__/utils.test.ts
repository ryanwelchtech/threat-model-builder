import {
  generateId,
  formatDate,
  calculateRiskScore,
  getRiskLevel,
  downloadJson,
  debounce,
  cn,
} from '@/lib/utils';

describe('utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with timestamp prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-([a-z0-9]){9}$/);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
    });
  });

  describe('calculateRiskScore', () => {
    it('should calculate high risk correctly', () => {
      expect(calculateRiskScore('high', 'high')).toBe(9);
      expect(calculateRiskScore('high', 'medium')).toBe(6);
      expect(calculateRiskScore('medium', 'high')).toBe(6);
    });

    it('should calculate medium risk correctly', () => {
      expect(calculateRiskScore('medium', 'medium')).toBe(4);
      expect(calculateRiskScore('high', 'low')).toBe(3);
      expect(calculateRiskScore('low', 'high')).toBe(3);
    });

    it('should calculate low risk correctly', () => {
      expect(calculateRiskScore('low', 'low')).toBe(1);
      expect(calculateRiskScore('medium', 'low')).toBe(2);
      expect(calculateRiskScore('low', 'medium')).toBe(2);
    });
  });

  describe('getRiskLevel', () => {
    it('should return critical for score >= 9', () => {
      expect(getRiskLevel(9)).toBe('critical');
      expect(getRiskLevel(10)).toBe('critical');
    });

    it('should return high for score >= 6', () => {
      expect(getRiskLevel(6)).toBe('high');
      expect(getRiskLevel(8)).toBe('high');
    });

    it('should return medium for score >= 3', () => {
      expect(getRiskLevel(3)).toBe('medium');
      expect(getRiskLevel(5)).toBe('medium');
    });

    it('should return low for score < 3', () => {
      expect(getRiskLevel(0)).toBe('low');
      expect(getRiskLevel(2)).toBe('low');
    });
  });

  describe('downloadJson', () => {
    it('should not throw error when called', () => {
      const data = { test: 'data' };
      expect(() => downloadJson(data, 'test.json')).not.toThrow();
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should only call function once for multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active')).toBe('base active');
      expect(cn('base', false && 'active')).toBe('base');
    });

    it('should handle clsx-style arrays', () => {
      expect(cn(['a', 'b', 'c'])).toBe('a b c');
    });
  });
});
