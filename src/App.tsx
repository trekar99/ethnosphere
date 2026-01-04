import { Suspense } from 'react';
import { Scene } from './components/3d';
import { Header, Footer } from './components/ui/Header';
import { ModeToggle } from './components/ui/ModeToggle';
import { DetailsPanel } from './components/ui/DetailsPanel';
import { EditModal } from './components/ui/EditModal';
import { StatsBar } from './components/ui/StatsBar';
import { useAppStore } from './store';
import './App.css';

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Subtle glow */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #00a8ff 0%, transparent 70%)' }}
      />
      
      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-8">
          <div 
            className="absolute inset-0 rounded-full border-2 border-white/5"
          />
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00a8ff] animate-spin"
            style={{ animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#00a8ff] animate-pulse" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-xl font-light tracking-[0.3em] mb-2">
          <span className="text-[#00a8ff]">ETHNO</span>
          <span className="text-white/80">SPHERE</span>
        </h1>
        
        {/* Loading text */}
        <p className="text-white/30 text-xs tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}

function App() {
  const { isGlobeLoaded } = useAppStore();

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Loading Overlay */}
      {!isGlobeLoaded && <LoadingOverlay />}

      {/* 3D Globe Scene */}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      {/* UI Overlay */}
      <Header />

      {/* Mode Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-10">
        <ModeToggle />
      </div>

      {/* Details Panel - Bottom Left */}
      <DetailsPanel />

      {/* Edit Modal */}
      <EditModal />

      {/* Stats Bar */}
      <StatsBar />

      {/* Footer */}
      <Footer />

      {/* Minimal instructions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-[10px] text-muted/50 font-mono tracking-wider text-center uppercase">
          Drag to rotate • Scroll to zoom • Click markers
        </p>
      </div>
    </div>
  );
}

export default App;
