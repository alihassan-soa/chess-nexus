import { useCallback, useRef, useEffect } from 'react';
import type { Move } from '@/lib/chess/types';

export type SoundType = 'move' | 'capture' | 'check' | 'castle' | 'game-end';

interface UseChessSoundsReturn {
  playSound: (type: SoundType) => void;
  playMoveSound: (move: Move, isCheck: boolean, isGameOver: boolean) => void;
  setEnabled: (enabled: boolean) => void;
}

export function useChessSounds(initialEnabled = true): UseChessSoundsReturn {
  const enabledRef = useRef(initialEnabled);
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  // Preload sounds
  useEffect(() => {
    const sounds: SoundType[] = ['move', 'capture', 'check', 'castle', 'game-end'];
    sounds.forEach((type) => {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.preload = 'auto';
      audio.volume = 0.5;
      audioCache.current.set(type, audio);
    });

    return () => {
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;

    const audio = audioCache.current.get(type);
    if (audio) {
      // Clone to allow overlapping sounds
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5;
      clone.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const playMoveSound = useCallback((move: Move, isCheck: boolean, isGameOver: boolean) => {
    if (!enabledRef.current) return;

    // Priority: game-end > check > castle > capture > move
    if (isGameOver) {
      playSound('game-end');
    } else if (isCheck) {
      playSound('check');
    } else if (move.flags.includes('k') || move.flags.includes('q')) {
      // Castling (kingside 'k' or queenside 'q')
      playSound('castle');
    } else if (move.captured) {
      playSound('capture');
    } else {
      playSound('move');
    }
  }, [playSound]);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return {
    playSound,
    playMoveSound,
    setEnabled,
  };
}
