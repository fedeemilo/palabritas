'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { MATH_LEVELS } from '@/data/mathLevels'

interface MathLevelSelectorProps {
  currentLevelIndex: number
  onLevelChange: (index: number) => void
  isLevelUnlocked: (index: number) => boolean
  getLevelStats: (index: number) => { completed: number; total: number; percentage: number }
}

export default function MathLevelSelector({
  currentLevelIndex,
  onLevelChange,
  isLevelUnlocked,
  getLevelStats,
}: MathLevelSelectorProps) {
  return (
    <div className="fixed top-4 left-4 flex flex-col gap-2 z-40">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 active:scale-95 shrink-0"
          aria-label="Volver al inicio"
        >
          <Home className="w-5 h-5" />
        </Link>
        <select
          value={currentLevelIndex}
          onChange={(e) => {
            const index = Number(e.target.value)
            if (isLevelUnlocked(index)) {
              onLevelChange(index)
            }
          }}
          className="
            px-4 py-2 text-lg font-medium
            bg-white border-2 border-gray-200 rounded-xl
            focus:outline-none focus:border-amber-400
            cursor-pointer
            hover:border-gray-300 transition-colors
            appearance-none
            pr-10
            bg-no-repeat bg-right
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundPosition: 'right 8px center',
            backgroundSize: '20px',
          }}
          aria-label="Seleccionar nivel"
        >
          {MATH_LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(index)
            const stats = getLevelStats(index)
            const isComplete = stats.completed >= stats.total

            return (
              <option key={level.id} value={index} disabled={!unlocked}>
                {unlocked ? (isComplete ? '✓ ' : '') : '🔒 '}
                {level.label}
                {unlocked ? ` (${stats.completed}/${stats.total})` : ''}
              </option>
            )
          })}
        </select>
      </div>

      <div className="w-full">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${getLevelStats(currentLevelIndex).percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
