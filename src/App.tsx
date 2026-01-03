import { Suspense } from 'react';
import { Scene } from './components/3d';
import { Header, Footer } from './components/ui/Header';
import { ModeToggle } from './components/ui/ModeToggle';
import { DetailsPanel } from './components/ui/DetailsPanel';
import { EditModal } from './components/ui/EditModal';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { StatsBar } from './components/ui/StatsBar';
import './App.css';

function App() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
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
