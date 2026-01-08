import type { Background } from '@/types';

export const backgrounds: Background[] = [
  {
    id: 'salon',
    name: '专业沙龙',
    value: 'salon',
    thumbnail: '/backgrounds/salon.jpg',
  },
  {
    id: 'studio',
    name: '白色背景',
    value: 'studio',
    thumbnail: '/backgrounds/studio.jpg',
  },
  {
    id: 'outdoor',
    name: '户外自然',
    value: 'outdoor',
    thumbnail: '/backgrounds/outdoor.jpg',
  },
  {
    id: 'gradient',
    name: '渐变背景',
    value: 'gradient',
    thumbnail: '/backgrounds/gradient.jpg',
  },
];

export function getBackgroundById(id: string): Background | undefined {
  return backgrounds.find((bg) => bg.id === id);
}
