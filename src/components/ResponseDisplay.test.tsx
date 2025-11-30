import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponseDisplay from './ResponseDisplay';

describe('ResponseDisplay', () => {
  it('should render loading spinner when isLoading is true', () => {
    render(
      <ResponseDisplay 
        response="" 
        onRegenerate={vi.fn()} 
        isLoading={true} 
      />
    );
    
    expect(screen.getByText('Generating your response...')).toBeInTheDocument();
  });

  it('should render nothing when response is empty and not loading', () => {
    const { container } = render(
      <ResponseDisplay 
        response="" 
        onRegenerate={vi.fn()} 
        isLoading={false} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render response text when response is provided', () => {
    const testResponse = 'This is a test email response';
    
    render(
      <ResponseDisplay 
        response={testResponse} 
        onRegenerate={vi.fn()} 
        isLoading={false} 
      />
    );
    
    expect(screen.getByText('Generated Response')).toBeInTheDocument();
    expect(screen.getByText(testResponse)).toBeInTheDocument();
  });

  it('should render copy button when response is provided', () => {
    render(
      <ResponseDisplay 
        response="Test response" 
        onRegenerate={vi.fn()} 
        isLoading={false} 
      />
    );
    
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('should render regenerate button when response is provided', () => {
    render(
      <ResponseDisplay 
        response="Test response" 
        onRegenerate={vi.fn()} 
        isLoading={false} 
      />
    );
    
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument();
  });

  it('should call onRegenerate when regenerate button is clicked', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    
    render(
      <ResponseDisplay 
        response="Test response" 
        onRegenerate={onRegenerate} 
        isLoading={false} 
      />
    );
    
    const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
    await user.click(regenerateButton);
    
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it('should preserve line breaks in response text', () => {
    const multiLineResponse = 'Line 1\nLine 2\nLine 3';
    
    render(
      <ResponseDisplay 
        response={multiLineResponse} 
        onRegenerate={vi.fn()} 
        isLoading={false} 
      />
    );
    
    // Use a more flexible matcher for multiline text
    const responseText = screen.getByText((content, element) => {
      return element?.tagName === 'PRE' && content.includes('Line 1') && content.includes('Line 2') && content.includes('Line 3');
    });
    expect(responseText).toBeInTheDocument();
    expect(responseText.tagName).toBe('PRE');
  });
});
