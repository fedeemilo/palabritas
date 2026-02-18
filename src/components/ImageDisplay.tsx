'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageDisplayProps {
  imageUrl: string;
  word: string;
  priority?: boolean;
}

export default function ImageDisplay({ imageUrl, word, priority = false }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when image URL changes
  useEffect(() => {
    setIsLoading(true);
  }, [imageUrl]);

  return (
    <div className="relative w-full max-w-[500px] aspect-square bg-gray-50 rounded-3xl overflow-hidden">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Image */}
      <Image
        src={imageUrl}
        alt={`Imagen de ${word}`}
        fill
        priority={priority}
        className={`
          object-contain p-4 transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        sizes="(max-width: 768px) 90vw, 500px"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
