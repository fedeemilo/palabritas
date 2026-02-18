'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { WordsData } from '@/types';
import { useGameProgress } from '@/hooks/useGameProgress';
import ImageDisplay from './ImageDisplay';
import WordDisplay from './WordDisplay';
import UserInput from './UserInput';
import SuccessAnimation from './SuccessAnimation';
import ProgressIndicator from './ProgressIndicator';
import LevelSelector from './LevelSelector';
import ResetButton from './ResetButton';
import wordsData from '@/data/words.json';

export default function Game() {
  const data = wordsData as WordsData;

  const {
    currentLevel,
    currentWordIndex,
    isLoading,
    isWordCompleted,
    markWordCompleted,
    isLevelUnlocked,
    getLevelStats,
    setCurrentLevel,
    setCurrentWordIndex,
    resetProgress
  } = useGameProgress(data);

  const [userInput, setUserInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const words = data[currentLevel];
  const currentWord = words[currentWordIndex];
  const nextWord = words[currentWordIndex + 1];
  const isCurrentCompleted = isWordCompleted(currentLevel, currentWordIndex);
  const levelStats = getLevelStats(currentLevel);

  const handleLevelChange = (level: typeof currentLevel) => {
    setCurrentLevel(level);
    setUserInput('');
  };

  const handleWordComplete = useCallback(() => {
    markWordCompleted(currentLevel, currentWordIndex);
    setShowSuccess(true);
  }, [currentLevel, currentWordIndex, markWordCompleted]);

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
    setUserInput('');
  }, []);

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserInput('');
    } else {
      // Level complete - try to go to next level
      const levels = ['nivel1', 'nivel2', 'nivel3'] as const;
      const currentLevelIndex = levels.indexOf(currentLevel);

      if (currentLevelIndex < levels.length - 1) {
        const nextLevel = levels[currentLevelIndex + 1];
        if (isLevelUnlocked(nextLevel)) {
          setCurrentLevel(nextLevel);
          setUserInput('');
        }
      } else {
        // All levels complete - go back to start
        setCurrentLevel('nivel1');
        setCurrentWordIndex(0);
        setUserInput('');
      }
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setUserInput('');
    }
  };

  const handleReset = () => {
    resetProgress();
    setUserInput('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      <ProgressIndicator
        currentIndex={currentWordIndex}
        totalWords={words.length}
        level={currentLevel}
        isCurrentWordCompleted={isCurrentCompleted}
        completedInLevel={levelStats.completed}
      />

      <LevelSelector
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
        isLevelUnlocked={isLevelUnlocked}
        getLevelStats={getLevelStats}
      />

      {/* Main content - centered vertically */}
      <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-xl">
        {/* Image with completed badge */}
        <div className="relative">
          <ImageDisplay
            imageUrl={currentWord.imageUrl}
            word={currentWord.word}
            priority={true}
          />

          {/* Completed badge */}
          {isCurrentCompleted && (
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Preload next image */}
        {nextWord && (
          <div className="hidden">
            <Image
              src={nextWord.imageUrl}
              alt=""
              width={1}
              height={1}
              priority={false}
            />
          </div>
        )}

        {/* Target word */}
        <WordDisplay word={currentWord.word} />

        {/* User input */}
        <UserInput
          value={userInput}
          onChange={setUserInput}
          targetWord={currentWord.word}
          onComplete={handleWordComplete}
          disabled={showSuccess}
        />

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePreviousWord}
            disabled={currentWordIndex === 0}
            className={`
              px-6 py-3 text-lg font-medium rounded-xl
              transition-all duration-200
              ${currentWordIndex === 0
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer active:scale-95'
              }
            `}
            aria-label="Palabra anterior"
          >
            ← Anterior
          </button>

          <button
            onClick={handleNextWord}
            className="
              px-6 py-3 text-lg font-medium rounded-xl
              bg-blue-500 text-white
              hover:bg-blue-600 transition-all duration-200
              cursor-pointer active:scale-95
            "
            aria-label="Siguiente palabra"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Success animation overlay */}
      <SuccessAnimation
        show={showSuccess}
        onComplete={handleSuccessComplete}
      />

      {/* Reset progress button */}
      <ResetButton onReset={handleReset} />
    </main>
  );
}
