import { Music, Radio } from 'lucide-react';

export function ModeToggle() {
  const accentColor = '#00a8ff';

  return (
    <div className="flex gap-2">
      {/* Active Instruments mode */}
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium tracking-wide"
        style={{ 
          backgroundColor: `${accentColor}20`,
          color: accentColor,
          border: `1px solid ${accentColor}30`
        }}
      >
        <Music size={15} strokeWidth={1.5} />
        <span className="hidden sm:inline">Instruments</span>
      </button>

      {/* Disabled Radio mode with Coming Soon */}
      <div className="relative">
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide text-muted/50 bg-white/5 cursor-not-allowed"
        >
          <Radio size={15} strokeWidth={1.5} />
          <span className="hidden sm:inline">Ethno-Radio</span>
        </button>
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30">
          Soon
        </span>
      </div>
    </div>
  );
}
