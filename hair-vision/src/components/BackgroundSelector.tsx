'use client';

import { motion } from 'framer-motion';
import { Check, Building2, Sun, Camera, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Background } from '@/types';
import { backgrounds } from '@/data/backgrounds';

interface BackgroundSelectorProps {
  selectedBackground: Background;
  onSelect: (background: Background) => void;
  className?: string;
}

const backgroundIcons: Record<string, React.ReactNode> = {
  salon: <Building2 className="w-5 h-5" />,
  studio: <Camera className="w-5 h-5" />,
  outdoor: <Sun className="w-5 h-5" />,
  gradient: <Palette className="w-5 h-5" />,
};

const backgroundGradients: Record<string, string> = {
  salon: 'from-amber-100 to-orange-200',
  studio: 'from-gray-100 to-gray-200',
  outdoor: 'from-green-100 to-cyan-200',
  gradient: 'from-purple-100 to-pink-200',
};

export function BackgroundSelector({
  selectedBackground,
  onSelect,
  className,
}: BackgroundSelectorProps) {
  return (
    <div className={cn('flex gap-3 overflow-x-auto pb-2', className)}>
      {backgrounds.map((bg) => {
        const isSelected = selectedBackground.id === bg.id;

        return (
          <motion.button
            key={bg.id}
            onClick={() => onSelect(bg)}
            className="flex-shrink-0 flex flex-col items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={cn(
                'relative w-16 h-16 rounded-xl flex items-center justify-center transition-all',
                'bg-gradient-to-br',
                backgroundGradients[bg.value],
                isSelected
                  ? 'ring-2 ring-amber-500 ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
              )}
            >
              {backgroundIcons[bg.value]}
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            <span className="text-xs text-gray-600">{bg.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
