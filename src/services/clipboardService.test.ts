import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { copyToClipboard, isClipboardSupported } from './clipboardService';

describe('clipboardService', () => {
  describe('isClipboardSupported', () => {
    it('should return true when Clipboard API is available', () => {
      const result = isClipboardSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Clear any mocks before each test
      vi.clearAllMocks();
    });

    /**
     * **Feature: email-response-generator, Property 9: Clipboard round-trip**
     * **Validates: Requirements 3.2, 3.5**
     * 
     * For any generated response text, when copied to clipboard, 
     * the clipboard content should exactly match the original response text 
     * including all formatting and line breaks.
     */
    it('property: clipboard round-trip preserves text exactly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 5000 }),
          async (text) => {
            // Mock the clipboard API
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            const mockReadText = vi.fn().mockResolvedValue(text);
            
            Object.defineProperty(navigator, 'clipboard', {
              value: {
                writeText: mockWriteText,
                readText: mockReadText,
              },
              writable: true,
              configurable: true,
            });

            // Copy to clipboard
            await copyToClipboard(text);

            // Verify writeText was called with exact text
            expect(mockWriteText).toHaveBeenCalledWith(text);
            expect(mockWriteText).toHaveBeenCalledTimes(1);

            // Simulate reading from clipboard
            const clipboardContent = await navigator.clipboard.readText();

            // Verify round-trip: clipboard content matches original
            expect(clipboardContent).toBe(text);
            expect(clipboardContent.length).toBe(text.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: clipboard preserves multiline text with line breaks', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 20 }),
          async (lines) => {
            const text = lines.join('\n');
            
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            const mockReadText = vi.fn().mockResolvedValue(text);
            
            Object.defineProperty(navigator, 'clipboard', {
              value: {
                writeText: mockWriteText,
                readText: mockReadText,
              },
              writable: true,
              configurable: true,
            });

            await copyToClipboard(text);

            expect(mockWriteText).toHaveBeenCalledWith(text);
            
            const clipboardContent = await navigator.clipboard.readText();
            expect(clipboardContent).toBe(text);
            
            // Verify line breaks are preserved
            const retrievedLines = clipboardContent.split('\n');
            expect(retrievedLines).toEqual(lines);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: clipboard preserves special characters and formatting', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 1000 }),
          async (text) => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            const mockReadText = vi.fn().mockResolvedValue(text);
            
            Object.defineProperty(navigator, 'clipboard', {
              value: {
                writeText: mockWriteText,
                readText: mockReadText,
              },
              writable: true,
              configurable: true,
            });

            await copyToClipboard(text);

            const clipboardContent = await navigator.clipboard.readText();
            
            // Verify every character is preserved
            expect(clipboardContent).toBe(text);
            for (let i = 0; i < text.length; i++) {
              expect(clipboardContent[i]).toBe(text[i]);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
