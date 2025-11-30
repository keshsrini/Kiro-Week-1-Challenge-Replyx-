/**
 * useEmailGenerator Hook
 * Manages email generation state and API interaction
 */

import { useState, useCallback } from 'react';
import { generateEmailResponse } from '../services/claudeApiService';
import type { UseEmailGeneratorReturn, ResponseTone } from '../types';

export const useEmailGenerator = (
  userName: string,
  senderName: string,
  receivedEmail: string,
  tone: ResponseTone
): UseEmailGeneratorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const generateResponse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const generatedResponse = await generateEmailResponse({
        userName,
        senderName,
        receivedEmail,
        tone,
      });
      setResponse(generatedResponse);
    } catch (err) {
      // Handle error and set user-friendly message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userName, senderName, receivedEmail, tone]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateResponse,
    isLoading,
    error,
    response,
    clearError,
  };
};
