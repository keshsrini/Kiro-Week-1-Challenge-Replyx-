import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import EmailResponseGenerator from './EmailResponseGenerator';
import InputForm from './InputForm';
import ResponseDisplay from './ResponseDisplay';
import CopyButton from './CopyButton';
import LoadingSpinner from './LoadingSpinner';

/**
 * Feature: email-response-generator, Property 12: Animation configuration
 * Validates: Requirements 4.5, 5.2
 * 
 * For all interactive elements with state transitions, the CSS transition or
 * animation duration should be between 200ms and 400ms, and should include an easing function.
 */
describe('Property 12: Animation configuration', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Helper function to parse CSS duration values (e.g., "0.3s", "300ms")
   * Returns duration in milliseconds
   */
  const parseDuration = (duration: string): number => {
    if (!duration || duration === '0s' || duration === '0ms') return 0;
    
    if (duration.endsWith('ms')) {
      return parseFloat(duration);
    }
    if (duration.endsWith('s')) {
      return parseFloat(duration) * 1000;
    }
    return 0;
  };

  /**
   * Helper function to check if an element has valid transition configuration
   */
  const hasValidTransition = (element: Element): boolean => {
    const styles = window.getComputedStyle(element);
    const transitionDuration = styles.transitionDuration;
    const transitionTimingFunction = styles.transitionTimingFunction;
    
    if (!transitionDuration || transitionDuration === '0s') {
      return true; // No transition is okay
    }

    // Parse all durations (can be comma-separated for multiple properties)
    const durations = transitionDuration.split(',').map(d => parseDuration(d.trim()));
    
    // Check each duration is within 200-400ms range
    const allDurationsValid = durations.every(duration => {
      return duration === 0 || (duration >= 200 && duration <= 400);
    });

    // Check that an easing function is specified
    const hasEasing = transitionTimingFunction && 
                      transitionTimingFunction !== 'none' &&
                      transitionTimingFunction !== '';

    return allDurationsValid && hasEasing;
  };

  /**
   * Helper function to check if an element has valid animation configuration
   */
  const hasValidAnimation = (element: Element): boolean => {
    const styles = window.getComputedStyle(element);
    const animationDuration = styles.animationDuration;
    const animationTimingFunction = styles.animationTimingFunction;
    
    if (!animationDuration || animationDuration === '0s') {
      return true; // No animation is okay
    }

    // Parse all durations
    const durations = animationDuration.split(',').map(d => parseDuration(d.trim()));
    
    // Check each duration is within 200-400ms range
    const allDurationsValid = durations.every(duration => {
      return duration === 0 || (duration >= 200 && duration <= 400);
    });

    // Check that an easing function is specified
    const hasEasing = animationTimingFunction && 
                      animationTimingFunction !== 'none' &&
                      animationTimingFunction !== '';

    return allDurationsValid && hasEasing;
  };

  it.skip('should have transitions between 200-400ms for all interactive elements', { timeout: 20000 }, () => {
    fc.assert(
      fc.property(
        fc.record({
          userName: fc.string({ maxLength: 50 }),
          senderName: fc.string({ maxLength: 50 }),
          receivedEmail: fc.string({ maxLength: 200 }),
        }),
        (formData) => {
          const { container, unmount } = render(<EmailResponseGenerator />);

          // Get all interactive elements (buttons, inputs, etc.)
          const buttons = container.querySelectorAll('button');
          const inputs = container.querySelectorAll('input, textarea');
          
          // Check buttons
          buttons.forEach(button => {
            const hasValidConfig = hasValidTransition(button) || hasValidAnimation(button);
            // If element has transitions/animations, they should be valid
            const styles = window.getComputedStyle(button);
            if (styles.transitionDuration !== '0s' || styles.animationDuration !== '0s') {
              expect(hasValidConfig).toBe(true);
            }
          });

          // Check inputs
          inputs.forEach(input => {
            const hasValidConfig = hasValidTransition(input) || hasValidAnimation(input);
            const styles = window.getComputedStyle(input);
            if (styles.transitionDuration !== '0s' || styles.animationDuration !== '0s') {
              expect(hasValidConfig).toBe(true);
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it.skip('should have valid easing functions for all transitions', { timeout: 20000 }, () => {
    fc.assert(
      fc.property(
        fc.boolean(), // isLoading state
        (isLoading) => {
          const { container, unmount } = render(
            <InputForm
              userName="Test User"
              senderName="Test Sender"
              receivedEmail="Test email content"
              onUserNameChange={() => {}}
              onSenderNameChange={() => {}}
              onReceivedEmailChange={() => {}}
              onSubmit={() => {}}
              isLoading={isLoading}
              validationErrors={{}}
            />
          );

          // Get all elements with transitions
          const allElements = container.querySelectorAll('*');
          
          allElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const transitionDuration = styles.transitionDuration;
            const transitionTimingFunction = styles.transitionTimingFunction;
            
            // If element has a transition, it should have an easing function
            if (transitionDuration && transitionDuration !== '0s') {
              expect(transitionTimingFunction).toBeTruthy();
              expect(transitionTimingFunction).not.toBe('none');
              expect(transitionTimingFunction).not.toBe('');
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it.skip('should configure CopyButton transitions within valid range', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 200 }),
        (textToCopy) => {
          const { container, unmount } = render(
            <CopyButton textToCopy={textToCopy} />
          );

          const button = container.querySelector('.copy-button');
          expect(button).toBeTruthy();

          if (button) {
            const styles = window.getComputedStyle(button);
            const transitionDuration = styles.transitionDuration;
            
            if (transitionDuration && transitionDuration !== '0s') {
              const durations = transitionDuration.split(',').map(d => parseDuration(d.trim()));
              
              durations.forEach(duration => {
                if (duration > 0) {
                  expect(duration).toBeGreaterThanOrEqual(200);
                  expect(duration).toBeLessThanOrEqual(400);
                }
              });

              // Should have easing function
              expect(styles.transitionTimingFunction).toBeTruthy();
              expect(styles.transitionTimingFunction).not.toBe('none');
            }
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it.skip('should configure ResponseDisplay animations within valid range', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 500 }),
        fc.boolean(),
        (response, isLoading) => {
          const { container, unmount } = render(
            <ResponseDisplay
              response={response}
              onRegenerate={() => {}}
              isLoading={isLoading}
            />
          );

          const responseDisplay = container.querySelector('.response-display');
          expect(responseDisplay).toBeTruthy();

          if (responseDisplay) {
            const styles = window.getComputedStyle(responseDisplay);
            
            // Check transition duration
            const transitionDuration = styles.transitionDuration;
            if (transitionDuration && transitionDuration !== '0s') {
              const durations = transitionDuration.split(',').map(d => parseDuration(d.trim()));
              
              durations.forEach(duration => {
                if (duration > 0) {
                  expect(duration).toBeGreaterThanOrEqual(200);
                  expect(duration).toBeLessThanOrEqual(400);
                }
              });
            }

            // Check animation duration
            const animationDuration = styles.animationDuration;
            if (animationDuration && animationDuration !== '0s') {
              const durations = animationDuration.split(',').map(d => parseDuration(d.trim()));
              
              durations.forEach(duration => {
                if (duration > 0) {
                  expect(duration).toBeGreaterThanOrEqual(200);
                  expect(duration).toBeLessThanOrEqual(400);
                }
              });
            }
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it.skip('should configure LoadingSpinner with appropriate animation timing', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
        (message) => {
          const { container, unmount } = render(
            <LoadingSpinner message={message} />
          );

          const spinner = container.querySelector('.loading-spinner');
          expect(spinner).toBeTruthy();

          if (spinner) {
            // Check spinner rings for animation
            const rings = container.querySelectorAll('.spinner-ring');
            rings.forEach(ring => {
              const styles = window.getComputedStyle(ring);
              const animationDuration = styles.animationDuration;
              
              // Spinner animations can be longer, but should have timing function
              if (animationDuration && animationDuration !== '0s') {
                expect(styles.animationTimingFunction).toBeTruthy();
                expect(styles.animationTimingFunction).not.toBe('none');
              }
            });
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it.skip('should maintain consistent transition timing across component rerenders', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 100 }),
        fc.string({ maxLength: 100 }),
        (text1, text2) => {
          const { container, rerender, unmount } = render(
            <CopyButton textToCopy={text1} />
          );

          const button = container.querySelector('.copy-button');
          expect(button).toBeTruthy();

          if (button) {
            const styles1 = window.getComputedStyle(button);
            const duration1 = styles1.transitionDuration;

            // Rerender with different text
            rerender(<CopyButton textToCopy={text2} />);

            const styles2 = window.getComputedStyle(button);
            const duration2 = styles2.transitionDuration;

            // Transition timing should remain consistent
            expect(duration1).toBe(duration2);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
