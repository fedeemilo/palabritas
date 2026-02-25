'use client';

import { Volume2, VolumeOff } from 'lucide-react';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="
        w-10 h-10 rounded-full
        bg-gray-100 hover:bg-gray-200
        flex items-center justify-center
        transition-colors cursor-pointer
        text-gray-600
      "
      aria-label={enabled ? 'Desactivar sonidos' : 'Activar sonidos'}
      title={enabled ? 'Sonidos activados' : 'Sonidos desactivados'}
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeOff className="w-5 h-5" />}
    </button>
  );
}
