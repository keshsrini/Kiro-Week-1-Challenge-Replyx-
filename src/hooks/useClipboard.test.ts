import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useClipboard } from './useClipboard';
import * as clipboardService from '../services/clipboardService';

// Mock the clipboard service
vi.mock('../services/clipboardService', () => ({
  copyToClipboard: vi.fn(),
}));

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  /**
   * **Feature: email-response-generator, Property 10: Clipboard success feedback timing**
   * **Validates: Requirements 3.3**
   * 
   * For any successful clipboard operation, the success feedback should be visible 
   * for at least 1.8 seconds and no more than 2.2 seconds.
   */
  it('property: success feedback timing is within acceptable range', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (text) => {
          vi.mocked(clipboardService.copyToClipboard).mockResolvedValue(undefined);

          const { result } = renderHook(() => useClipboard());

          // Copy text
          await act(async () => {
            await result.current.copyToClipboard(text);
          });

          // Should be copied immediately after operation
          expect(result.current.isCopied).toBe(true);
          expect(result.current.error).toBe(null);

          // Test lower bound: should still be true at 1.8 seconds
          act(() => {
            vi.advanceTimersByTime(1800);
          });
          expect(result.current.isCopied).toBe(true);

          // Test upper bound: should be false at 2.2 seconds
          act(() => {
            vi.advanceTimersByTime(400); // Total: 2200ms
          });
          expect(result.current.isCopied).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: success feedback is exactly 2 seconds', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (text) => {
          vi.mocked(clipboardService.copyToClipboard).mockResolvedValue(undefined);

          const { result } = renderHook(() => useClipboard());

          await act(async () => {
            await result.current.copyToClipboard(text);
          });

          expect(result.current.isCopied).toBe(true);

          // Just before 2 seconds
          act(() => {
            vi.advanceTimersByTime(1999);
          });
          expect(result.current.isCopied).toBe(true);

          // At exactly 2 seconds
          act(() => {
            vi.advanceTimersByTime(1);
          });
          expect(result.current.isCopied).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: email-response-generator, Property 11: Clipboard error handling**
   * **Validates: Requirements 3.4**
   * 
   * For any failed clipboard operation, the application should display an error message 
   * and provide an alternative method to access the text.
   */
  it('property: error handling displays error message on failure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        async (text, errorMessage) => {
          const error = new Error(errorMessage);
          vi.mocked(clipboardService.copyToClipboard).mockRejectedValue(error);

          const { result } = renderHook(() => useClipboard());

          await act(async () => {
            await result.current.copyToClipboard(text);
          });

          // Should not be marked as copied
          expect(result.current.isCopied).toBe(false);
          
          // Should have error message
          expect(result.current.error).toBeTruthy();
          expect(result.current.error).toBe(errorMessage);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: error state persists and does not auto-clear', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (text) => {
          const error = new Error('Clipboard operation failed');
          vi.mocked(clipboardService.copyToClipboard).mockRejectedValue(error);

          const { result } = renderHook(() => useClipboard());

          await act(async () => {
            await result.current.copyToClipboard(text);
          });

          expect(result.current.error).toBeTruthy();
          expect(result.current.isCopied).toBe(false);

          // Error should persist even after time passes
          act(() => {
            vi.advanceTimersByTime(5000);
          });

          expect(result.current.error).toBeTruthy();
          expect(result.current.isCopied).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: successful copy clears previous errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (text1, text2) => {
          const { result } = renderHook(() => useClipboard());

          // First attempt fails
          vi.mocked(clipboardService.copyToClipboard).mockRejectedValue(
            new Error('First failure')
          );

          await act(async () => {
            await result.current.copyToClipboard(text1);
          });

          expect(result.current.error).toBeTruthy();
          expect(result.current.isCopied).toBe(false);

          // Second attempt succeeds
          vi.mocked(clipboardService.copyToClipboard).mockResolvedValue(undefined);

          await act(async () => {
            await result.current.copyToClipboard(text2);
          });

          // Error should be cleared
          expect(result.current.error).toBe(null);
          expect(result.current.isCopied).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
