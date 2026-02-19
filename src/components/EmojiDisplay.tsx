'use client';

interface EmojiDisplayProps {
  emoji: string;
  word: string;
}

export default function EmojiDisplay({ emoji, word }: EmojiDisplayProps) {
  // Count emojis (rough estimate - emojis can be multi-codepoint)
  const emojiCount = [...emoji].filter(char => char.match(/[\p{Emoji}]/u)).length;
  const hasMultipleEmojis = emojiCount > 1 || emoji.length > 2;

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
      <span
        className={`
          leading-none select-none
          ${hasMultipleEmojis
            ? 'text-[60px] sm:text-[80px] md:text-[100px]'
            : 'text-[120px] sm:text-[150px] md:text-[180px]'
          }
        `}
      >
        {emoji}
      </span>
    </div>
  );
}
