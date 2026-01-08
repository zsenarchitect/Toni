'use client';

import { motion } from 'framer-motion';
import { Check, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HairColor } from '@/types';
import { getColorsByCategory } from '@/data/colors';

interface ColorPickerProps {
  selectedColor: HairColor | null;
  onSelect: (color: HairColor | null) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  const naturalColors = getColorsByCategory('natural');
  const fashionColors = getColorsByCategory('fashion');

  return (
    <div className="space-y-6">
      {/* Keep Original Option */}
      <motion.button
        onClick={() => onSelect(null)}
        className={cn(
          'w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all',
          selectedColor === null
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-200 hover:border-gray-300'
        )}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
          <Droplet className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-900">保持原发色</p>
          <p className="text-sm text-gray-500">不改变头发颜色</p>
        </div>
        {selectedColor === null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Natural Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">自然色系</h3>
        <div className="grid grid-cols-4 gap-3">
          {naturalColors.map((color) => (
            <ColorSwatch
              key={color.id}
              color={color}
              isSelected={selectedColor?.id === color.id}
              onClick={() => onSelect(color)}
            />
          ))}
        </div>
      </div>

      {/* Fashion Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">时尚色系</h3>
        <div className="grid grid-cols-4 gap-3">
          {fashionColors.map((color) => (
            <ColorSwatch
              key={color.id}
              color={color}
              isSelected={selectedColor?.id === color.id}
              onClick={() => onSelect(color)}
            />
          ))}
        </div>
      </div>

      {/* Selected Color Info */}
      {selectedColor && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: selectedColor.hexCode }}
            />
            <div>
              <p className="font-medium text-gray-900">{selectedColor.name}</p>
              <p className="text-sm text-gray-500">{selectedColor.nameEn}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ColorSwatchProps {
  color: HairColor;
  isSelected: boolean;
  onClick: () => void;
}

function ColorSwatch({ color, isSelected, onClick }: ColorSwatchProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-full transition-all relative',
          isSelected
            ? 'ring-2 ring-offset-2 ring-amber-500'
            : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
        )}
        style={{ backgroundColor: color.hexCode }}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className={cn(
              'w-5 h-5',
              isLightColor(color.hexCode) ? 'text-gray-800' : 'text-white'
            )} />
          </motion.div>
        )}
      </div>
      <span className="text-xs text-gray-600 truncate max-w-full">
        {color.name}
      </span>
    </motion.button>
  );
}

function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
