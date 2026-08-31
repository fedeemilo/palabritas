'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'palabritas_show_image';

export function useShowImage() {
  const [enabled, setEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
    setIsLoaded(true);
  }, []);

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
