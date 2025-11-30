import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailResponseGenerator from './EmailResponseGenerator';
import * as useEmailGeneratorModule from '../hooks/useEmailGenerator';
import * as useFormValidationModule from '../hooks/useFormValidation';

// Mock the hooks
vi.mock('../hooks/useEmailGenerator');
vi.mock('../hooks/useFormValidation');

describe('EmailResponseGenerator', () => {
  const mockGenerateResponse = vi.fn();
  const mockClearError = vi.fn();
  const mockValidate = vi.fn();
  const mockClearValidationError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: false,
      error: null,
      response: '',
      clearError: mockClearError,
    });

    vi.mocked(useFormValidationModule.useFormValidation).mockReturnValue({
      validationErrors: {},
      validate: mockValidate,
      clearError: mockClearValidationError,
    });
  });

  it('renders the input form', () => {
    render(<EmailResponseGenerator />);
    
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sender's name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/received email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate email response/i })).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<EmailResponseGenerator />);
    
    const userNameInput = screen.getByLabelText(/your name/i);
    const senderNameInput = screen.getByLabelText(/sender's name/i);
    const emailInput = screen.getByLabelText(/received email/i);

    fireEvent.change(userNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(senderNameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'Test email content' } });

    expect(userNameInput).toHaveValue('John Doe');
    expect(senderNameInput).toHaveValue('Jane Smith');
    expect(emailInput).toHaveValue('Test email content');
  });

  it('validates form before submission', async () => {
    mockValidate.mockReturnValue(false);

    render(<EmailResponseGenerator />);
    
    const submitButton = screen.getByRole('button', { name: /generate email response/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockValidate).toHaveBeenCalled();
      expect(mockGenerateResponse).not.toHaveBeenCalled();
    });
  });

  it('generates response when form is valid', async () => {
    mockValidate.mockReturnValue(true);
    mockGenerateResponse.mockResolvedValue(undefined);

    render(<EmailResponseGenerator />);
    
    const userNameInput = screen.getByLabelText(/your name/i);
    const senderNameInput = screen.getByLabelText(/sender's name/i);
    const emailInput = screen.getByLabelText(/received email/i);

    fireEvent.change(userNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(senderNameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'Test email' } });

    const submitButton = screen.getByRole('button', { name: /generate email response/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockValidate).toHaveBeenCalled();
      expect(mockGenerateResponse).toHaveBeenCalled();
    });
  });

  it('displays error message when API error occurs', () => {
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: false,
      error: 'API authentication failed',
      response: '',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/API authentication failed/i).length).toBeGreaterThan(0);
  });

  it('clears error when dismiss button is clicked', () => {
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: false,
      error: 'Test error',
      response: '',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    fireEvent.click(dismissButton);

    expect(mockClearError).toHaveBeenCalled();
  });

  it('displays response when available', () => {
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: false,
      error: null,
      response: 'Generated email response',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    expect(screen.getByText(/generated response/i)).toBeInTheDocument();
    expect(screen.getByText(/generated email response/i)).toBeInTheDocument();
  });

  it('shows loading state during generation', () => {
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: true,
      error: null,
      response: '',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    expect(screen.getByText(/generating\.\.\./i)).toBeInTheDocument();
  });

  it('handles regenerate action', async () => {
    mockGenerateResponse.mockResolvedValue(undefined);

    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: false,
      error: null,
      response: 'Generated response',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    const regenerateButton = screen.getByRole('button', { name: /regenerate email response/i });
    fireEvent.click(regenerateButton);

    await waitFor(() => {
      expect(mockGenerateResponse).toHaveBeenCalled();
    });
  });

  it('clears validation errors when input changes', () => {
    vi.mocked(useFormValidationModule.useFormValidation).mockReturnValue({
      validationErrors: { userName: 'Please enter your name' },
      validate: mockValidate,
      clearError: mockClearValidationError,
    });

    render(<EmailResponseGenerator />);
    
    const userNameInput = screen.getByLabelText(/your name/i);
    fireEvent.change(userNameInput, { target: { value: 'John' } });

    expect(mockClearValidationError).toHaveBeenCalledWith('userName');
  });

  it('maintains input values during loading state', () => {
    vi.mocked(useEmailGeneratorModule.useEmailGenerator).mockReturnValue({
      generateResponse: mockGenerateResponse,
      isLoading: true,
      error: null,
      response: '',
      clearError: mockClearError,
    });

    render(<EmailResponseGenerator />);
    
    const userNameInput = screen.getByLabelText(/your name/i) as HTMLInputElement;
    const senderNameInput = screen.getByLabelText(/sender's name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/received email/i) as HTMLTextAreaElement;

    fireEvent.change(userNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(senderNameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'Test email' } });

    // Values should persist even during loading
    expect(userNameInput.value).toBe('John Doe');
    expect(senderNameInput.value).toBe('Jane Smith');
    expect(emailInput.value).toBe('Test email');
  });
});
