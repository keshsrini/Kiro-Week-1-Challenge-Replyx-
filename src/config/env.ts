/**
 * Environment Configuration
 * Validates and exports environment variables with type safety
 */

export interface EnvConfig {
  apiKey: string;
  apiTimeout: number;
  maxEmailLength: number;
}

/**
 * Validates that all required environment variables are present and valid
 * @throws Error if validation fails
 */
export const validateEnv = (): EnvConfig => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT;
  const maxEmailLength = import.meta.env.VITE_MAX_EMAIL_LENGTH;

  // Validate API key
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY is not configured. Please set your API key in the .env file.'
    );
  }

  // Validate and parse API timeout
  let parsedTimeout = parseInt(apiTimeout || '30000', 10);
  if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
    console.warn('VITE_API_TIMEOUT is invalid. Using default: 30000ms');
    parsedTimeout = 30000;
  }

  // Validate and parse max email length
  let parsedMaxLength = parseInt(maxEmailLength || '5000', 10);
  if (isNaN(parsedMaxLength) || parsedMaxLength <= 0) {
    console.warn('VITE_MAX_EMAIL_LENGTH is invalid. Using default: 5000');
    parsedMaxLength = 5000;
  }

  return {
    apiKey: apiKey.trim(),
    apiTimeout: parsedTimeout,
    maxEmailLength: parsedMaxLength,
  };
};

/**
 * Configuration constants
 * Exported after validation
 * 
 * Note: Config is re-validated on each call to support testing scenarios
 * where environment variables may change. In production, this has minimal
 * overhead as the validation is simple.
 */
export const getConfig = (): EnvConfig => {
  return validateEnv();
};

// Export individual constants for convenience
export const API_KEY = () => getConfig().apiKey;
export const API_TIMEOUT = () => getConfig().apiTimeout;
export const MAX_EMAIL_LENGTH = () => getConfig().maxEmailLength;
