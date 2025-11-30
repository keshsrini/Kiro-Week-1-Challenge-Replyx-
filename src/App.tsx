import { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { EmailInputForm } from './components/EmailInputForm';
import { ResponseCard } from './components/ResponseCard';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ErrorMessage } from './components/ErrorMessage';
import { Mail } from 'lucide-react';
import { generateEmailResponse } from './utils/claudeApi';

interface GeneratedResponse {
  text: string;
  tone: string;
}

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<GeneratedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState({ 
    userName: '', 
    senderName: '', 
    email: '', 
    tone: '', 
    context: '' 
  });

  const handleGenerate = async (
    userName: string,
    senderName: string,
    email: string,
    tone: string,
    context: string
  ) => {
    setIsGenerating(true);
    setGeneratedResponse(null);
    setError(null);
    setLastInput({ userName, senderName, email, tone, context });
    
    try {
      // Call Claude API to generate response
      const response = await generateEmailResponse({
        userName,
        senderName,
        receivedEmail: email,
        tone,
        additionalContext: context,
      });

      setGeneratedResponse({ text: response, tone });
      
      // Smooth scroll to response
      setTimeout(() => {
        const responseElement = document.getElementById('response-section');
        responseElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred. Please try again.'
      );
      
      // Scroll to error
      setTimeout(() => {
        const errorElement = document.getElementById('response-section');
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate(
      lastInput.userName,
      lastInput.senderName,
      lastInput.email,
      lastInput.tone,
      lastInput.context
    );
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 2px)`
        }} />
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(229,9,20,0.03)_0%,transparent_70%)] animate-float blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(41,98,255,0.02)_0%,transparent_70%)] animate-float blur-3xl" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Container */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Input Form */}
            <EmailInputForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            {/* Loading State */}
            {isGenerating && (
              <div id="response-section">
                <LoadingAnimation />
              </div>
            )}

            {/* Error Message */}
            {error && !isGenerating && (
              <div id="response-section">
                <ErrorMessage message={error} onClose={handleCloseError} />
              </div>
            )}

            {/* Generated Response */}
            {generatedResponse && !isGenerating && !error && (
              <div id="response-section">
                <ResponseCard
                  response={generatedResponse.text}
                  tone={generatedResponse.tone}
                  onRegenerate={handleRegenerate}
                />
              </div>
            )}

            {/* Features Grid */}
            {!generatedResponse && !isGenerating && !error && (
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                {[
                  {
                    icon: 'Zap',
                    title: 'Lightning Fast',
                    description: 'AI generates responses in seconds',
                    delay: '0.6s'
                  },
                  {
                    icon: 'Target',
                    title: 'Tone Perfect',
                    description: 'Match any communication style',
                    delay: '0.7s'
                  },
                  {
                    icon: 'Brain',
                    title: 'Claude AI Powered',
                    description: 'Advanced AI understanding',
                    delay: '0.8s'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="glass-card rounded-lg p-6 text-center hover:border-[rgba(229,9,20,0.3)] transition-all duration-300 group cursor-pointer scale-in hover-lift hover-glow"
                    style={{ animationDelay: feature.delay }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(229,9,20,0.1)] border-2 border-[#E50914] flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] transition-all duration-500 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                      {feature.icon === 'Zap' && (
                        <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {feature.icon === 'Target' && (
                        <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={2} />
                          <circle cx="12" cy="12" r="6" strokeWidth={2} />
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                      )}
                      {feature.icon === 'Brain' && (
                        <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-white mb-2 group-hover:text-[#E50914] transition-colors duration-300">{feature.title}</h4>
                    <p className="text-[#808080] group-hover:text-[#B3B3B3] transition-colors duration-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.05)] py-8 mt-20 hover:border-[rgba(229,9,20,0.2)] transition-all duration-300">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 group cursor-pointer">
              <Mail className="w-5 h-5 text-[#E50914] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[#B3B3B3] group-hover:text-white transition-colors duration-300">Replyx</span>
            </div>
            <p className="text-[#808080]">Powered by Claude AI • Crafted with Kiro • Built by Keshav</p>
          </div>
        </footer>
      </div>
    </div>
  );
}