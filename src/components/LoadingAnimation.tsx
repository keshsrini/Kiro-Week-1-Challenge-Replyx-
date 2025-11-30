export function LoadingAnimation() {
  return (
    <div className="glass-card rounded-lg p-12 scanline scale-in text-center">
      {/* Main Loading Icon */}
      <div className="relative mx-auto w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-[#2A2A2A] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#E50914] rounded-full animate-spin glow-red"></div>
      </div>

      {/* Loading Text */}
      <h3 className="text-white mb-2 text-glow">Generating Your Response</h3>
      <p className="text-[#808080] mb-8">AI is crafting the perfect reply...</p>

      {/* Progress Steps */}
      <div className="space-y-3 max-w-md mx-auto">
        {[
          { label: 'Analyzing email content', delay: '0s' },
          { label: 'Understanding context', delay: '0.5s' },
          { label: 'Crafting response', delay: '1s' }
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] slide-in-left"
            style={{ animationDelay: step.delay }}
          >
            <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse-glow"></div>
            <span className="text-[#B3B3B3]">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}