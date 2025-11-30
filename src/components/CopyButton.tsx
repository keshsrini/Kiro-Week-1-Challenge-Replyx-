import React from 'react';
import { useClipboard } from '../hooks/useClipboard';
import type { CopyButtonProps } from '../types';
import './CopyButton.css';

const CopyButton: React.FC<CopyButtonProps> = ({ 
  textToCopy, 
  onCopySuccess, 
  onCopyError 
}) => {
  const { copyToClipboard, isCopied, error } = useClipboard();

  const handleCopy = async () => {
    try {
      await copyToClipboard(textToCopy);
      if (onCopySuccess) {
        onCopySuccess();
      }
    } catch (err) {
      if (onCopyError && err instanceof Error) {
        onCopyError(err);
      }
    }
  };

  return (
    <button
      className={`copy-button ${isCopied ? 'copy-button--success' : ''} ${error ? 'copy-button--error' : ''}`}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
      type="button"
    >
      <span className="copy-button__icon">
        {isCopied ? (
          // Checkmark icon for success
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M16.6667 5L7.50004 14.1667L3.33337 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : error ? (
          // Error icon
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              d="M10 6V10M10 14H10.01" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Copy icon (default)
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M13.3333 10.75V14.0833C13.3333 15.2339 12.4006 16.1667 11.25 16.1667H5.91667C4.76607 16.1667 3.83333 15.2339 3.83333 14.0833V8.75C3.83333 7.59939 4.76607 6.66667 5.91667 6.66667H9.25" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            <path 
              d="M16.1667 3.83333V11.1667C16.1667 12.3173 15.2339 13.25 14.0833 13.25H11.25C10.0994 13.25 9.16667 12.3173 9.16667 11.1667V3.83333C9.16667 2.68274 10.0994 1.75 11.25 1.75H14.0833C15.2339 1.75 16.1667 2.68274 16.1667 3.83333Z" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
          </svg>
        )}
      </span>
      <span className="copy-button__text">
        {isCopied ? 'Copied!' : error ? 'Failed' : 'Copy'}
      </span>
      {error && (
        <span className="sr-only" role="alert">
          {error}
        </span>
      )}
    </button>
  );
};

export default CopyButton;
