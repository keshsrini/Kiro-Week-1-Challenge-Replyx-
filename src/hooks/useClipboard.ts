import { useState, useCallback, useRef, useEffect } from 'react';
import { copyToClipboard as copyToClipboardService } from '../services/clipboardService';

export interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
}

/**
 * Custom hook for clipboard operations with state management
 * Provides success feedback with 2-second timer and error handling
 */
export function useClipboard(): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset states
    setError(null);
    setIsCopied(false);

    try {
      await copyToClipboardService(text);
      setIsCopied(true);

      // Set success feedback timer for 2 seconds
      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
      setError(errorMessage);
      setIsCopied(false);
    }
  }, []);

  return {
    copyToClipboard,
    isCopied,
    error,
  };
}
