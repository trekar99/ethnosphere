import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { useState, useEffect, useRef } from 'react';
import { getRandomSound, playSound, stopSound, setVolume, type FreesoundResult } from '../../services/freesound';

export function DetailsPanel() {
  const { selectedItem } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSound, setCurrentSound] = useState<FreesoundResult | null>(null);
  const [volume, setVolumeState] = useState(0.6);
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
      // Fetch a random sound from Freesound
      const sound = await getRandomSound(selectedItem.soundQuery);
      
      if (sound) {
        setCurrentSound(sound);
        const audio = playSound(sound.previews['preview-hq-mp3']);
        audioRef.current = audio;
        audio.volume = volume;
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
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

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  if (!selectedItem) return null;

  const accentColor = '#00a8ff';

  return (
    <div className="fixed left-6 bottom-6 z-10 w-[320px]">
      {/* Category label */}
      <div className="mb-3 flex items-center gap-2">
        <span 
          className="text-[10px] font-mono uppercase tracking-[0.2em]"
          style={{ color: accentColor }}
        >
          ◆ Instrument
        </span>
      </div>

      {/* Main card */}
      <div className="glass-panel p-5">
        {/* Location */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-soft-white tracking-tight">
            {selectedItem.country}
          </h2>
          <p className="text-sm text-muted uppercase tracking-wide">
            {selectedItem.region}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-4" />

        {/* Instrument info */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-soft-white mb-1">
              {selectedItem.name}
            </h3>
            {currentSound && (
              <p className="text-xs text-muted truncate max-w-[180px]">
                Sound by {currentSound.username}
              </p>
            )}
          </div>
          
          {/* Play button */}
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 30px ${accentColor}40`
            }}
          >
            {isLoading ? (
              <Loader2 size={24} className="text-white animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} className="text-white" strokeWidth={2.5} />
            ) : (
              <Play size={24} className="text-white ml-1" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Volume slider */}
        <div className="mt-5 flex items-center gap-3">
          <Volume2 size={16} className="text-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
