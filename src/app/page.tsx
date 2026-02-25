import Link from 'next/link'

const games = [
  {
    href: '/palabritas',
    emoji: '✏️',
    title: 'Palabritas',
    description: 'Aprendé a escribir',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    shadow: 'hover:shadow-blue-200/50',
  },
  {
    href: '/matematicas',
    emoji: '🔢',
    title: 'Matemáticas',
    description: 'Aprendé a sumar y restar',
    color: 'bg-amber-100 hover:bg-amber-200 border-amber-300',
    shadow: 'hover:shadow-amber-200/50',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2 tracking-tight">
        Juegos Educativos
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 mb-12">
        Elegí un juego para empezar
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-lg">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className={`
              relative flex flex-col items-center gap-3 p-8 sm:p-10
              rounded-3xl border-2 transition-all duration-200
              ${game.color} ${game.shadow}
              hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]
            `}
            aria-label={game.title}
          >
            <span className="text-5xl sm:text-6xl">{game.emoji}</span>
            <span className="text-xl sm:text-2xl font-semibold text-gray-800">
              {game.title}
            </span>
            <span className="text-sm text-gray-500">{game.description}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
