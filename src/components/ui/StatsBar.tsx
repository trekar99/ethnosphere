import { useAppStore } from '../../store';
import { getItemsByCategory } from '../../data/ethnoData';
import { useMemo } from 'react';
import { MapPin } from 'lucide-react';

export function StatsBar() {
  const { currentMode } = useAppStore();
  
  const items = useMemo(() => getItemsByCategory(currentMode), [currentMode]);
  
  const accentColor = currentMode === 'instruments' ? '#00a8ff' : '#6366f1';

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: accentColor }} strokeWidth={1.5} />
          <span className="text-soft-white">{items.length}</span>
          <span className="text-muted">locations</span>
        </div>
      </div>
    </div>
  );
}
