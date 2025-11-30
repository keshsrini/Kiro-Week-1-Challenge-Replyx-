/**
 * Property-Based Tests for useEmailGenerator Hook
 * Feature: email-response-generator
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useEmailGenerator } from './useEmailGenerator';
import * as claudeApiService from '../services/claudeApiService';

describe('useEmailGenerator - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Feature: email-response-generator, Property 7: Loading state during generation
   * Validates: Requirements 2.3
   * 
   * For any generation request, while the request is in progress,
   * the application should display a loading indicator and the generate button should be disabled.
   */
  it('Property 7: Loading state during generation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        async (userName, senderName, receivedEmail) => {
          // Mock the API to delay response so we can check loading state
          let resolvePromise: (value: string) => void;
          const delayedPromise = new Promise<string>((resolve) => {
            resolvePromise = resolve;
          });

          const generateSpy = vi
            .spyOn(claudeApiService, 'generateEmailResponse')
            .mockReturnValue(delayedPromise);

          const { result } = renderHook(() =>
            useEmailGenerator(userName, senderName, receivedEmail)
          );

          // Initially not loading
          expect(result.current.isLoading).toBe(false);

          // Start generation
          let generatePromise: Promise<void>;
          await act(async () => {
            generatePromise = result.current.generateResponse();
          });

          // Should be loading during the request
          expect(result.current.isLoading).toBe(true);

          // Resolve the API call
          await act(async () => {
            resolvePromise!('Generated response');
            await generatePromise!;
          });

          // Should not be loading after completion
          expect(result.current.isLoading).toBe(false);

          generateSpy.mockRestore();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Increase timeout for 100 runs

  /**
   * Feature: email-response-generator, Property 8: Error handling with retry
   * Validates: Requirements 2.4
   * 
   * For any API error response, the application should display an error message
   * and the generate button should remain enabled to allow retry.
   */
  it('Property 8: Error handling with retry', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        fc.string({ minLength: 1, maxLength: 200 }), // error message
        async (userName, senderName, receivedEmail, errorMessage) => {
          // Mock the API to reject with an error
          const apiError = new Error(errorMessage);
          const generateSpy = vi
            .spyOn(claudeApiService, 'generateEmailResponse')
            .mockRejectedValue(apiError);

          const { result } = renderHook(() =>
            useEmailGenerator(userName, senderName, receivedEmail)
          );

          // Initially no error
          expect(result.current.error).toBe(null);
          expect(result.current.isLoading).toBe(false);

          // Attempt generation (should fail)
          await act(async () => {
            await result.current.generateResponse();
          });

          // Should have error message
          expect(result.current.error).toBe(errorMessage);
          
          // Should not be loading (so button can be clicked again for retry)
          expect(result.current.isLoading).toBe(false);

          // Now mock a successful response for retry
          generateSpy.mockResolvedValue('Success response');

          // Retry should work
          await act(async () => {
            await result.current.generateResponse();
          });

          // Error should be cleared and response should be set
          expect(result.current.error).toBe(null);
          expect(result.current.response).toBe('Success response');
          expect(result.current.isLoading).toBe(false);

          generateSpy.mockRestore();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Increase timeout for 100 runs

  /**
   * Feature: email-response-generator, Property 6: Response display
   * Validates: Requirements 2.2
   * 
   * For any non-empty response from Claude API, the application should display
   * the response text in the ResponseDisplay component.
   */
  it('Property 6: Response display', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // userName
        fc.string({ minLength: 1, maxLength: 100 }), // senderName
        fc.string({ minLength: 1, maxLength: 1000 }), // receivedEmail
        fc.string({ minLength: 1, maxLength: 2000 }), // generated response
        async (userName, senderName, receivedEmail, generatedResponse) => {
          // Mock the API to return a response
          const generateSpy = vi
            .spyOn(claudeApiService, 'generateEmailResponse')
            .mockResolvedValue(generatedResponse);

          const { result } = renderHook(() =>
            useEmailGenerator(userName, senderName, receivedEmail)
          );

          // Initially no response
          expect(result.current.response).toBe('');

          // Generate response
          await act(async () => {
            await result.current.generateResponse();
          });

          // Should have the generated response
          expect(result.current.response).toBe(generatedResponse);
          expect(result.current.error).toBe(null);
          expect(result.current.isLoading).toBe(false);

          generateSpy.mockRestore();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // Increase timeout for 100 runs
});
