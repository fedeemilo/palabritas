'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Level } from '@/types';

interface LevelSelectorProps {
  currentLevel: Level;
  onLevelChange: (level: Level) => void;
  isLevelUnlocked: (level: Level) => boolean;
  getLevelStats: (level: Level) => { completed: number; total: number; percentage: number };
}

const levels: { key: Level; label: string }[] = [
  { key: 'nivel1', label: 'Nivel 1 - Palabras' },
  { key: 'nivel2', label: 'Nivel 2 - Palabras' },
  { key: 'nivel3', label: 'Nivel 3 - Palabras' },
  { key: 'nivel4', label: 'Nivel 4 - Oraciones' },
  { key: 'nivel5', label: 'Nivel 5 - Oraciones' },
  { key: 'nivel6', label: 'Nivel 6 - Oraciones' },
  { key: 'nivel7', label: 'Nivel 7 - Oraciones' },
  { key: 'nivel8', label: 'Nivel 8 - Oraciones' },
  { key: 'nivel9', label: 'Bonus - Personajes' }
];

export default function LevelSelector({
  currentLevel,
  onLevelChange,
  isLevelUnlocked,
  getLevelStats
}: LevelSelectorProps) {
  return (
    <div className="fixed top-4 left-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 active:scale-95 shrink-0"
          aria-label="Volver al inicio"
        >
          <Home className="w-5 h-5" />
        </Link>
        <select
        value={currentLevel}
        onChange={(e) => {
          const level = e.target.value as Level;
          if (isLevelUnlocked(level)) {
            onLevelChange(level);
          }
        }}
        className="
          px-4 py-2 text-lg font-medium
          bg-white border-2 border-gray-200 rounded-xl
          focus:outline-none focus:border-blue-400
          cursor-pointer
          hover:border-gray-300 transition-colors
          appearance-none
          pr-10
          bg-no-repeat bg-right
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: 'right 8px center',
          backgroundSize: '20px'
        }}
        aria-label="Seleccionar nivel de dificultad"
      >
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.key);
          const stats = getLevelStats(level.key);
          const isComplete = stats.completed === stats.total;

          return (
            <option
              key={level.key}
              value={level.key}
              disabled={!unlocked}
            >
              {unlocked ? (isComplete ? '✓ ' : '') : '🔒 '}{level.label}
              {unlocked ? ` (${stats.completed}/${stats.total})` : ''}
            </option>
          );
        })}
      </select>
      </div>

      {/* Progress bar for current level */}
      <div className="w-full">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-500 ease-out"
            style={{ width: `${getLevelStats(currentLevel).percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
