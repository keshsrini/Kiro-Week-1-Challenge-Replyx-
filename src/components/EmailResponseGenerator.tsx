import React, { useState, useCallback } from 'react';
import { useEmailGenerator } from '../hooks/useEmailGenerator';
import { useFormValidation } from '../hooks/useFormValidation';
import InputForm from './InputForm';
import ResponseDisplay from './ResponseDisplay';
import type { ResponseTone } from '../types';
import './EmailResponseGenerator.css';

/**
 * EmailResponseGenerator Component
 * Main container component that orchestrates the email response generation flow
 * Integrates form validation, API interaction, and response display
 */
const EmailResponseGenerator: React.FC = () => {
  // Form state management
  const [userName, setUserName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receivedEmail, setReceivedEmail] = useState('');
  const [tone, setTone] = useState<ResponseTone>('professional');

  // Custom hooks for business logic
  const { generateResponse, isLoading, error, response, clearError } = useEmailGenerator(
    userName,
    senderName,
    receivedEmail,
    tone
  );

  const { validationErrors, validate, clearError: clearValidationError } = useFormValidation(
    userName,
    senderName,
    receivedEmail
  );

  // Handle input changes with validation error clearing
  const handleUserNameChange = useCallback((value: string) => {
    setUserName(value);
    if (validationErrors.userName) {
      clearValidationError('userName');
    }
  }, [validationErrors.userName, clearValidationError]);

  const handleSenderNameChange = useCallback((value: string) => {
    setSenderName(value);
    if (validationErrors.senderName) {
      clearValidationError('senderName');
    }
  }, [validationErrors.senderName, clearValidationError]);

  const handleReceivedEmailChange = useCallback((value: string) => {
    setReceivedEmail(value);
    if (validationErrors.receivedEmail) {
      clearValidationError('receivedEmail');
    }
  }, [validationErrors.receivedEmail, clearValidationError]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Clear any previous API errors
    if (error) {
      clearError();
    }

    // Validate form inputs
    const isValid = validate();
    if (!isValid) {
      return;
    }

    // Generate response
    await generateResponse();
  }, [validate, generateResponse, error, clearError]);

  // Handle regenerate action
  const handleRegenerate = useCallback(async () => {
    // Clear any previous errors
    if (error) {
      clearError();
    }

    // Regenerate with same inputs (no validation needed as inputs haven't changed)
    await generateResponse();
  }, [generateResponse, error, clearError]);

  return (
    <div className="email-response-generator">
      {/* ARIA live region for status announcements */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {isLoading && 'Generating email response, please wait...'}
        {!isLoading && response && 'Email response generated successfully'}
        {error && `Error: ${error}`}
      </div>

      <div className="email-response-generator__container">
        {/* Display API errors */}
        {error && (
          <div className="email-response-generator__error" role="alert" aria-live="assertive">
            <div className="error-message">
              <span className="error-message__icon" aria-hidden="true">⚠️</span>
              <span className="error-message__text">{error}</span>
              <button
                className="error-message__close"
                onClick={clearError}
                aria-label="Dismiss error message"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <InputForm
          userName={userName}
          senderName={senderName}
          receivedEmail={receivedEmail}
          tone={tone}
          onUserNameChange={handleUserNameChange}
          onSenderNameChange={handleSenderNameChange}
          onReceivedEmailChange={handleReceivedEmailChange}
          onToneChange={setTone}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          validationErrors={validationErrors}
        />

        {/* Response Display */}
        <ResponseDisplay
          response={response}
          onRegenerate={handleRegenerate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EmailResponseGenerator;
