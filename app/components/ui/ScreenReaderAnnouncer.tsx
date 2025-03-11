'use client';

import React, { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message,
  politeness = 'polite',
  clearAfter = 5000,
}) => {
  const announcerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!message || !announcerRef.current) return;
    
    // Clear previous content
    announcerRef.current.textContent = '';
    
    // Use setTimeout to ensure the screen reader recognizes the change
    const timeoutId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
    
    // Clear the message after specified time
    const clearTimeoutId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, clearAfter);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(clearTimeoutId);
    };
  }, [message, clearAfter]);
  
  return (
    <div
      ref={announcerRef}
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  );
};

export default ScreenReaderAnnouncer;
