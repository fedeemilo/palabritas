'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'palabritas_zen';

export function useZenMode() {
  const [enabled, setEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
    setIsLoaded(true);
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled, isLoaded]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  return { enabled, toggle, isLoaded };
}
