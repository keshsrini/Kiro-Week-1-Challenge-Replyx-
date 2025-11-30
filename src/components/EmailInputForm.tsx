import { useState } from 'react';
import { Send, Sparkles, User, Mail, Briefcase, Heart, Crown, Coffee } from 'lucide-react';

interface EmailInputFormProps {
  onGenerate: (userName: string, senderName: string, email: string, tone: string, context: string) => void;
  isGenerating: boolean;
}

export function EmailInputForm({ onGenerate, isGenerating }: EmailInputFormProps) {
  const [userName, setUserName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [tone, setTone] = useState('professional');
  const [context, setContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && senderName.trim() && email.trim()) {
      onGenerate(userName, senderName, email, tone, context);
    }
  };

  const tones = [
    { value: 'professional', label: 'Professional', icon: Briefcase },
    { value: 'friendly', label: 'Friendly', icon: Heart },
    { value: 'formal', label: 'Formal', icon: Crown },
    { value: 'casual', label: 'Casual', icon: Coffee },
  ];

  return (
    <div className="glass-card rounded-lg p-8 scanline slide-up hover-lift hover-glow" style={{ animationDelay: '0.2s' }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid md:grid-cols-2 gap-4 slide-in-left stagger-3">
          {/* User Name */}
          <div className="space-y-2">
            <label htmlFor="userName" className="block text-[#B3B3B3] flex items-center gap-2">
              <User className="w-4 h-4 text-[#E50914]" />
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[rgba(229,9,20,0.2)] transition-all duration-300 hover:border-[rgba(229,9,20,0.3)] focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
              required
            />
          </div>

          {/* Sender Name */}
          <div className="space-y-2">
            <label htmlFor="senderName" className="block text-[#B3B3B3] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#E50914]" />
              Sender's Name
            </label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[rgba(229,9,20,0.2)] transition-all duration-300 hover:border-[rgba(229,9,20,0.3)] focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
              required
            />
          </div>
        </div>

        {/* Original Email Input */}
        <div className="space-y-2 slide-in-left stagger-3">
          <label htmlFor="email" className="block text-[#B3B3B3]">
            Received Email Content
          </label>
          <textarea
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Paste the email you received that you want to respond to..."
            rows={6}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[rgba(229,9,20,0.2)] transition-all duration-300 resize-none hover:border-[rgba(229,9,20,0.3)] focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
            required
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2 slide-in-right stagger-4">
          <label className="block text-[#B3B3B3]">
            Response Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tones.map((toneOption, index) => {
              const IconComponent = toneOption.icon;
              return (
                <button
                  key={toneOption.value}
                  type="button"
                  onClick={() => setTone(toneOption.value)}
                  className={`px-4 py-3 rounded border transition-all duration-300 scale-in hover:scale-105 flex items-center justify-center gap-2 ${
                    tone === toneOption.value
                      ? 'bg-[#E50914] border-[#E50914] text-white glow-red'
                      : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#B3B3B3] hover:border-[#E50914] hover:text-white hover:shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                  }`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{toneOption.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Context */}
        <div className="space-y-2 slide-in-left stagger-5">
          <label htmlFor="context" className="block text-[#B3B3B3]">
            Additional Context <span className="text-[#808080]">(Optional)</span>
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Any specific points you want to address, mention, or include in the response..."
            rows={3}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[rgba(229,9,20,0.2)] transition-all duration-300 resize-none hover:border-[rgba(229,9,20,0.3)] focus:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !userName.trim() || !senderName.trim() || !email.trim()}
          className="w-full netflix-button rounded px-8 py-4 flex items-center justify-center gap-3 glow-red disabled:opacity-50 disabled:cursor-not-allowed slide-in-right stagger-6 overflow-hidden relative group"
        >
          {isGenerating && (
            <div className="absolute inset-0 shimmer" />
          )}
          <span className="relative z-10 flex items-center gap-3">
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Response...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                Generate Response with AI
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}