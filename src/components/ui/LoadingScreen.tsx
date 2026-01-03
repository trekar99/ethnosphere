import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" strokeWidth={1.5} />
        <div className="absolute inset-0 blur-2xl bg-neon-cyan/20 rounded-full" />
      </div>
      <h2 className="mt-8 text-lg font-medium tracking-wider">
        <span className="text-neon-cyan neon-text">ETHNO</span>
        <span className="text-soft-white">SPHERE</span>
      </h2>
      <p className="mt-2 text-muted text-xs font-mono tracking-[0.2em] uppercase">
        Loading...
      </p>
    </div>
  );
}
