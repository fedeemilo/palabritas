'use client';

import { useRef, useEffect, useState } from 'react';
import { isValidPartialInput, compareWords } from '@/utils/normalize';

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  targetWord: string;
  onComplete: () => void;
  disabled?: boolean;
  onKeyCorrect?: () => void;
  onKeyWrong?: () => void;
}

export default function UserInput({
  value,
  onChange,
  targetWord,
  onComplete,
  disabled = false,
  onKeyCorrect,
  onKeyWrong
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

  // Clear error state when word changes
  useEffect(() => {
    setShowError(false);
    setErrorChar('');
  }, [targetWord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();

    // Handle backspace (shorter input)
    if (newValue.length < value.length) {
      onChange(newValue);
      return;
    }

    // Check if new character is valid
    if (newValue === '' || isValidPartialInput(newValue, targetWord)) {
      setShowError(false);
      setErrorChar('');
      onChange(newValue);

      // Play correct key sound
      if (newValue.length > value.length) {
        onKeyCorrect?.();
      }

      // Check if word is complete
      if (compareWords(newValue, targetWord)) {
        onComplete();
      }
    } else {
      // Show error feedback for incorrect letter
      const wrongChar = newValue.slice(-1);
      setErrorChar(wrongChar);
      setShowError(true);

      // Play wrong key sound
      onKeyWrong?.();

      // Clear error after animation
      setTimeout(() => {
        setShowError(false);
        setErrorChar('');
      }, 600);
    }
  };

  // Determine if it's a sentence (has spaces)
  const isSentence = targetWord.includes(' ');

  return (
    <div className={`w-full relative px-2 sm:px-0 ${isSentence ? 'max-w-lg sm:max-w-xl' : 'max-w-sm sm:max-w-md'}`}>
      {/* Main input showing correct letters */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          className={`
            w-full text-center font-semibold
            py-3 px-4 sm:py-4 sm:px-6 rounded-2xl
            border-4 outline-none transition-all duration-200
            ${isSentence
              ? 'text-xl sm:text-2xl md:text-3xl tracking-wide'
              : 'text-3xl sm:text-4xl md:text-5xl tracking-widest'
            }
            ${showError
              ? 'border-red-400 bg-red-50 animate-shake'
              : 'border-gray-200 focus:border-blue-400 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ fontFamily: 'Inter, Poppins, system-ui, sans-serif' }}
          placeholder="..."
          aria-label={`Escribe: ${targetWord.toUpperCase()}`}
        />

        {/* Error character overlay */}
        {showError && errorChar && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`font-bold text-red-500 animate-error-pop ${isSentence ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'}`}>
              {errorChar}
            </span>
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="mt-2 sm:mt-3 text-center">
        <span className="text-xs sm:text-sm text-gray-400">
          {value.length} / {targetWord.length} {isSentence ? 'caracteres' : 'letras'}
        </span>
      </div>
    </div>
  );
}
