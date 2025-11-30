import React from 'react';
import CopyButton from './CopyButton';
import LoadingSpinner from './LoadingSpinner';
import type { ResponseDisplayProps } from '../types';
import './ResponseDisplay.css';

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ 
  response, 
  onRegenerate, 
  isLoading 
}) => {
  // Show loading spinner during generation
  if (isLoading) {
    return (
      <div className="response-display response-display--loading">
        <LoadingSpinner message="Generating your response..." />
      </div>
    );
  }

  // Don't render anything if there's no response
  if (!response) {
    return null;
  }

  return (
    <div className="response-display fade-in" role="region" aria-label="Generated email response">
      <div className="response-display__header">
        <h2 className="response-display__title" id="response-title">Generated Response</h2>
        <div className="response-display__actions" role="group" aria-label="Response actions">
          <CopyButton textToCopy={response} />
          <button
            className="regenerate-button"
            onClick={onRegenerate}
            aria-label="Regenerate email response with same inputs"
            type="button"
          >
            <span className="regenerate-button__icon">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C12.0711 2.5 13.9461 3.35714 15.3033 4.75" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M15 2.5V5C15 5.27614 14.7761 5.5 14.5 5.5H12" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="regenerate-button__text">Regenerate</span>
          </button>
        </div>
      </div>
      
      <div className="response-display__content" tabIndex={0} aria-labelledby="response-title">
        <pre className="response-display__text">{response}</pre>
      </div>
    </div>
  );
};

export default ResponseDisplay;
