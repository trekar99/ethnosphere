import { Music, Radio } from 'lucide-react';

export function ModeToggle() {
  const accentColor = '#00a8ff';

  return (
    <div className="flex gap-2 items-center">
      {/* Active Instruments mode */}
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
        style={{ 
          backgroundColor: `${accentColor}15`,
          color: accentColor,
          border: `1px solid ${accentColor}25`
        }}
      >
        <Music size={14} strokeWidth={1.5} />
        <span className="hidden sm:inline">Instruments</span>
      </button>

      {/* Disabled Radio mode */}
      <button
        disabled
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white/25 cursor-not-allowed"
      >
        <Radio size={14} strokeWidth={1.5} />
        <span className="hidden sm:inline">Radio</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 ml-1">
          2026
        </span>
      </button>
    </div>
  );
}
