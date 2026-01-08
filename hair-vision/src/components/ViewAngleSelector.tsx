'use client';

import { motion } from 'framer-motion';
import { User, UserCircle, CircleUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewAngle } from '@/types';

interface ViewAngleSelectorProps {
  selectedAngle: ViewAngle;
  onSelect: (angle: ViewAngle) => void;
  generatedAngles?: ViewAngle[];
  className?: string;
}

const angles: { value: ViewAngle; label: string; icon: React.ReactNode }[] = [
  { value: 'front', label: '正面', icon: <User className="w-5 h-5" /> },
  { value: 'side', label: '侧面', icon: <UserCircle className="w-5 h-5" /> },
  { value: 'back', label: '背面', icon: <CircleUser className="w-5 h-5" /> },
];

export function ViewAngleSelector({
  selectedAngle,
  onSelect,
  generatedAngles = [],
  className,
}: ViewAngleSelectorProps) {
  return (
    <div className={cn('flex justify-center gap-2', className)}>
      {angles.map((angle) => {
        const isGenerated = generatedAngles.includes(angle.value);
        const isSelected = selectedAngle === angle.value;

        return (
          <motion.button
            key={angle.value}
            onClick={() => onSelect(angle.value)}
            className={cn(
              'relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all',
              isSelected
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            whileTap={{ scale: 0.95 }}
          >
            {angle.icon}
            <span className="text-xs font-medium">{angle.label}</span>
            
            {/* Generated indicator */}
            {isGenerated && !isSelected && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
