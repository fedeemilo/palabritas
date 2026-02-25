'use client'

import { MathOperation } from '@/data/mathLevels'

interface DotDisplayProps {
  a: number
  b: number
  operation: MathOperation
  merged?: boolean
}

export default function DotDisplay({ a, b, operation, merged = false }: DotDisplayProps) {
  const isAddition = operation === 'addition'

  return (
    <div className={`flex items-center justify-center py-2 transition-all duration-500 ${merged ? 'gap-2 sm:gap-2.5' : 'gap-4 sm:gap-6'}`}>
      {/* Group A */}
      <div
        className="flex flex-wrap gap-2 sm:gap-2.5 justify-center"
        style={{ maxWidth: a > 5 ? 110 : 200 }}
      >
        {Array.from({ length: a }, (_, i) => {
          let color = 'bg-blue-400'
          let fade = false

          if (merged) {
            if (isAddition) {
              color = 'bg-green-400'
            } else {
              const remaining = a - b
              if (i < remaining) {
                color = 'bg-green-400'
              } else {
                fade = true
              }
            }
          }

          return (
            <div
              key={i}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full animate-dot-pop transition-all duration-500 ${color} ${fade ? 'opacity-0 scale-0' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          )
        })}
      </div>

      {/* Operator */}
      <span
        className={`text-2xl sm:text-3xl font-bold text-gray-300 animate-dot-pop transition-all duration-300 ${merged ? 'opacity-0 w-0! overflow-hidden' : ''}`}
        style={{ animationDelay: `${a * 120}ms` }}
      >
        {isAddition ? '+' : '−'}
      </span>

      {/* Group B */}
      <div
        className={`flex flex-wrap gap-2 sm:gap-2.5 justify-center transition-all duration-500 ${merged && !isAddition ? 'opacity-0 scale-75' : ''}`}
        style={{ maxWidth: b > 5 ? 110 : 200 }}
      >
        {Array.from({ length: b }, (_, i) => (
          <div
            key={i}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${isAddition ? 'bg-green-400' : 'bg-red-300'} animate-dot-pop transition-colors duration-500`}
            style={{ animationDelay: `${(a + 1 + i) * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
