'use client';

interface EmojiDisplayProps {
  emoji: string;
  word: string;
}

export default function EmojiDisplay({ emoji, word }: EmojiDisplayProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-50 rounded-3xl"
      style={{ width: '300px', height: '300px' }}
      role="img"
      aria-label={`Imagen de ${word}`}
    >
      <span className="text-[180px] leading-none select-none">
        {emoji}
      </span>
    </div>
  );
}
