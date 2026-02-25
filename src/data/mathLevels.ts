export type MathOperation = 'addition' | 'subtraction'

export interface MathLevelConfig {
  id: string
  label: string
  operation: MathOperation
  maxResult: number
  targetExercises: number
}

export const MATH_LEVELS: MathLevelConfig[] = [
  {
    id: 'sumas-5',
    label: 'Nivel 1 - Sumas hasta 5',
    operation: 'addition',
    maxResult: 5,
    targetExercises: 10,
  },
  {
    id: 'sumas-10',
    label: 'Nivel 2 - Sumas hasta 10',
    operation: 'addition',
    maxResult: 10,
    targetExercises: 15,
  },
  {
    id: 'restas',
    label: 'Nivel 3 - Restas simples',
    operation: 'subtraction',
    maxResult: 10,
    targetExercises: 15,
  },
]

export interface MathExercise {
  a: number
  b: number
  operation: MathOperation
  correctAnswer: number
  options: number[]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function generateOptions(correct: number): number[] {
  const options = new Set<number>([correct])
  const offsets = [1, -1, 2, -2, 3, -3]

  for (const offset of offsets) {
    if (options.size >= 3) break
    const candidate = correct + offset
    if (candidate >= 0) {
      options.add(candidate)
    }
  }

  return shuffle([...options])
}

export function generateExercise(level: MathLevelConfig): MathExercise {
  let a: number, b: number, correctAnswer: number

  if (level.operation === 'addition') {
    a = randomInt(1, level.maxResult - 1)
    b = randomInt(1, level.maxResult - a)
    correctAnswer = a + b
  } else {
    a = randomInt(2, level.maxResult)
    b = randomInt(1, a - 1)
    correctAnswer = a - b
  }

  return {
    a,
    b,
    operation: level.operation,
    correctAnswer,
    options: generateOptions(correctAnswer),
  }
}
