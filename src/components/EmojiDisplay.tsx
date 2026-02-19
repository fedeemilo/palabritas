'use client';

import { useState, useEffect } from 'react';

interface EmojiDisplayProps {
  emoji: string;
  word: string;
}

// Helper to convert word/sentence to filename
function toFilename(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function EmojiDisplay({ emoji, word }: EmojiDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentWord, setCurrentWord] = useState(word);

  // Detect if it's a sentence (has spaces = levels 4-6) or word (levels 1-3)
  const isSentence = word.includes(' ');
  const imageFolder = isSentence ? 'oraciones' : 'palabras';
  const imagePath = `/images/${imageFolder}/${toFilename(word)}.png`;

  // Reset loaded state when word changes
  useEffect(() => {
    if (word !== currentWord) {
      setImageLoaded(false);
      setCurrentWord(word);
    }
  }, [word, currentWord]);

  return (
    <div
      className="
        relative flex items-center justify-center bg-gray-50 rounded-3xl overflow-hidden
        w-[200px] h-[200px]
        sm:w-[250px] sm:h-[250px]
        md:w-[350px] md:h-[350px]
        lg:w-[400px] lg:h-[400px]
      "
      role="img"
      aria-label={`Imagen de ${word}`}
    >
      {/* Placeholder while loading */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
      </div>

      {/* Actual image */}
      <img
        src={imagePath}
        alt={word}
        onLoad={() => setImageLoaded(true)}
        className={`
          w-full h-full object-cover
          transition-opacity duration-500 ease-out
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
}
