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
            href="https://github.com/trekar99"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          onClick={() => setShowInfo(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative w-full max-w-md"
            style={{
              background: 'rgba(10, 10, 14, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-5 right-5 p-2 text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={18} />
            </button>
            
            {/* Content */}
            <div style={{ padding: '40px' }}>
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
                  <Globe2 className="text-[#00d4ff]" size={26} />
                  <h2 style={{ fontSize: '24px', fontWeight: 500, color: 'white' }}>
                    <span style={{ color: '#00d4ff' }}>Ethno</span>Sphere
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                  Interactive 3D World Music Atlas
                </p>
              </div>
              
              {/* Description */}
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(255,255,255,0.55)', 
                lineHeight: 1.7,
                marginBottom: '32px',
              }}>
                Explore traditional musical instruments from around the world through an interactive 3D globe. 
                Discover the rich diversity of global music cultures.
              </p>
              
              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ fontSize: '18px' }}>🎵</span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>
                      85+ Instruments
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      From Koto to Bodhrán, across every continent
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ fontSize: '18px' }}>🔊</span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>
                      Live Audio
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      Authentic sounds via Freesound API
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ fontSize: '18px' }}>🌍</span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>
                      Interactive Globe
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      Drag to rotate, scroll to zoom
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div style={{ 
                paddingTop: '20px', 
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                  React • Three.js • TypeScript • Tailwind
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
