/**
 * Property-based tests for Claude API Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  generateEmailResponse,
  generatePrompt,
  ApiError,
} from './claudeApiService';

describe('Claude API Service - Property Tests', () => {
  // Store original fetch and env
  const originalFetch = global.fetch;
  const originalEnv = import.meta.env.VITE_ANTHROPIC_API_KEY;

  beforeEach(() => {
    // Set up API key for tests
    import.meta.env.VITE_ANTHROPIC_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Restore original fetch and env
    global.fetch = originalFetch;
    import.meta.env.VITE_ANTHROPIC_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  /**
   * Feature: email-response-generator, Property 5: API request data integrity
   * Validates: Requirements 2.1, 2.5
   *
   * For any valid form inputs (userName, senderName, receivedEmail),
   * when a generation or regeneration request is made,
   * the API request should contain exactly those input values without modification.
   */
  it('Property 5: API request data integrity - request contains unmodified input values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        async (userName, senderName, receivedEmail) => {
          let capturedRequestBody: any = null;

          // Mock fetch to capture the request
          global.fetch = vi.fn().mockImplementation(async (_url, options) => {
            capturedRequestBody = JSON.parse(options?.body as string);
            return {
              ok: true,
              json: async () => ({
                content: [{ type: 'text', text: 'Mock response' }],
              }),
            };
          });

          await generateEmailResponse({ userName, senderName, receivedEmail });

          // Verify the request body contains the exact input values
          expect(capturedRequestBody).toBeDefined();
          expect(capturedRequestBody.messages).toBeDefined();
          expect(capturedRequestBody.messages.length).toBe(1);

          const promptContent = capturedRequestBody.messages[0].content;

          // The prompt should contain the exact userName, senderName, and receivedEmail
          expect(promptContent).toContain(userName);
          expect(promptContent).toContain(senderName);
          expect(promptContent).toContain(receivedEmail);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: email-response-generator, Property 16: API prompt context inclusion
   * Validates: Requirements 8.3
   *
   * For any generation request, the prompt sent to Claude API should include
   * both the user's name and sender's name as context for generating the response.
   */
  it('Property 16: API prompt context inclusion - prompt includes userName and senderName', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        async (userName, senderName, receivedEmail) => {
          // Generate the prompt directly
          const prompt = generatePrompt(userName, senderName, receivedEmail);

          // Verify both names are included in the prompt
          expect(prompt).toContain(userName);
          expect(prompt).toContain(senderName);

          // Verify the prompt structure mentions helping the user
          expect(prompt.toLowerCase()).toContain('helping');

          // Verify sender is labeled
          expect(prompt).toContain('Sender:');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: email-response-generator, Property 14: Generation error messaging
   * Validates: Requirements 7.1
   *
   * For any error during a generation request, the application should display
   * an error message that describes the specific error type.
   */
  it('Property 14: Generation error messaging - errors have specific descriptive messages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        fc.constantFrom(
          { status: 401, expectedType: 'auth', expectedMessage: 'authentication' },
          { status: 403, expectedType: 'auth', expectedMessage: 'authentication' },
          { status: 429, expectedType: 'rate_limit', expectedMessage: 'too many requests' },
          { status: 500, expectedType: 'server', expectedMessage: 'temporarily unavailable' },
          { status: 503, expectedType: 'server', expectedMessage: 'temporarily unavailable' }
        ),
        async (userName, senderName, receivedEmail, errorConfig) => {
          // Mock fetch to return error status
          global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: errorConfig.status,
            json: async () => ({}),
          });

          try {
            await generateEmailResponse({ userName, senderName, receivedEmail });
            // Should not reach here
            expect.fail('Expected an error to be thrown');
          } catch (error) {
            // Verify it's an ApiError with the correct type
            expect(error).toBeInstanceOf(ApiError);
            const apiError = error as ApiError;
            expect(apiError.type).toBe(errorConfig.expectedType);

            // Verify the message is descriptive and contains expected keywords
            expect(apiError.message.toLowerCase()).toContain(
              errorConfig.expectedMessage
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional test for network errors
  it('Property 14: Generation error messaging - network errors are descriptive', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        async (userName, senderName, receivedEmail) => {
          // Mock fetch to throw network error
          global.fetch = vi.fn().mockRejectedValue(new TypeError('Network error'));

          try {
            await generateEmailResponse({ userName, senderName, receivedEmail });
            expect.fail('Expected an error to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            const apiError = error as ApiError;
            expect(apiError.type).toBe('network');
            expect(apiError.message.toLowerCase()).toContain('connect');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional test for timeout errors
  it('Property 14: Generation error messaging - timeout errors are descriptive', async () => {
    // Set a very short timeout for testing
    import.meta.env.VITE_API_TIMEOUT = '10';

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // userName (non-whitespace)
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), // senderName (non-whitespace)
        fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0), // receivedEmail (non-whitespace)
        async (userName, senderName, receivedEmail) => {
          // Mock fetch to properly handle abort signal and timeout
          global.fetch = vi.fn().mockImplementation(
            (_url, options) =>
              new Promise((resolve, reject) => {
                // Listen for abort signal
                const signal = options?.signal as AbortSignal;
                if (signal) {
                  signal.addEventListener('abort', () => {
                    const abortError = new Error('The operation was aborted');
                    abortError.name = 'AbortError';
                    reject(abortError);
                  });
                }

                // Simulate a long-running request
                setTimeout(() => {
                  resolve({
                    ok: true,
                    json: async () => ({
                      content: [{ type: 'text', text: 'Response' }],
                    }),
                  });
                }, 100);
              })
          );

          try {
            await generateEmailResponse({ userName, senderName, receivedEmail });
            expect.fail('Expected an error to be thrown');
          } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            const apiError = error as ApiError;
            expect(apiError.type).toBe('timeout');
            expect(apiError.message.toLowerCase()).toMatch(/time.*out/);
          }
        }
      ),
      { numRuns: 50 } // Fewer runs since this involves delays
    );

    // Reset timeout
    import.meta.env.VITE_API_TIMEOUT = '30000';
  });
});
