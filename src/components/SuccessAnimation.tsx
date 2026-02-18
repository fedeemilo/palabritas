'use client';

import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export default function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-50">
      <div className="flex flex-col items-center gap-6 animate-bounce-in">
        {/* Checkmark circle */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-20 h-20 md:w-24 md:h-24 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              className="animate-draw-check"
            />
          </svg>
        </div>

        {/* Stars decoration */}
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="text-4xl md:text-5xl animate-star-pop"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <span className="text-3xl md:text-4xl font-bold text-green-600">
          ¡Muy bien!
        </span>
      </div>
    </div>
  );
}
