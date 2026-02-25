'use client'

interface AnswerOptionsProps {
  options: number[]
  onAnswer: (answer: number) => void
  wrongAnswer: number | null
  correctAnswer: number | null
  disabled: boolean
}

export default function AnswerOptions({ options, onAnswer, wrongAnswer, correctAnswer, disabled }: AnswerOptionsProps) {
  return (
    <div className="flex gap-4 sm:gap-6 justify-center w-full max-w-sm">
      {options.map((option) => {
        const isWrong = wrongAnswer === option
        const isCorrect = correctAnswer === option

        let style = 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        if (isCorrect) {
          style = 'bg-green-100 border-green-400 text-green-700 scale-110'
        } else if (isWrong) {
          style = 'bg-red-100 border-red-300 text-red-600 animate-shake'
        }

        return (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`
              flex-1 aspect-square max-w-28 sm:max-w-32
              flex items-center justify-center
              text-3xl sm:text-4xl font-bold
              rounded-2xl border-3 transition-all duration-200
              cursor-pointer active:scale-95
              ${style}
              ${disabled ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
