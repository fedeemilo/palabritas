'use client';

import { Image as ImageIcon, ImageOff } from 'lucide-react';

interface ImageToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function ImageToggle({ enabled, onToggle }: ImageToggleProps) {
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
      aria-label={enabled ? 'Ocultar imagen' : 'Mostrar imagen'}
      title={enabled ? 'Imagen visible' : 'Imagen oculta'}
    >
      {enabled ? <ImageIcon className="w-5 h-5" /> : <ImageOff className="w-5 h-5" />}
    </button>
  );
}
