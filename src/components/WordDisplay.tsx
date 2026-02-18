'use client';

interface WordDisplayProps {
  word: string;
}

export default function WordDisplay({ word }: WordDisplayProps) {
  return (
    <div className="text-center py-6">
      <span
        className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 tracking-widest"
        style={{ fontFamily: 'Inter, Poppins, system-ui, sans-serif' }}
      >
        {word.toUpperCase()}
      </span>
    </div>
  );
}
