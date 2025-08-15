import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
}

export default function AudioPlayer({ 
  src, 
  autoplay = true, 
  loop = true, 
  volume = 0.8 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = currentVolume;
    
    if (autoplay) {
      // Try to play automatically, but handle if browser blocks it
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser blocked autoplay, user will need to click to start
          setIsPlaying(false);
        });
      }
    }
  }, [autoplay, currentVolume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = currentVolume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio && !isMuted) {
      audio.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center space-x-3">
        <audio
          ref={audioRef}
          src={src}
          loop={loop}
          preload="auto"
          data-testid="audio-element"
        />
        
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="p-2"
          data-testid="button-toggle-play"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="p-2"
          data-testid="button-toggle-mute"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={currentVolume}
          onChange={handleVolumeChange}
          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          data-testid="slider-volume"
        />
        
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0">
          Background Music
        </span>
      </div>
    </div>
  );
}