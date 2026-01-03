import { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  useEffect(() => {
    const texts = [
      'Initializing',
      'Loading textures',
      'Mapping coordinates',
      'Rendering globe',
      'Almost ready'
    ];
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #00a8ff 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Globe outline animation */}
      <div className="relative w-24 h-24 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00a8ff"
            strokeWidth="0.5"
            opacity="0.3"
          />
          {/* Animated progress ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00a8ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
          {/* Latitude lines */}
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#00a8ff" strokeWidth="0.3" opacity="0.4" />
          <ellipse cx="50" cy="50" rx="45" ry="35" fill="none" stroke="#00a8ff" strokeWidth="0.3" opacity="0.3" />
          {/* Longitude lines */}
          <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="#00a8ff" strokeWidth="0.3" opacity="0.4" />
          <ellipse cx="50" cy="50" rx="35" ry="45" fill="none" stroke="#00a8ff" strokeWidth="0.3" opacity="0.3" />
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="#00a8ff" opacity="0.8">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-light tracking-[0.3em] mb-2">
        <span className="text-[#00a8ff]">ETHNO</span>
        <span className="text-white/90">SPHERE</span>
      </h1>

      {/* Loading text */}
      <p className="text-white/40 text-xs tracking-widest uppercase mb-6">
        {loadingText}
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#00a8ff] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-3 text-white/30 text-[10px] font-mono">
        {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
