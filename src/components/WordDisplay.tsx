'use client';

interface WordDisplayProps {
  word: string;
}

export default function WordDisplay({ word }: WordDisplayProps) {
  // Determine if it's a sentence (has spaces) and adjust size
  const isSentence = word.includes(' ');
  const isLongSentence = word.length > 20;

  return (
    <div className="text-center py-2 sm:py-4 md:py-6 px-4 max-w-full">
      <span
        className={`
          font-bold text-gray-800
          ${isSentence
            ? isLongSentence
              ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide'
              : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide'
            : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-widest'
          }
        `}
        style={{ fontFamily: 'Inter, Poppins, system-ui, sans-serif' }}
      >
        {word.toUpperCase()}
      </span>
    </div>
  );
}
