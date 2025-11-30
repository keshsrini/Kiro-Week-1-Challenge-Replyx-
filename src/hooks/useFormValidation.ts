import { useState, useCallback } from 'react';
import type { ValidationErrors, UseFormValidationReturn } from '../types';

/**
 * Custom hook for form validation
 * Validates required fields and manages validation error state
 */
export function useFormValidation(
  userName: string,
  senderName: string,
  receivedEmail: string
): UseFormValidationReturn {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  /**
   * Validates all form fields
   * Returns true if all fields are valid, false otherwise
   */
  const validate = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Validate userName - required field
    if (!userName || userName.trim() === '') {
      errors.userName = 'Please enter your name';
    }

    // Validate senderName - required field
    if (!senderName || senderName.trim() === '') {
      errors.senderName = 'Please enter the sender\'s name';
    }

    // Validate receivedEmail - required field
    if (!receivedEmail || receivedEmail.trim() === '') {
      errors.receivedEmail = 'Please enter the received email content';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [userName, senderName, receivedEmail]);

  /**
   * Clears validation error for a specific field
   */
  const clearError = useCallback((field: keyof ValidationErrors): void => {
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    validationErrors,
    validate,
    clearError,
  };
}
