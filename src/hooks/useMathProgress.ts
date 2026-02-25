'use client'

import { useState, useEffect, useCallback } from 'react'
import { MATH_LEVELS } from '@/data/mathLevels'

const STORAGE_KEY = 'matematicas_progress'

interface MathProgress {
  currentLevelIndex: number
  completedPerLevel: Record<string, number>
}

const DEFAULT_PROGRESS: MathProgress = {
  currentLevelIndex: 0,
  completedPerLevel: {},
}

export function useMathProgress() {
  const [progress, setProgress] = useState<MathProgress>(DEFAULT_PROGRESS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(saved) })
      } catch (e) {
        console.error('Error loading math progress:', e)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  }, [progress, isLoading])

  const currentLevel = MATH_LEVELS[progress.currentLevelIndex]

  const getLevelStats = useCallback((levelIndex: number) => {
    const level = MATH_LEVELS[levelIndex]
    if (!level) return { completed: 0, total: 0, percentage: 0 }
    const completed = progress.completedPerLevel[level.id] || 0
    const total = level.targetExercises
    return {
      completed: Math.min(completed, total),
      total,
      percentage: Math.min(Math.round((completed / total) * 100), 100),
    }
  }, [progress.completedPerLevel])

  const isLevelUnlocked = useCallback((levelIndex: number) => {
    if (process.env.NEXT_PUBLIC_UNLOCK_ALL === 'true') return true
    if (levelIndex === 0) return true
    const prevLevel = MATH_LEVELS[levelIndex - 1]
    const prevCompleted = progress.completedPerLevel[prevLevel.id] || 0
    return prevCompleted >= prevLevel.targetExercises
  }, [progress.completedPerLevel])

  const isLevelComplete = useCallback((levelIndex: number) => {
    const level = MATH_LEVELS[levelIndex]
    if (!level) return false
    const completed = progress.completedPerLevel[level.id] || 0
    return completed >= level.targetExercises
  }, [progress.completedPerLevel])

  const incrementCompleted = useCallback(() => {
    setProgress(prev => {
      const levelId = MATH_LEVELS[prev.currentLevelIndex].id
      return {
        ...prev,
        completedPerLevel: {
          ...prev.completedPerLevel,
          [levelId]: (prev.completedPerLevel[levelId] || 0) + 1,
        },
      }
    })
  }, [])

  const setCurrentLevelIndex = useCallback((index: number) => {
    setProgress(prev => ({ ...prev, currentLevelIndex: index }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    currentLevelIndex: progress.currentLevelIndex,
    currentLevel,
    isLoading,
    getLevelStats,
    isLevelUnlocked,
    isLevelComplete,
    incrementCompleted,
    setCurrentLevelIndex,
    resetProgress,
  }
}
