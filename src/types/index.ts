// Response Tone Options
export type ResponseTone = 'professional' | 'friendly' | 'formal' | 'casual';

// Core Form Data Types
export interface FormData {
  userName: string;      // User's name (1-100 characters)
  senderName: string;    // Sender's name (1-100 characters)
  receivedEmail: string; // Received email content (1-5000 characters)
  tone: ResponseTone;    // Response tone preference
}

// Validation Types
export interface ValidationErrors {
  userName?: string;
  senderName?: string;
  receivedEmail?: string;
}

// Application State
export interface ApplicationState {
  formData: FormData;
  generatedResponse: string;
  uiState: {
    isLoading: boolean;
    error: string | null;
    validationErrors: ValidationErrors;
    isCopied: boolean;
  };
}

// Claude API Types
export interface ClaudeApiRequest {
  model: string;         // e.g., "claude-3-sonnet-20240229"
  max_tokens: number;    // Maximum response length (1024)
  messages: Array<{
    role: "user";
    content: string;
  }>;
}

export interface ClaudeApiResponse {
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

export interface EmailGenerationParams {
  userName: string;
  senderName: string;
  receivedEmail: string;
  tone: ResponseTone;
}

// Component Props Types
export interface InputFormProps {
  userName: string;
  senderName: string;
  receivedEmail: string;
  tone: ResponseTone;
  onUserNameChange: (value: string) => void;
  onSenderNameChange: (value: string) => void;
  onReceivedEmailChange: (value: string) => void;
  onToneChange: (value: ResponseTone) => void;
  onSubmit: () => void;
  isLoading: boolean;
  validationErrors: ValidationErrors;
}

export interface ResponseDisplayProps {
  response: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

export interface LoadingSpinnerProps {
  message?: string;
}

export interface CopyButtonProps {
  textToCopy: string;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}

// Custom Hook Return Types
export interface UseEmailGeneratorReturn {
  generateResponse: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: string;
  clearError: () => void;
}

export interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
}

export interface UseFormValidationReturn {
  validationErrors: ValidationErrors;
  validate: () => boolean;
  clearError: (field: keyof ValidationErrors) => void;
}

// Service Interface Types
export interface ClaudeApiService {
  generateEmailResponse(params: EmailGenerationParams): Promise<string>;
}

export interface ClipboardService {
  copyToClipboard(text: string): Promise<void>;
  isClipboardSupported(): boolean;
}

// Error State Type
export interface ErrorState {
  type: 'validation' | 'api' | 'clipboard' | 'network';
  message: string;
  field?: string; // For validation errors
  retryable: boolean;
  timestamp: number;
}
