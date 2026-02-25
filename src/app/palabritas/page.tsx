import type { Metadata } from 'next'
import Game from '@/components/Game'

export const metadata: Metadata = {
  title: 'Palabritas - Aprende a escribir',
  description: 'Aprendé a escribir palabras y oraciones en español',
}

export default function PalabritasPage() {
  return <Game />
}
