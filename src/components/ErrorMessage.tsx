import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <div className="glass-card rounded-lg p-6 border-2 border-[#E50914] bg-[rgba(229,9,20,0.05)] scale-in">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#E50914] flex-shrink-0 animate-pulse-glow" />
        
        <div className="flex-1">
          <h4 className="text-white mb-1">Error Generating Response</h4>
          <p className="text-[#B3B3B3]">{message}</p>
        </div>
        
        <button
          onClick={onClose}
          className="text-[#B3B3B3] hover:text-white transition-colors duration-300 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
