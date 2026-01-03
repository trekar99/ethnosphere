import { Globe2, Github, Info } from 'lucide-react';

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
  return (
    <footer className="fixed bottom-6 right-6 z-10">
      <div className="flex items-center gap-2">
        <button className="p-2 text-muted hover:text-neon-cyan transition-colors duration-300 rounded-lg hover:bg-white/5">
          <Info size={16} strokeWidth={1.5} />
        </button>
        <button className="p-2 text-muted hover:text-neon-cyan transition-colors duration-300 rounded-lg hover:bg-white/5">
          <Github size={16} strokeWidth={1.5} />
        </button>
      </div>
    </footer>
  );
}
