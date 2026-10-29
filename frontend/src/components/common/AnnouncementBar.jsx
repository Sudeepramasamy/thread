import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#101012] text-[#E6E2D8] text-xs font-medium tracking-widest uppercase py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center truncate">
          <span>Complimentary express delivery on orders over $300</span>
          <span className="hidden md:inline mx-3 text-[#6B6150]">•</span>
          <span className="hidden md:inline">Autumn / Winter Ready-to-Wear Now Live</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#B0A591] hover:text-white transition-colors p-1"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
