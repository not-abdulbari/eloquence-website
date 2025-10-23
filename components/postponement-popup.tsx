'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PostponementPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show on first visit only (optional)
    const shown = localStorage.getItem('eloquence25PostponementShown');
    if (!shown) {
      setIsVisible(true);
      localStorage.setItem('eloquence25PostponementShown', 'true');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 p-6 sm:p-8 rounded-xl border bg-card text-card-foreground shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-background hover:bg-accent transition-colors"
          aria-label="Close announcement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6 text-center">
          {/* Logo */}
          <img
            src="/cahcet-logo.webp"
            alt="CAHCET College logo"
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-md border bg-card p-1"
          />

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-4">
            IMPORTANT ANNOUNCEMENT
          </h2>

          {/* Message */}
          <p className="text-base sm:text-lg leading-relaxed mt-4">
            Due to the scheduling of <strong>Anna University Practical Examinations</strong>, we regret to inform you that 
            <strong> Eloquence'25 — the 8th National Level Technical Symposium</strong> has been postponed until further notice.
          </p>

          <p className="text-base sm:text-lg opacity-90 mt-2">
            An official circular will be released soon, and our symposium coordinators will contact all registered participants with further updates.
          </p>

          <p className="text-sm opacity-75 mt-4">
            We sincerely apologize for any inconvenience caused and appreciate your understanding.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setIsVisible(false)}
              className="w-full sm:w-auto color-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              I Understand
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
}