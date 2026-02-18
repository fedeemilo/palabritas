'use client';

interface EmojiDisplayProps {
  emoji: string;
  word: string;
}

export default function EmojiDisplay({ emoji, word }: EmojiDisplayProps) {
  return (
    <div
      className="
        flex items-center justify-center bg-gray-50 rounded-3xl
        w-[200px] h-[200px]
        sm:w-[250px] sm:h-[250px]
        md:w-[300px] md:h-[300px]
      "
      role="img"
      aria-label={`Imagen de ${word}`}
    >
      <span className="text-[120px] sm:text-[150px] md:text-[180px] leading-none select-none">
        {emoji}
      </span>
    </div>
  );
}
