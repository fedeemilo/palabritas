'use client';

import { useState, useEffect } from 'react';

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Only run on client and mobile devices
    if (typeof window === 'undefined') return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const initialHeight = viewport.height;
    const threshold = 150; // Keyboard is likely open if viewport shrinks by this much

    const handleResize = () => {
      const heightDiff = initialHeight - viewport.height;
      setIsKeyboardVisible(heightDiff > threshold);
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardVisible;
}
