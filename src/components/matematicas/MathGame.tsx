'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { MATH_LEVELS, generateExercise, MathExercise } from '@/data/mathLevels'
import { useMathProgress } from '@/hooks/useMathProgress'
import { useSound } from '@/hooks/useSound'
import DotDisplay from './DotDisplay'
import AnswerOptions from './AnswerOptions'
import MathLevelSelector from './MathLevelSelector'
import SuccessAnimation from '../SuccessAnimation'
import LevelCompleteModal from '../LevelCompleteModal'
import SoundToggle from '../SoundToggle'
import ResetButton from '../ResetButton'

export default function MathGame() {
  const {
    currentLevelIndex,
    currentLevel,
    isLoading,
    getLevelStats,
    isLevelUnlocked,
    incrementCompleted,
    setCurrentLevelIndex,
    resetProgress,
  } = useMathProgress()

  const {
    enabled: soundEnabled,
    toggle: toggleSound,
    playKeyWrong,
    playWordComplete,
    playLevelComplete,
  } = useSound()

  const [exercise, setExercise] = useState<MathExercise | null>(null)
  const [exerciseKey, setExerciseKey] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null)
  const [correctAnswerShown, setCorrectAnswerShown] = useState<number | null>(null)

  const levelJustCompletedRef = useRef(false)
  const currentLevelIndexRef = useRef(currentLevelIndex)
  currentLevelIndexRef.current = currentLevelIndex

  useEffect(() => {
    const level = MATH_LEVELS[currentLevelIndex]
    if (level) {
      setExercise(generateExercise(level))
      setExerciseKey(k => k + 1)
      setWrongAnswer(null)
    }
  }, [currentLevelIndex])

  const handleAnswer = useCallback((answer: number) => {
    if (!exercise || showSuccess || showLevelComplete || correctAnswerShown !== null) return

    if (answer === exercise.correctAnswer) {
      playWordComplete()

      const stats = getLevelStats(currentLevelIndexRef.current)
      const wasComplete = stats.completed >= stats.total
      levelJustCompletedRef.current = !wasComplete && stats.completed + 1 >= stats.total

      incrementCompleted()
      setCorrectAnswerShown(answer)
      setTimeout(() => {
        setCorrectAnswerShown(null)
        setShowSuccess(true)
      }, 700)
    } else {
      playKeyWrong()
      setWrongAnswer(answer)
      setTimeout(() => setWrongAnswer(null), 600)
    }
  }, [exercise, showSuccess, showLevelComplete, playWordComplete, playKeyWrong, getLevelStats, incrementCompleted])

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false)

    if (levelJustCompletedRef.current) {
      levelJustCompletedRef.current = false
      setShowLevelComplete(true)
    } else {
      const level = MATH_LEVELS[currentLevelIndexRef.current]
      setExercise(generateExercise(level))
      setExerciseKey(k => k + 1)
    }
  }, [])

  const handleLevelContinue = useCallback(() => {
    setShowLevelComplete(false)
    const isLast = currentLevelIndexRef.current === MATH_LEVELS.length - 1

    if (!isLast) {
      setCurrentLevelIndex(currentLevelIndexRef.current + 1)
    } else {
      const level = MATH_LEVELS[currentLevelIndexRef.current]
      setExercise(generateExercise(level))
      setExerciseKey(k => k + 1)
    }
  }, [setCurrentLevelIndex])

  // Auto-advance after level complete modal shows
  useEffect(() => {
    if (showLevelComplete) {
      const timer = setTimeout(handleLevelContinue, 3000)
      return () => clearTimeout(timer)
    }
  }, [showLevelComplete, handleLevelContinue])

  const handleLevelChange = useCallback((index: number) => {
    setCurrentLevelIndex(index)
  }, [setCurrentLevelIndex])

  const handleReset = useCallback(() => {
    resetProgress()
    setExercise(generateExercise(MATH_LEVELS[0]))
    setExerciseKey(k => k + 1)
  }, [resetProgress])

  if (isLoading || !exercise) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-amber-400 rounded-full animate-spin" />
      </div>
    )
  }

  const operatorSymbol = exercise.operation === 'addition' ? '+' : '−'
  const isLastLevel = currentLevelIndex === MATH_LEVELS.length - 1

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 pt-20 pb-16 md:p-8">
      <MathLevelSelector
        currentLevelIndex={currentLevelIndex}
        onLevelChange={handleLevelChange}
        isLevelUnlocked={isLevelUnlocked}
        getLevelStats={getLevelStats}
      />

      <div className="flex flex-col items-center w-full max-w-md gap-8 sm:gap-10">
        {/* Equation */}
        <div className="text-6xl sm:text-7xl font-bold text-gray-800 tracking-wider">
          {exercise.a} {operatorSymbol} {exercise.b}
        </div>

        {/* Visual dots */}
        <DotDisplay key={exerciseKey} a={exercise.a} b={exercise.b} operation={exercise.operation} merged={correctAnswerShown !== null} />

        {/* Answer options */}
        <AnswerOptions
          options={exercise.options}
          onAnswer={handleAnswer}
          wrongAnswer={wrongAnswer}
          correctAnswer={correctAnswerShown}
          disabled={showSuccess || showLevelComplete || correctAnswerShown !== null}
        />
      </div>

      <SuccessAnimation show={showSuccess} onComplete={handleSuccessComplete} />

      <LevelCompleteModal
        show={showLevelComplete}
        level={currentLevelIndex + 1}
        onContinue={handleLevelContinue}
        isLastLevel={isLastLevel && getLevelStats(currentLevelIndex).completed >= getLevelStats(currentLevelIndex).total}
        playSound={playLevelComplete}
      />

      <div className="fixed bottom-4 left-4">
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      </div>
      <ResetButton onReset={handleReset} />
    </main>
  )
}
