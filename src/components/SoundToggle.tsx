'use client';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="
        fixed bottom-4 left-4
        w-10 h-10 rounded-full
        bg-gray-100 hover:bg-gray-200
        flex items-center justify-center
        transition-colors cursor-pointer
        text-xl
      "
      aria-label={enabled ? 'Desactivar sonidos' : 'Activar sonidos'}
      title={enabled ? 'Sonidos activados' : 'Sonidos desactivados'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
