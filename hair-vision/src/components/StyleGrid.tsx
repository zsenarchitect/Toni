'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import { Card } from './ui/Card';
import { Tabs } from './ui/Tabs';
import { cn } from '@/lib/utils';
import type { Hairstyle } from '@/types';
import { filterHairstyles } from '@/data/hairstyles';

interface StyleGridProps {
  selectedStyle: Hairstyle | null;
  onSelect: (style: Hairstyle) => void;
}

export function StyleGrid({ selectedStyle, onSelect }: StyleGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const categoryTabs = [
    { id: 'all', label: '全部' },
    { id: 'short', label: '短发' },
    { id: 'medium', label: '中发' },
    { id: 'long', label: '长发' },
  ];

  const genderTabs = [
    { id: 'all', label: '全部' },
    { id: 'female', label: '女士' },
    { id: 'male', label: '男士' },
  ];

  const filteredStyles = filterHairstyles(
    categoryFilter === 'all' ? undefined : (categoryFilter as Hairstyle['category']),
    genderFilter === 'all' ? undefined : (genderFilter as Hairstyle['gender'])
  );

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="space-y-3 mb-6">
        <Tabs
          tabs={genderTabs}
          activeTab={genderFilter}
          onChange={setGenderFilter}
        />
        <Tabs
          tabs={categoryTabs}
          activeTab={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StyleCard
                style={style}
                isSelected={selectedStyle?.id === style.id}
                onClick={() => onSelect(style)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StyleCardProps {
  style: Hairstyle;
  isSelected: boolean;
  onClick: () => void;
}

function StyleCard({ style, isSelected, onClick }: StyleCardProps) {
  // Generate a placeholder gradient for demo
  const gradientColors = [
    'from-amber-100 to-amber-200',
    'from-rose-100 to-rose-200',
    'from-violet-100 to-violet-200',
    'from-cyan-100 to-cyan-200',
    'from-emerald-100 to-emerald-200',
  ];
  const gradientIndex = style.id.charCodeAt(0) % gradientColors.length;

  return (
    <Card
      selected={isSelected}
      onClick={onClick}
      className="cursor-pointer overflow-hidden"
    >
      <div className="relative">
        {/* Image placeholder - will use real images in production */}
        <div className={cn(
          'aspect-[3/4] bg-gradient-to-br flex items-center justify-center',
          gradientColors[gradientIndex]
        )}>
          <span className="text-4xl">💇</span>
        </div>

        {/* Premium Badge */}
        {style.isPremium && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            高级
          </div>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 w-6 h-6 bg-black rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900">{style.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{style.nameEn}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {style.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
