'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'palabritas_sound';
const LETTER_STORAGE_KEY = 'palabritas_letter_sound';

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

        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn('Audio not supported:', e);
    }
}

function speakLetter(char: string) {
    try {
        if (typeof window === 'undefined' || !window.speechSynthesis) return
        speechSynthesis.cancel()
        const text = char === ' ' ? 'espacio' : char.toLowerCase()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'es-ES'
        utterance.rate = 1.4
        utterance.pitch = 1.1
        utterance.volume = 0.9
        speechSynthesis.speak(utterance)
    } catch {
        // Speech synthesis not supported
    }
}

export function useSound() {
    const [enabled, setEnabled] = useState(false);
    const [letterEnabled, setLetterEnabled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setEnabled(saved === 'true');
        }
        const letterSaved = localStorage.getItem(LETTER_STORAGE_KEY);
        if (letterSaved !== null) {
            setLetterEnabled(letterSaved === 'true');
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, String(enabled));
            localStorage.setItem(LETTER_STORAGE_KEY, String(letterEnabled));
        }
    }, [enabled, letterEnabled, isLoaded]);

    const toggle = useCallback(() => {
        setEnabled(prev => !prev);
    }, []);

    const toggleLetter = useCallback(() => {
        setLetterEnabled(prev => !prev);
    }, []);

    const playKeyWrong = useCallback(() => {
        if (!enabled) return;
        playTone(200, 0.15, 'square', 0.15);
    }, [enabled]);

    const playWordComplete = useCallback(() => {
        if (!enabled) return;
        setTimeout(() => playTone(523, 0.12, 'sine', 0.25), 0);
        setTimeout(() => playTone(659, 0.12, 'sine', 0.25), 100);
        setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
    }, [enabled]);

    const playLevelComplete = useCallback(() => {
        if (!enabled) return;
        setTimeout(() => playTone(523, 0.1, 'sine', 0.25), 0);
        setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80);
        setTimeout(() => playTone(784, 0.1, 'sine', 0.25), 160);
        setTimeout(() => playTone(1047, 0.3, 'sine', 0.3), 240);
    }, [enabled]);

    const playLetter = useCallback((char: string) => {
        if (!letterEnabled) return
        speakLetter(char)
    }, [letterEnabled])

    return {
        enabled,
        letterEnabled,
        toggle,
        toggleLetter,
        playKeyWrong,
        playWordComplete,
        playLevelComplete,
        playLetter,
    };
}
