'use client';

import { Level } from '@/types';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalWords: number;
  level: Level;
  isCurrentWordCompleted: boolean;
  completedInLevel: number;
}

const levelNames: Record<Level, string> = {
  nivel1: 'Nivel 1',
  nivel2: 'Nivel 2',
  nivel3: 'Nivel 3'
};

export default function ProgressIndicator({
  currentIndex,
  totalWords,
  level,
  isCurrentWordCompleted,
  completedInLevel
}: ProgressIndicatorProps) {
  return (
    <div className="fixed top-4 right-4 flex flex-col items-end gap-1">
      <span className="text-sm text-gray-400 font-medium">
        {levelNames[level]}
      </span>
      <div className="flex items-center gap-2">
        {isCurrentWordCompleted && (
          <span className="text-green-500 text-sm font-medium">
            ✓ Completada
          </span>
        )}
        <span className="text-lg font-semibold text-gray-500">
          {currentIndex + 1} / {totalWords}
        </span>
      </div>
      <span className="text-xs text-gray-400">
        {completedInLevel} de {totalWords} completadas
      </span>
    </div>
  );
}
