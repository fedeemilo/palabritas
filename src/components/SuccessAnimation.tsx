'use client'

import { useEffect, useState } from 'react'
import { Star, Check } from 'lucide-react'

interface SuccessAnimationProps {
    show: boolean
    onComplete: () => void
}

export default function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setVisible(true)
            const timer = setTimeout(() => {
                setVisible(false)
                onComplete()
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [show, onComplete])

    if (!visible) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/95 z-50">
            <div className="flex flex-col items-center gap-6 animate-bounce-in">
                {/* Checkmark circle */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-20 h-20 md:w-24 md:h-24 text-green-500" strokeWidth={3} />
                </div>

                {/* Stars decoration */}
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 fill-yellow-400 animate-star-pop"
                            style={{ animationDelay: `${i * 100}ms` }}
                        />
                    ))}
                </div>

                <span className="text-3xl md:text-4xl font-bold text-green-600">¡Muy bien!</span>
            </div>
        </div>
    )
}
