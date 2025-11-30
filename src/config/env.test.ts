/**
 * Tests for environment configuration validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnv, getConfig, API_KEY, API_TIMEOUT, MAX_EMAIL_LENGTH } from './env';

describe('Environment Configuration', () => {
  const originalApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const originalTimeout = import.meta.env.VITE_API_TIMEOUT;
  const originalMaxLength = import.meta.env.VITE_MAX_EMAIL_LENGTH;

  afterEach(() => {
    // Restore original values
    import.meta.env.VITE_ANTHROPIC_API_KEY = originalApiKey;
    import.meta.env.VITE_API_TIMEOUT = originalTimeout;
    import.meta.env.VITE_MAX_EMAIL_LENGTH = originalMaxLength;
  });

  describe('validateEnv', () => {
    it('should throw error when API key is missing', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = '';
      
      expect(() => validateEnv()).toThrow(
        'VITE_ANTHROPIC_API_KEY is not configured'
      );
    });

    it('should throw error when API key is only whitespace', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = '   ';
      
      expect(() => validateEnv()).toThrow(
        'VITE_ANTHROPIC_API_KEY is not configured'
      );
    });

    it('should use default timeout when not provided', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_API_TIMEOUT = undefined;
      
      const config = validateEnv();
      expect(config.apiTimeout).toBe(30000);
    });

    it('should use default max email length when not provided', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_MAX_EMAIL_LENGTH = undefined;
      
      const config = validateEnv();
      expect(config.maxEmailLength).toBe(5000);
    });

    it('should parse valid timeout value', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_API_TIMEOUT = '60000';
      
      const config = validateEnv();
      expect(config.apiTimeout).toBe(60000);
    });

    it('should parse valid max email length', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_MAX_EMAIL_LENGTH = '10000';
      
      const config = validateEnv();
      expect(config.maxEmailLength).toBe(10000);
    });

    it('should trim API key whitespace', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = '  test-key  ';
      
      const config = validateEnv();
      expect(config.apiKey).toBe('test-key');
    });

    it('should return valid config with all values', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_API_TIMEOUT = '45000';
      import.meta.env.VITE_MAX_EMAIL_LENGTH = '8000';
      
      const config = validateEnv();
      expect(config).toEqual({
        apiKey: 'test-key',
        apiTimeout: 45000,
        maxEmailLength: 8000,
      });
    });
  });

  describe('getConfig', () => {
    it('should return validated config', () => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      
      const config = getConfig();
      expect(config.apiKey).toBe('test-key');
      expect(config.apiTimeout).toBeGreaterThan(0);
      expect(config.maxEmailLength).toBeGreaterThan(0);
    });
  });

  describe('convenience functions', () => {
    beforeEach(() => {
      import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-key';
      import.meta.env.VITE_API_TIMEOUT = '25000';
      import.meta.env.VITE_MAX_EMAIL_LENGTH = '6000';
    });

    it('API_KEY should return the API key', () => {
      expect(API_KEY()).toBe('test-key');
    });

    it('API_TIMEOUT should return the timeout value', () => {
      expect(API_TIMEOUT()).toBe(25000);
    });

    it('MAX_EMAIL_LENGTH should return the max email length', () => {
      expect(MAX_EMAIL_LENGTH()).toBe(6000);
    });
  });
});
