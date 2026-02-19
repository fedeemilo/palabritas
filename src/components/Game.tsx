'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WordsData, Level } from '@/types'
import { useGameProgress } from '@/hooks/useGameProgress'
import { useSound } from '@/hooks/useSound'
import { useZenMode } from '@/hooks/useZenMode'
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible'
import EmojiDisplay from './EmojiDisplay'
import WordDisplay from './WordDisplay'
import UserInput from './UserInput'
import SuccessAnimation from './SuccessAnimation'
import LevelCompleteModal from './LevelCompleteModal'
import LevelSelector from './LevelSelector'
import ResetButton from './ResetButton'
import SoundToggle from './SoundToggle'
import ZenToggle from './ZenToggle'
import wordsData from '@/data/words.json'

const LEVELS: Level[] = ['nivel1', 'nivel2', 'nivel3', 'nivel4', 'nivel5', 'nivel6', 'nivel7']

export default function Game() {
    const data = wordsData as WordsData

    const {
        currentLevel,
        currentWordIndex,
        isLoading,
        isWordCompleted,
        markWordCompleted,
        isLevelUnlocked,
        isLevelComplete,
        getLevelStats,
        setCurrentLevel,
        setCurrentWordIndex,
        resetProgress
    } = useGameProgress(data)

    const {
        enabled: soundEnabled,
        toggle: toggleSound,
        playKeyCorrect,
        playKeyWrong,
        playWordComplete,
        playLevelComplete
    } = useSound()

    const { enabled: zenMode, toggle: toggleZen } = useZenMode()
    const isKeyboardVisible = useKeyboardVisible()
    const imageRef = useRef<HTMLDivElement>(null)

    // Scroll to image when keyboard opens
    useEffect(() => {
        if (isKeyboardVisible && imageRef.current) {
            imageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isKeyboardVisible])

    const [userInput, setUserInput] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showLevelComplete, setShowLevelComplete] = useState(false)
    const [completedLevel, setCompletedLevel] = useState<number>(1)

    const words = data[currentLevel]
    const currentWord = words[currentWordIndex]
    const isCurrentCompleted = isWordCompleted(currentLevel, currentWordIndex)

    const currentLevelIndex = LEVELS.indexOf(currentLevel)
    const isLastLevel = currentLevelIndex === LEVELS.length - 1

    const handleLevelChange = (level: typeof currentLevel) => {
        setCurrentLevel(level)
        setUserInput('')
    }

    const handleWordComplete = useCallback(() => {
        markWordCompleted(currentLevel, currentWordIndex)
        playWordComplete()
        setShowSuccess(true)
    }, [currentLevel, currentWordIndex, markWordCompleted, playWordComplete])

    const handleSuccessComplete = useCallback(() => {
        setShowSuccess(false)
        setUserInput('')

        // Check if level is now complete after this word
        const stats = getLevelStats(currentLevel)
        if (stats.completed === stats.total) {
            setCompletedLevel(LEVELS.indexOf(currentLevel) + 1)
            setShowLevelComplete(true)
        } else {
            // Auto-advance to next word
            const totalWords = data[currentLevel].length
            if (currentWordIndex < totalWords - 1) {
                setCurrentWordIndex(currentWordIndex + 1)
            }
        }
    }, [currentLevel, currentWordIndex, data, getLevelStats, setCurrentWordIndex])

    const handleLevelModalContinue = () => {
        setShowLevelComplete(false)

        if (!isLastLevel) {
            const nextLevel = LEVELS[currentLevelIndex + 1]
            setCurrentLevel(nextLevel)
        } else {
            // All levels complete - restart
            setCurrentLevel('nivel1')
            setCurrentWordIndex(0)
        }
        setUserInput('')
    }

    const handleNextWord = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
            setUserInput('')
        } else {
            // At last word - check if level complete
            if (isLevelComplete(currentLevel)) {
                setCompletedLevel(currentLevelIndex + 1)
                setShowLevelComplete(true)
            } else {
                // Go to first incomplete word
                const firstIncomplete = words.findIndex((_, idx) => !isWordCompleted(currentLevel, idx))
                if (firstIncomplete !== -1) {
                    setCurrentWordIndex(firstIncomplete)
                    setUserInput('')
                }
            }
        }
    }

    const handlePreviousWord = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1)
            setUserInput('')
        }
    }

    const handleReset = () => {
        resetProgress()
        setUserInput('')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <main
            className={`
      min-h-screen bg-[var(--background)] flex flex-col items-center justify-center
      ${zenMode ? 'p-4' : 'px-4 pt-20 pb-16 md:p-8'}
    `}
        >
            {/* Zen mode toggle - always visible */}
            <ZenToggle enabled={zenMode} onToggle={toggleZen} />

            {/* UI elements hidden in Zen mode */}
            {!zenMode && (
                <LevelSelector
                    currentLevel={currentLevel}
                    onLevelChange={handleLevelChange}
                    isLevelUnlocked={isLevelUnlocked}
                    getLevelStats={getLevelStats}
                />
            )}

            {/* Main content - centered vertically */}
            <div className="flex flex-col items-center w-full max-w-xl gap-4 sm:gap-6 md:gap-8">
                {/* Emoji with completed badge */}
                <div ref={imageRef} className={`relative transition-transform duration-300 ${isKeyboardVisible ? 'scale-75' : ''}`}>
                    <EmojiDisplay emoji={currentWord.emoji} word={currentWord.word} level={currentLevel} />

                    {/* Completed badge - hidden in Zen mode */}
                    {!zenMode && isCurrentCompleted && (
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Target word */}
                <WordDisplay word={currentWord.word} />

                {/* User input */}
                <UserInput
                    value={userInput}
                    onChange={setUserInput}
                    targetWord={currentWord.word}
                    onComplete={handleWordComplete}
                    disabled={showSuccess || showLevelComplete}
                    onKeyCorrect={playKeyCorrect}
                    onKeyWrong={playKeyWrong}
                    zenMode={zenMode}
                />

                {/* Navigation buttons */}
                <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-4">
                    <button
                        onClick={handlePreviousWord}
                        disabled={currentWordIndex === 0}
                        className={`
                            p-3 sm:p-4 rounded-full transition-all duration-200
                            ${
                                currentWordIndex === 0
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer active:scale-95'
                            }
                        `}
                        aria-label="Palabra anterior"
                    >
                        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>

                    <button
                        onClick={handleNextWord}
                        className="
                            p-3 sm:p-4 rounded-full
                            bg-blue-100 text-blue-600
                            hover:bg-blue-200 hover:text-blue-700
                            transition-all duration-200
                            cursor-pointer active:scale-95
                        "
                        aria-label="Siguiente palabra"
                    >
                        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                </div>
            </div>

            {/* Success animation overlay */}
            <SuccessAnimation show={showSuccess} onComplete={handleSuccessComplete} />

            {/* Level complete modal */}
            <LevelCompleteModal
                show={showLevelComplete}
                level={completedLevel}
                onContinue={handleLevelModalContinue}
                isLastLevel={isLastLevel && isLevelComplete('nivel6')}
                playSound={playLevelComplete}
            />

            {/* UI elements hidden in Zen mode */}
            {!zenMode && (
                <>
                    {/* Sound toggle */}
                    <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />

                    {/* Reset progress button */}
                    <ResetButton onReset={handleReset} />
                </>
            )}
        </main>
    )
}
