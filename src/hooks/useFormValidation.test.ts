import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';
import * as fc from 'fast-check';

describe('useFormValidation', () => {
  /**
   * **Feature: email-response-generator, Property 2: Empty field validation**
   * **Validates: Requirements 1.3**
   * 
   * For any combination of empty required fields, when the form is submitted,
   * the application should prevent submission and display validation messages
   * for all empty fields.
   */
  it('Property 2: should validate and show errors for all empty fields', () => {
    fc.assert(
      fc.property(
        // Generate combinations of empty/whitespace strings and non-empty strings
        fc.record({
          userName: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/), // whitespace only
            fc.string({ minLength: 1 })
          ),
          senderName: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/),
            fc.string({ minLength: 1 })
          ),
          receivedEmail: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/),
            fc.string({ minLength: 1 })
          ),
        }),
        ({ userName, senderName, receivedEmail }) => {
          const { result } = renderHook(() =>
            useFormValidation(userName, senderName, receivedEmail)
          );

          // Perform validation
          let isValid: boolean;
          act(() => {
            isValid = result.current.validate();
          });

          // Determine which fields should have errors (empty or whitespace-only)
          const shouldHaveUserNameError = !userName || userName.trim() === '';
          const shouldHaveSenderNameError = !senderName || senderName.trim() === '';
          const shouldHaveReceivedEmailError = !receivedEmail || receivedEmail.trim() === '';

          // Check that validation returns false if any field is empty
          const hasAnyEmptyField = shouldHaveUserNameError || shouldHaveSenderNameError || shouldHaveReceivedEmailError;
          expect(isValid!).toBe(!hasAnyEmptyField);

          // Check that all empty fields have validation errors
          if (shouldHaveUserNameError) {
            expect(result.current.validationErrors.userName).toBeDefined();
            expect(result.current.validationErrors.userName).toBeTruthy();
          } else {
            expect(result.current.validationErrors.userName).toBeUndefined();
          }

          if (shouldHaveSenderNameError) {
            expect(result.current.validationErrors.senderName).toBeDefined();
            expect(result.current.validationErrors.senderName).toBeTruthy();
          } else {
            expect(result.current.validationErrors.senderName).toBeUndefined();
          }

          if (shouldHaveReceivedEmailError) {
            expect(result.current.validationErrors.receivedEmail).toBeDefined();
            expect(result.current.validationErrors.receivedEmail).toBeTruthy();
          } else {
            expect(result.current.validationErrors.receivedEmail).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: email-response-generator, Property 3: Validation error clearing**
   * **Validates: Requirements 1.4**
   * 
   * For any input field with a validation error, when the field value changes
   * from empty to non-empty, the validation error for that field should be removed.
   */
  it('Property 3: should clear validation error when field changes from empty to non-empty', () => {
    fc.assert(
      fc.property(
        // Generate a field name
        fc.constantFrom('userName', 'senderName', 'receivedEmail'),
        (fieldName) => {
          // Start with all empty fields to trigger validation errors
          const { result } = renderHook(
            ({ userName, senderName, receivedEmail }) =>
              useFormValidation(userName, senderName, receivedEmail),
            {
              initialProps: {
                userName: '',
                senderName: '',
                receivedEmail: '',
              },
            }
          );

          // Trigger validation to create errors
          act(() => {
            result.current.validate();
          });

          // Verify all fields have errors initially
          expect(result.current.validationErrors.userName).toBeDefined();
          expect(result.current.validationErrors.senderName).toBeDefined();
          expect(result.current.validationErrors.receivedEmail).toBeDefined();

          // Clear the error for the specific field
          act(() => {
            result.current.clearError(fieldName as keyof typeof result.current.validationErrors);
          });

          // Verify the specific field's error is cleared
          expect(result.current.validationErrors[fieldName as keyof typeof result.current.validationErrors]).toBeUndefined();

          // Verify other fields still have errors
          const otherFields = ['userName', 'senderName', 'receivedEmail'].filter(f => f !== fieldName);
          otherFields.forEach(field => {
            expect(result.current.validationErrors[field as keyof typeof result.current.validationErrors]).toBeDefined();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: email-response-generator, Property 15: Form validation error display**
   * **Validates: Requirements 7.2**
   * 
   * For any invalid form state, all fields that fail validation should be
   * visually highlighted and have associated error messages explaining the
   * validation requirements.
   */
  it('Property 15: should display error messages for all invalid fields', () => {
    fc.assert(
      fc.property(
        // Generate combinations where at least one field is invalid
        fc.record({
          userName: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/),
            fc.string({ minLength: 1 })
          ),
          senderName: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/),
            fc.string({ minLength: 1 })
          ),
          receivedEmail: fc.oneof(
            fc.constant(''),
            fc.stringMatching(/^\s+$/),
            fc.string({ minLength: 1 })
          ),
        }).filter(
          // Ensure at least one field is invalid
          ({ userName, senderName, receivedEmail }) =>
            !userName || userName.trim() === '' ||
            !senderName || senderName.trim() === '' ||
            !receivedEmail || receivedEmail.trim() === ''
        ),
        ({ userName, senderName, receivedEmail }) => {
          const { result } = renderHook(() =>
            useFormValidation(userName, senderName, receivedEmail)
          );

          // Perform validation
          act(() => {
            result.current.validate();
          });

          // Check that each invalid field has an error message
          if (!userName || userName.trim() === '') {
            expect(result.current.validationErrors.userName).toBeDefined();
            expect(typeof result.current.validationErrors.userName).toBe('string');
            expect(result.current.validationErrors.userName!.length).toBeGreaterThan(0);
          }

          if (!senderName || senderName.trim() === '') {
            expect(result.current.validationErrors.senderName).toBeDefined();
            expect(typeof result.current.validationErrors.senderName).toBe('string');
            expect(result.current.validationErrors.senderName!.length).toBeGreaterThan(0);
          }

          if (!receivedEmail || receivedEmail.trim() === '') {
            expect(result.current.validationErrors.receivedEmail).toBeDefined();
            expect(typeof result.current.validationErrors.receivedEmail).toBe('string');
            expect(result.current.validationErrors.receivedEmail!.length).toBeGreaterThan(0);
          }

          // Verify that valid fields don't have errors
          if (userName && userName.trim() !== '') {
            expect(result.current.validationErrors.userName).toBeUndefined();
          }

          if (senderName && senderName.trim() !== '') {
            expect(result.current.validationErrors.senderName).toBeUndefined();
          }

          if (receivedEmail && receivedEmail.trim() !== '') {
            expect(result.current.validationErrors.receivedEmail).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
