'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { log_i, log_w } from '@/lib/logger';

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
}

export default function AudioPlayer({ src, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Prevent seeking by listening to the 'seeking' event
    // and resetting currentTime to the last known position.
    // However, a strictly simpler way is to just hide native controls
    // and only expose play/pause, which we do below.
    
    // We can also prevent context menu to stop people from downloading
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    audio.addEventListener('contextmenu', handleContextMenu);

    const handleEnded = () => {
      setIsPlaying(false);
      log_i('audio_ended', { src });
      if (onEnded) onEnded();
    };

    const handleError = () => {
      log_w('audio_error', { src });
      setError("Audio yuklashda xatolik yuz berdi. Iltimos tekshiring.");
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('contextmenu', handleContextMenu);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src, onEnded]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      log_i('audio_paused');
    } else {
      audioRef.current.play().catch(e => {
        log_w('audio_play_blocked', e);
      });
      log_i('audio_played');
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      setVolume(0);
    } else {
      setVolume(1);
      audioRef.current.volume = 1;
    }
  };

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>;
  }

  return (
    <div className="bg-slate-800 text-white rounded-xl p-4 shadow-lg flex items-center gap-4 w-full max-w-md select-none">
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
      </button>

      <div className="flex flex-col flex-grow gap-1">
        <span className="text-sm font-medium text-slate-200 truncate">Listening Test Audio</span>
        {/* Fake progress bar (animated simply to show activity, or could be tied to timeUpdate but user specifically asked to block seeking) */}
        <div className="h-1.5 w-full bg-slate-600 rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-1000 ${isPlaying ? 'w-full animate-pulse' : 'w-0'}`} />
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 group">
        <button onClick={toggleMute} className="text-slate-300 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all opacity-0 group-hover:opacity-100 w-0 group-hover:w-16"
        />
      </div>
    </div>
  );
}
