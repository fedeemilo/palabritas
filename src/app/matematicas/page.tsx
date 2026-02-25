import type { Metadata } from 'next'
import MathGame from '@/components/matematicas/MathGame'

export const metadata: Metadata = {
  title: 'Matemáticas - Aprendé a sumar y restar',
  description: 'Juego educativo de matemáticas básicas para niños',
}

export default function MatematicasPage() {
  return <MathGame />
}
