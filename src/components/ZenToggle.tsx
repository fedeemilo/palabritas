'use client';

import { X, Minimize2 } from 'lucide-react';

interface ZenToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function ZenToggle({ enabled, onToggle }: ZenToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 right-4 z-50
        w-10 h-10 rounded-full
        flex items-center justify-center
        transition-all duration-300 cursor-pointer
        ${enabled
          ? 'bg-gray-800 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }
      `}
      aria-label={enabled ? 'Desactivar modo Zen' : 'Activar modo Zen'}
      title={enabled ? 'Salir de modo Zen' : 'Modo Zen'}
    >
      {enabled ? <X className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
    </button>
  );
}
