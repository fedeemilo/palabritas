'use client';

import { useEffect } from 'react';

interface LevelCompleteModalProps {
  show: boolean;
  level: number;
  onContinue: () => void;
  isLastLevel: boolean;
  playSound?: () => void;
}

export default function LevelCompleteModal({
  show,
  level,
  onContinue,
  isLastLevel,
  playSound
}: LevelCompleteModalProps) {
  useEffect(() => {
    if (show && playSound) {
      playSound();
    }
  }, [show, playSound]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/95 z-50">
      <div className="flex flex-col items-center gap-6 animate-bounce-in text-center px-8">
        {/* Trophy or celebration emoji */}
        <div className="text-8xl md:text-9xl animate-float">
          {isLastLevel ? '👑' : '🏆'}
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          {isLastLevel ? '¡Felicitaciones!' : '¡Nivel completado!'}
        </h2>

        {/* Message */}
        <p className="text-xl text-gray-600">
          {isLastLevel
            ? 'Completaste todos los niveles'
            : `Terminaste el Nivel ${level}`
          }
        </p>

        {/* Stars */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="text-4xl animate-star-pop"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="
            mt-4 px-8 py-4 text-xl font-semibold rounded-2xl
            bg-green-500 text-white
            hover:bg-green-600 transition-all duration-200
            cursor-pointer active:scale-95
          "
        >
          {isLastLevel ? 'Volver a empezar' : 'Siguiente nivel →'}
        </button>
      </div>
    </div>
  );
}
