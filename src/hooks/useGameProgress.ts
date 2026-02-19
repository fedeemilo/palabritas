'use client';

import { useState, useEffect, useCallback } from 'react';
import { Level, WordsData } from '@/types';

const STORAGE_KEY = 'palabritas_progress';

interface GameProgress {
  currentLevel: Level;
  currentWordIndex: number;
  completedWords: {
    nivel1: number[];
    nivel2: number[];
    nivel3: number[];
    nivel4: number[];
    nivel5: number[];
    nivel6: number[];
    nivel7: number[];
  };
}

const DEFAULT_PROGRESS: GameProgress = {
  currentLevel: 'nivel1',
  currentWordIndex: 0,
  completedWords: {
    nivel1: [],
    nivel2: [],
    nivel3: [],
    nivel4: [],
    nivel5: [],
    nivel6: [],
    nivel7: []
  }
};

export function useGameProgress(wordsData: WordsData) {
  const [progress, setProgress] = useState<GameProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameProgress;
        // Validate and merge with defaults
        setProgress({
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedWords: {
            ...DEFAULT_PROGRESS.completedWords,
            ...parsed.completedWords
          }
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoading]);

  // Check if a word is completed
  const isWordCompleted = useCallback((level: Level, wordIndex: number): boolean => {
    return progress.completedWords[level].includes(wordIndex);
  }, [progress.completedWords]);

  // Mark word as completed
  const markWordCompleted = useCallback((level: Level, wordIndex: number) => {
    setProgress(prev => {
      if (prev.completedWords[level].includes(wordIndex)) {
        return prev;
      }
      return {
        ...prev,
        completedWords: {
          ...prev.completedWords,
          [level]: [...prev.completedWords[level], wordIndex]
        }
      };
    });
  }, []);

  // Check if level is complete
  const isLevelComplete = useCallback((level: Level): boolean => {
    const totalWords = wordsData[level].length;
    const completedCount = progress.completedWords[level].length;
    return completedCount >= totalWords;
  }, [progress.completedWords, wordsData]);

  // Check if level is unlocked
  const isLevelUnlocked = useCallback((level: Level): boolean => {
    // Dev mode: unlock all levels
    if (process.env.NEXT_PUBLIC_UNLOCK_ALL === 'true') return true;

    if (level === 'nivel1') return true;
    if (level === 'nivel2') return isLevelComplete('nivel1');
    if (level === 'nivel3') return isLevelComplete('nivel2');
    if (level === 'nivel4') return isLevelComplete('nivel3');
    if (level === 'nivel5') return isLevelComplete('nivel4');
    if (level === 'nivel6') return isLevelComplete('nivel5');
    if (level === 'nivel7') return isLevelComplete('nivel6');
    return false;
  }, [isLevelComplete]);

  // Get completion stats for a level
  const getLevelStats = useCallback((level: Level) => {
    const totalWords = wordsData[level].length;
    const completedCount = progress.completedWords[level].length;
    return {
      completed: completedCount,
      total: totalWords,
      percentage: Math.round((completedCount / totalWords) * 100)
    };
  }, [progress.completedWords, wordsData]);

  // Set current level
  const setCurrentLevel = useCallback((level: Level) => {
    if (isLevelUnlocked(level)) {
      setProgress(prev => ({
        ...prev,
        currentLevel: level,
        currentWordIndex: 0
      }));
    }
  }, [isLevelUnlocked]);

  // Set current word index
  const setCurrentWordIndex = useCallback((index: number) => {
    setProgress(prev => ({
      ...prev,
      currentWordIndex: index
    }));
  }, []);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    currentLevel: progress.currentLevel,
    currentWordIndex: progress.currentWordIndex,
    completedWords: progress.completedWords,
    isLoading,
    isWordCompleted,
    markWordCompleted,
    isLevelComplete,
    isLevelUnlocked,
    getLevelStats,
    setCurrentLevel,
    setCurrentWordIndex,
    resetProgress
  };
}
