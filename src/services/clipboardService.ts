/**
 * Clipboard service for copying text to the system clipboard
 */

export interface ClipboardService {
  copyToClipboard(text: string): Promise<void>;
  isClipboardSupported(): boolean;
}

/**
 * Check if the Clipboard API is supported in the current browser
 */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

/**
 * Copy text to the clipboard using the Clipboard API
 * Falls back to legacy methods if the Clipboard API is not available
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Try modern Clipboard API first
  if (isClipboardSupported()) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // If Clipboard API fails, fall through to legacy method
      console.warn('Clipboard API failed, trying fallback method:', error);
    }
  }

  // Fallback method using execCommand (deprecated but widely supported)
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback method for copying text using the deprecated execCommand
 */
function fallbackCopyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea invisible but still selectable
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('Copy command was unsuccessful'));
      }
    } catch (error) {
      document.body.removeChild(textArea);
      reject(error);
    }
  });
}
