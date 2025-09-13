import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export function Mascot() {
  const [isWaving, setIsWaving] = useState(false);
  const [eyesBlink, setEyesBlink] = useState(false);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 3000);

    const blinkInterval = setInterval(() => {
      setEyesBlink(true);
      setTimeout(() => setEyesBlink(false), 150);
    }, 2000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div className="relative">
      {/* Bear Body */}
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full relative">
        {/* Ears */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-500 rounded-full" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full" />
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-300 rounded-full" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full" />
        
        {/* Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-2">
            <div className={`w-2 h-2 bg-gray-800 rounded-full transition-all duration-150 ${eyesBlink ? 'h-0.5' : ''}`} />
            <div className={`w-2 h-2 bg-gray-800 rounded-full transition-all duration-150 ${eyesBlink ? 'h-0.5' : ''}`} />
          </div>
        </div>
        
        {/* Nose */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-800 rounded-full" />
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-gray-800 rounded-full" />
      </div>
      
      {/* Waving Hand */}
      {isWaving && (
        <div className="absolute -top-2 -right-4 animate-bounce">
          <div className="w-4 h-4 bg-amber-400 rounded-full" />
        </div>
      )}
      
      {/* Speech Bubble */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg text-xs font-bold text-gray-700 whitespace-nowrap">
        Let's learn!
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
      </div>
      
      {/* Floating Hearts */}
      <div className="absolute -top-1 -right-1">
        <Heart className="w-3 h-3 text-pink-400 animate-pulse" />
      </div>
    </div>
  );
}