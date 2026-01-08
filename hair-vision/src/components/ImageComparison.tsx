'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function ImageComparison({ beforeImage, afterImage, className }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-2xl select-none', className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After Image (Full) */}
      <img
        src={afterImage}
        alt="After"
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
        原图
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 text-white text-sm rounded-full backdrop-blur-sm">
        效果
      </div>
    </div>
  );
}

// Simple toggle comparison (no slider)
interface ToggleComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function ToggleComparison({ beforeImage, afterImage, className }: ToggleComparisonProps) {
  const [showBefore, setShowBefore] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <motion.img
        src={showBefore ? beforeImage : afterImage}
        alt={showBefore ? 'Before' : 'After'}
        className="w-full h-full object-cover rounded-2xl"
        initial={false}
        animate={{ opacity: 1 }}
        key={showBefore ? 'before' : 'after'}
      />
      
      <button
        onMouseDown={() => setShowBefore(true)}
        onMouseUp={() => setShowBefore(false)}
        onMouseLeave={() => setShowBefore(false)}
        onTouchStart={() => setShowBefore(true)}
        onTouchEnd={() => setShowBefore(false)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg"
      >
        {showBefore ? '显示效果图' : '按住查看原图'}
      </button>
    </div>
  );
}
