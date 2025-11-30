import React from 'react';
import type { InputFormProps, ResponseTone } from '../types';
import LoadingSpinner from './LoadingSpinner';
import './InputForm.css';

const getToneIcon = (tone: ResponseTone): string => {
  const icons = {
    professional: '💼',
    friendly: '😊',
    formal: '🎩',
    casual: '👋'
  };
  return icons[tone];
};

const InputForm: React.FC<InputFormProps> = ({
  userName,
  senderName,
  receivedEmail,
  tone,
  onUserNameChange,
  onSenderNameChange,
  onReceivedEmailChange,
  onToneChange,
  onSubmit,
  isLoading,
  validationErrors,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form 
      className="input-form glass-card" 
      onSubmit={handleSubmit}
      aria-label="Email response generation form"
      noValidate
    >
      <h2 className="input-form__title glow-red" id="form-title">Generate Email Response</h2>
      
      {/* User Name Field */}
      <div className="input-form__field">
        <label htmlFor="userName" className="input-form__label">
          Your Name <span aria-label="required">*</span>
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          className={`input-form__input glass-input ${validationErrors.userName ? 'input-form__input--error' : ''}`}
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          placeholder="Enter your name"
          aria-invalid={!!validationErrors.userName}
          aria-describedby={validationErrors.userName ? 'userName-error' : undefined}
          aria-required="true"
          autoComplete="name"
        />
        {validationErrors.userName && (
          <p id="userName-error" className="input-form__error" role="alert" aria-live="polite">
            {validationErrors.userName}
          </p>
        )}
      </div>

      {/* Sender Name Field */}
      <div className="input-form__field">
        <label htmlFor="senderName" className="input-form__label">
          Sender's Name <span aria-label="required">*</span>
        </label>
        <input
          id="senderName"
          name="senderName"
          type="text"
          className={`input-form__input glass-input ${validationErrors.senderName ? 'input-form__input--error' : ''}`}
          value={senderName}
          onChange={(e) => onSenderNameChange(e.target.value)}
          placeholder="Enter sender's name"
          aria-invalid={!!validationErrors.senderName}
          aria-describedby={validationErrors.senderName ? 'senderName-error' : undefined}
          aria-required="true"
          autoComplete="off"
        />
        {validationErrors.senderName && (
          <p id="senderName-error" className="input-form__error" role="alert" aria-live="polite">
            {validationErrors.senderName}
          </p>
        )}
      </div>

      {/* Received Email Field */}
      <div className="input-form__field">
        <label htmlFor="receivedEmail" className="input-form__label">
          Received Email <span aria-label="required">*</span>
        </label>
        <textarea
          id="receivedEmail"
          name="receivedEmail"
          className={`input-form__textarea glass-input ${validationErrors.receivedEmail ? 'input-form__input--error' : ''}`}
          value={receivedEmail}
          onChange={(e) => onReceivedEmailChange(e.target.value)}
          placeholder="Paste the email you received here..."
          rows={8}
          aria-invalid={!!validationErrors.receivedEmail}
          aria-describedby={validationErrors.receivedEmail ? 'receivedEmail-error receivedEmail-help' : 'receivedEmail-help'}
          aria-required="true"
        />
        <span id="receivedEmail-help" className="sr-only">
          Enter the complete email content you received that you want to respond to
        </span>
        {validationErrors.receivedEmail && (
          <p id="receivedEmail-error" className="input-form__error" role="alert" aria-live="polite">
            {validationErrors.receivedEmail}
          </p>
        )}
      </div>

      {/* Response Tone Selector */}
      <div className="input-form__field">
        <label htmlFor="tone" className="input-form__label">
          Response Tone
        </label>
        <div className="tone-selector" role="radiogroup" aria-labelledby="tone">
          {(['professional', 'friendly', 'formal', 'casual'] as ResponseTone[]).map((toneOption) => (
            <button
              key={toneOption}
              type="button"
              className={`tone-selector__option ${tone === toneOption ? 'tone-selector__option--active' : ''}`}
              onClick={() => onToneChange(toneOption)}
              role="radio"
              aria-checked={tone === toneOption}
              aria-label={`${toneOption} tone`}
            >
              <span className="tone-selector__icon">{getToneIcon(toneOption)}</span>
              <span className="tone-selector__label">{toneOption}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="input-form__submit btn-primary"
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? 'Generating email response, please wait' : 'Generate email response'}
      >
        {isLoading ? (
          <span className="input-form__submit-loading">
            <LoadingSpinner />
            <span aria-hidden="true">Generating...</span>
          </span>
        ) : (
          'Generate Response'
        )}
      </button>
    </form>
  );
};

export default InputForm;
