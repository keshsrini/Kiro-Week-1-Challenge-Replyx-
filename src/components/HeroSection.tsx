export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle,rgba(229,9,20,0.15)_0%,transparent_70%)] animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(229,9,20,0.08)_0%,transparent_70%)] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(41,98,255,0.05)_0%,transparent_70%)] animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#E50914] bg-[rgba(229,9,20,0.1)] scale-in hover:scale-110 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all duration-300 cursor-pointer">
          <span className="text-[#E50914]">AI-Powered Response Generator</span>
        </div>
        
        <h1 className="text-glow mb-6 flicker-subtle slide-up stagger-1">
          <span className="gradient-text animate-gradient">Replyx</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-[#B3B3B3] text-xl mb-8 slide-up stagger-2">
          Craft perfect email responses instantly with AI. Professional, personalized, and powerful.
        </p>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />
    </div>
  );
}