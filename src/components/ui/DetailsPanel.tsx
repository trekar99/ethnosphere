import { Play, Pause, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { useState, useEffect, useRef } from 'react';
import { getRandomSound, playSound, stopSound, type FreesoundResult } from '../../services/freesound';

export function DetailsPanel() {
  const { selectedItem, currentMode } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSound, setCurrentSound] = useState<FreesoundResult | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentSound(null);
    stopSound();
  }, [selectedItem]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopSound();
      setIsPlaying(false);
      return;
    }

    if (!selectedItem?.soundQuery) return;

    setIsLoading(true);
    try {
      const sound = await getRandomSound(selectedItem.soundQuery);
      
      if (sound) {
        setCurrentSound(sound);
        const audio = playSound(sound.previews['preview-hq-mp3']);
        audioRef.current = audio;
        audio.volume = 0.7;
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
        };
        audio.onplay = () => {
          setIsLoading(false);
          setIsPlaying(true);
        };
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsLoading(false);
    }
  };

  if (!selectedItem) return null;

  const accentColor = currentMode === 'instruments' ? '#00d4ff' : '#a78bfa';

  return (
    <div className="fixed left-6 bottom-6 z-10">
      <div className="w-[340px] bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header with name */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-[22px] font-semibold text-white">
            {selectedItem.name}
          </h2>
          <p className="text-[15px] text-white/50 mt-1">
            {selectedItem.country}
          </p>
        </div>
        
        {/* Description */}
        {selectedItem.description && (
          <div className="px-6 pb-5">
            <p className="text-[13px] text-white/40 leading-[1.6]">
              {selectedItem.description}
            </p>
          </div>
        )}
        
        {/* Player bar */}
        <div 
          className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          onClick={handlePlayPause}
        >
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {isLoading ? (
              <Loader2 size={18} className="text-black animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} className="text-black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-white/90 font-medium">
              {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Play Sample'}
            </p>
            <p className="text-[12px] text-white/40 truncate">
              {currentSound ? `by ${currentSound.username}` : 'via Freesound'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
