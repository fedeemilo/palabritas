'use client'

import { useEffect } from 'react'
import { Trophy, Crown, Star } from 'lucide-react'

interface LevelCompleteModalProps {
    show: boolean
    level: number
    onContinue: () => void
    isLastLevel: boolean
    playSound?: () => void
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
            playSound()
        }
    }, [show, playSound])

    if (!show) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/95 z-50">
            <div className="flex flex-col items-center gap-6 animate-bounce-in text-center px-8">
                {/* Trophy or crown icon */}
                <div className="animate-float">
                    {isLastLevel ? (
                        <Crown className="w-24 h-24 md:w-32 md:h-32 text-yellow-500 fill-yellow-400" />
                    ) : (
                        <Trophy className="w-24 h-24 md:w-32 md:h-32 text-yellow-500 fill-yellow-400" />
                    )}
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {isLastLevel ? '¡Felicitaciones!' : '¡Nivel completado!'}
                </h2>

                {/* Message */}
                <p className="text-xl text-gray-600">
                    {isLastLevel ? 'Completaste todos los niveles' : `Terminaste el Nivel ${level}`}
                </p>

                {/* Stars */}
                <div className="flex gap-3">
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 fill-yellow-400 animate-star-pop"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
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
    )
}
