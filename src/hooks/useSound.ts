'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'palabritas_sound';

// Audio context singleton
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Generate a simple tone
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
  try {
    const ctx = getAudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade out to avoid clicking
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
}

export function useSound() {
  const [enabled, setEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
    setIsLoaded(true);
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled, isLoaded]);

  // Toggle sound on/off
  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  // Sound: correct key press (short high beep)
  const playKeyCorrect = useCallback(() => {
    if (!enabled) return;
    playTone(880, 0.08, 'sine', 0.2); // A5, very short
  }, [enabled]);

  // Sound: wrong key press (low buzz)
  const playKeyWrong = useCallback(() => {
    if (!enabled) return;
    playTone(200, 0.15, 'square', 0.15); // Low, slightly longer
  }, [enabled]);

  // Sound: word complete (happy ascending tones)
  const playWordComplete = useCallback(() => {
    if (!enabled) return;

    // Play 3 ascending tones
    setTimeout(() => playTone(523, 0.12, 'sine', 0.25), 0);    // C5
    setTimeout(() => playTone(659, 0.12, 'sine', 0.25), 100);  // E5
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);    // G5 (longer)
  }, [enabled]);

  // Sound: level complete (fanfare)
  const playLevelComplete = useCallback(() => {
    if (!enabled) return;

    // Play celebratory sequence
    setTimeout(() => playTone(523, 0.1, 'sine', 0.25), 0);     // C5
    setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80);    // E5
    setTimeout(() => playTone(784, 0.1, 'sine', 0.25), 160);   // G5
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.3), 240);   // C6 (hold)
  }, [enabled]);

  return {
    enabled,
    toggle,
    playKeyCorrect,
    playKeyWrong,
    playWordComplete,
    playLevelComplete
  };
}
