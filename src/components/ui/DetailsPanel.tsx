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
    // Stop sound when instrument changes
    stopSound();
    setIsPlaying(false);
    setCurrentSound(null);
  }, [selectedItem]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

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
      <div 
        className="w-80 rounded-xl"
        style={{ 
          background: 'rgba(8, 8, 12, 0.94)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-white">
            {selectedItem.name}
          </h2>
          
          <p className="text-sm text-white/50 mt-1.5">
            {selectedItem.country}
          </p>
          
          {selectedItem.description && (
            <p className="text-[13px] text-white/40 mt-4 leading-relaxed">
              {selectedItem.description}
            </p>
          )}
        </div>
        
        {/* Player */}
        <div 
          className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-white/5 rounded-b-xl"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          onClick={handlePlayPause}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {isLoading ? (
              <Loader2 size={16} className="text-black animate-spin" />
            ) : isPlaying ? (
              <Pause size={16} className="text-black" />
            ) : (
              <Play size={16} className="text-black ml-0.5" />
            )}
          </div>
          
          <div>
            <p className="text-sm text-white/80 font-medium">
              {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Play Sample'}
            </p>
            <p className="text-xs text-white/35">
              {currentSound ? `by ${currentSound.username}` : 'via Freesound'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
