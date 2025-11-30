/**
 * Claude API Service
 * Handles communication with the Anthropic Claude API for email response generation
 */

import { API_KEY, API_TIMEOUT } from '../config/env';

type ResponseTone = 'professional' | 'friendly' | 'formal' | 'casual';

interface EmailGenerationParams {
  userName: string;
  senderName: string;
  receivedEmail: string;
  tone: ResponseTone;
}

interface ClaudeApiRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: "user";
    content: string;
  }>;
}

interface ClaudeApiResponse {
  id: string;
  type: "message";
  role: "assistant";
  content: Array<{
    type: "text";
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Generates a prompt for Claude API that includes user context and tone preference
 */
export const generatePrompt = (
  userName: string,
  senderName: string,
  receivedEmail: string,
  tone: ResponseTone
): string => {
  const toneDescriptions = {
    professional: 'professional and business-appropriate',
    friendly: 'warm, friendly, and approachable',
    formal: 'formal, respectful, and highly professional',
    casual: 'casual, relaxed, and conversational'
  };

  const toneDescription = toneDescriptions[tone];

  return `You are helping ${userName} write an email response.

Sender: ${senderName}
Received Email:
${receivedEmail}

Please generate a ${toneDescription} email response. The response should:
- Address the key points from the received email
- Maintain a ${toneDescription} tone throughout
- Be concise and well-structured
- Include an appropriate greeting and closing that matches the ${tone} tone
- Be signed by ${userName}

Generate only the email response text, without any additional commentary.`;
};

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  public type: 'network' | 'auth' | 'rate_limit' | 'timeout' | 'server' | 'unknown';
  
  constructor(
    message: string,
    type: 'network' | 'auth' | 'rate_limit' | 'timeout' | 'server' | 'unknown'
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
  }
}

/**
 * Generates an email response using Claude API
 */
export const generateEmailResponse = async (
  params: EmailGenerationParams
): Promise<string> => {
  const apiKey = API_KEY();
  const timeout = API_TIMEOUT();

  const prompt = generatePrompt(
    params.userName,
    params.senderName,
    params.receivedEmail,
    params.tone
  );

  const requestBody: ClaudeApiRequest = {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different HTTP status codes
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new ApiError(
          'API authentication failed. Please check your API key configuration.',
          'auth'
        );
      }

      if (response.status === 429) {
        throw new ApiError(
          'Too many requests. Please wait a moment and try again.',
          'rate_limit'
        );
      }

      if (response.status >= 500) {
        throw new ApiError(
          'Service temporarily unavailable. Please try again in a few moments.',
          'server'
        );
      }

      throw new ApiError(
        `API request failed with status ${response.status}`,
        'unknown'
      );
    }

    const data: ClaudeApiResponse = await response.json();

    // Extract the text from the response
    if (data.content && data.content.length > 0 && data.content[0].text) {
      return data.content[0].text;
    }

    throw new ApiError('Invalid response format from API', 'unknown');
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 'timeout');
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        'Unable to connect. Please check your internet connection and try again.',
        'network'
      );
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unknown errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      'unknown'
    );
  }
};

export const claudeApiService = {
  generateEmailResponse,
};
