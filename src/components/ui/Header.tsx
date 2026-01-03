import { Globe2, Github, Info, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  return (
    <header className="fixed top-6 left-6 z-10">
      <div className="flex items-center gap-3">
        <Globe2 className="text-neon-cyan" size={24} strokeWidth={1.5} />
        <div>
          <h1 className="text-lg font-semibold tracking-wider">
            <span className="text-neon-cyan neon-text">ETHNO</span>
            <span className="text-soft-white">SPHERE</span>
          </h1>
          <p className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">
            World Music Explorer v1.0
          </p>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <footer className="fixed bottom-6 right-6 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowInfo(true)}
            className="p-2 text-muted hover:text-neon-cyan transition-colors duration-300 rounded-lg hover:bg-white/5"
          >
            <Info size={16} strokeWidth={1.5} />
          </button>
          <a 
            href="https://github.com/trekar99/Etnosphere"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted hover:text-neon-cyan transition-colors duration-300 rounded-lg hover:bg-white/5"
          >
            <Github size={16} strokeWidth={1.5} />
          </a>
        </div>
      </footer>

      {/* Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setShowInfo(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12, 12, 16, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div 
              className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, #00a8ff, #00a8ff40, transparent)' }}
            />
            
            {/* Close button */}
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
            
            {/* Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe2 className="text-[#00a8ff]" size={28} />
                <div>
                  <h2 className="text-2xl font-light text-white">
                    <span className="text-[#00a8ff]">Ethno</span>Sphere
                  </h2>
                  <p className="text-xs text-white/40">Interactive 3D World Music Atlas</p>
                </div>
              </div>
              
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Explore traditional musical instruments from around the world through an interactive 3D globe. 
                Discover the rich diversity of global music cultures with just a click.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#00a8ff] text-lg">🎵</span>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">85+ Instruments</h3>
                    <p className="text-xs text-white/40">From Koto to Bodhrán, across every continent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00a8ff] text-lg">🔊</span>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Live Audio</h3>
                    <p className="text-xs text-white/40">Authentic sounds powered by Freesound API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00a8ff] text-lg">🌍</span>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Interactive Globe</h3>
                    <p className="text-xs text-white/40">Drag to rotate, scroll to zoom, click markers</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-[11px] text-white/30">
                  Built with React, Three.js, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
