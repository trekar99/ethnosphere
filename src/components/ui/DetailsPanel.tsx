import { Play, Pause, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { useState, useEffect, useRef } from 'react';
import { getRandomSound, playSound, stopSound, type FreesoundResult } from '../../services/freesound';

export function DetailsPanel() {
  const { selectedItem } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSound, setCurrentSound] = useState<FreesoundResult | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset when item changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentSound(null);
    stopSound();
  }, [selectedItem]);

  // Handle play/pause
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

  const accentColor = '#00a8ff';

  return (
    <div className="fixed left-5 bottom-5 z-10">
      {/* Minimal compact card */}
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-[280px]">
        {/* Location row */}
        <div className="flex items-center gap-2 mb-3">
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs text-muted uppercase tracking-wider">
            {selectedItem.region}
          </span>
        </div>

        {/* Main content */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-white truncate">
              {selectedItem.name}
            </h2>
            <p className="text-sm text-white/50">
              {selectedItem.country}
            </p>
            {currentSound && (
              <p className="text-[10px] text-white/30 mt-1 truncate">
                by {currentSound.username}
              </p>
            )}
          </div>
          
          {/* Play button */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shrink-0"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: isPlaying ? `0 0 20px ${accentColor}60` : 'none'
            }}
          >
            {isLoading ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} className="text-white" strokeWidth={2.5} />
            ) : (
              <Play size={18} className="text-white ml-0.5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
