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
    <div className="fixed left-8 bottom-8 z-10">
      <div 
        className="w-[320px] rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10, 10, 14, 0.9)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Accent bar */}
        <div 
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}30, transparent)` }}
        />
        
        {/* Content */}
        <div className="p-6">
          
          {/* Region tag */}
          <span 
            className="inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.12em] font-medium mb-5"
            style={{ 
              backgroundColor: `${accentColor}12`,
              color: `${accentColor}cc`,
            }}
          >
            {selectedItem.region}
          </span>
          
          {/* Name */}
          <h2 className="text-[22px] font-normal text-white mb-1.5 leading-snug">
            {selectedItem.name}
          </h2>
          
          {/* Country */}
          <p className="text-sm text-white/40 mb-5">
            {selectedItem.country}
          </p>
          
          {/* Description */}
          {selectedItem.description && (
            <p className="text-[13px] text-white/30 leading-relaxed mb-6">
              {selectedItem.description}
            </p>
          )}
          
          {/* Divider */}
          <div className="h-px w-full bg-white/5 mb-5" />
          
          {/* Play button */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="flex items-center gap-4 group w-full"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0"
              style={{ 
                backgroundColor: isPlaying ? accentColor : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isPlaying ? `0 0 24px ${accentColor}40` : 'none',
                border: isPlaying ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="text-white animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white/40 group-hover:text-white/80 ml-0.5 transition-colors" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Listen'}
              </span>
              {currentSound && (
                <span className="text-[11px] text-white/25">
                  by {currentSound.username}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
