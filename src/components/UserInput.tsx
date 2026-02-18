'use client';

import { useRef, useEffect, useState } from 'react';
import { isValidPartialInput, compareWords, normalizeText } from '@/utils/normalize';

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  targetWord: string;
  onComplete: () => void;
  disabled?: boolean;
}

export default function UserInput({
  value,
  onChange,
  targetWord,
  onComplete,
  disabled = false
}: UserInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showError, setShowError] = useState(false);
  const [errorChar, setErrorChar] = useState('');

  // Focus input on mount and when re-enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, targetWord]);

  // Clear error state when value changes or word changes
  useEffect(() => {
    setShowError(false);
    setErrorChar('');
  }, [targetWord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();

    // Check if new character is valid
    if (newValue === '' || isValidPartialInput(newValue, targetWord)) {
      setShowError(false);
      setErrorChar('');
      onChange(newValue);

      // Check if word is complete
      if (compareWords(newValue, targetWord)) {
        onComplete();
      }
    } else {
      // Show error feedback for incorrect letter
      const wrongChar = newValue.slice(-1);
      setErrorChar(wrongChar);
      setShowError(true);

      // Clear error after animation
      setTimeout(() => {
        setShowError(false);
        setErrorChar('');
      }, 600);
    }
  };

  // Handle key press for immediate feedback
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, arrows, etc.
    if (e.key.length > 1) return;

    const nextChar = e.key.toUpperCase();
    const expectedChar = normalizeText(targetWord[value.length] || '').toUpperCase();

    if (normalizeText(nextChar) !== expectedChar) {
      // Wrong key - will show error in onChange
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Main input showing correct letters */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          className={`
            w-full text-center text-4xl md:text-5xl font-semibold tracking-widest
            py-4 px-6 rounded-2xl
            border-4 outline-none transition-all duration-200
            ${showError
              ? 'border-red-400 bg-red-50 animate-shake'
              : 'border-gray-200 focus:border-blue-400 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ fontFamily: 'Inter, Poppins, system-ui, sans-serif' }}
          placeholder="..."
          aria-label={`Escribe la palabra: ${targetWord.toUpperCase()}`}
        />

        {/* Error character overlay */}
        {showError && errorChar && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl md:text-6xl font-bold text-red-500 animate-error-pop">
              {errorChar}
            </span>
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="mt-3 text-center">
        <span className="text-sm text-gray-400">
          {value.length} / {targetWord.length} letras
        </span>
      </div>
    </div>
  );
}
