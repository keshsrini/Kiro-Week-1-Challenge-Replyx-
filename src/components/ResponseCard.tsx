import { useState } from 'react';
import { Copy, Check, RotateCcw, Lightbulb } from 'lucide-react';

interface ResponseCardProps {
  response: string;
  tone: string;
  onRegenerate: () => void;
}

export function ResponseCard({ response, tone, onRegenerate }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-lg p-8 scanline scale-in hover-lift hover-glow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(255,255,255,0.1)] slide-in-left">
        <div>
          <h3 className="text-white mb-1">Generated Response</h3>
          <p className="text-[#808080]">
            Tone: <span className="text-[#E50914] capitalize">{tone}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#B3B3B3] hover:border-[#E50914] hover:text-white transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(229,9,20,0.2)] group"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            Regenerate
          </button>
          
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
              copied 
                ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'netflix-button glow-red'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Content */}
      <div className="bg-[#141414] rounded-lg p-6 border border-[rgba(255,255,255,0.05)] slide-in-right hover:border-[rgba(255,255,255,0.1)] transition-all duration-300">
        <div className="text-[#B3B3B3] whitespace-pre-wrap leading-relaxed">
          {response}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-[rgba(229,9,20,0.05)] border border-[rgba(229,9,20,0.2)] rounded slide-up hover:bg-[rgba(229,9,20,0.08)] hover:border-[rgba(229,9,20,0.3)] transition-all duration-300 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#E50914] flex-shrink-0 mt-0.5" />
        <p className="text-[#B3B3B3]">
          <span className="text-white">Pro Tip:</span> Review and personalize the response before sending
        </p>
      </div>
    </div>
  );
}