import { createSalonTheme } from './presets';
import type { SalonConfig } from '@/types/theme';

// 演示用沙龙配置 - 用于销售拜访前准备

export const demoSalons: Record<string, SalonConfig> = {
  // Serge Normant at John Frieda - 经典高端
  'serge-normant': {
    slug: 'serge-normant',
    theme: createSalonTheme('classic-black-gold', {
      salonName: 'Serge Normant',
      primaryColor: '#1A1A1A',
      secondaryColor: '#C4A052',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }),
    features: {
      enableWaitingMode: true,
      enableStylistRecommendations: true,
      enableUpsellSuggestions: true,
      customStylesOnly: false,
    },
  },
  
  // Sally Hershberger - 现代极简
  'sally-hershberger': {
    slug: 'sally-hershberger',
    theme: createSalonTheme('modern-minimal', {
      salonName: 'Sally Hershberger',
      primaryColor: '#000000',
      secondaryColor: '#FF4444',
      fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
    }),
    features: {
      enableWaitingMode: true,
      enableStylistRecommendations: true,
      enableUpsellSuggestions: true,
      customStylesOnly: false,
    },
  },
  
  // Spoke & Weal - 都市工业风
  'spoke-weal': {
    slug: 'spoke-weal',
    theme: createSalonTheme('urban-industrial', {
      salonName: 'Spoke & Weal',
      primaryColor: '#2C2C2C',
      secondaryColor: '#E85D04',
    }),
    features: {
      enableWaitingMode: true,
      enableStylistRecommendations: true,
      enableUpsellSuggestions: true,
      customStylesOnly: false,
    },
  },
  
  // Bumble and bumble - 年轻时尚
  'bumble-bumble': {
    slug: 'bumble-bumble',
    theme: createSalonTheme('modern-minimal', {
      salonName: 'Bumble and bumble',
      primaryColor: '#000000',
      secondaryColor: '#FFD700',
      fontFamily: "'Futura', 'Trebuchet MS', sans-serif",
    }),
    features: {
      enableWaitingMode: true,
      enableStylistRecommendations: true,
      enableUpsellSuggestions: true,
      customStylesOnly: false,
    },
  },
  
  // 高端韩式沙龙示例
  'korean-beauty': {
    slug: 'korean-beauty',
    theme: createSalonTheme('soft-feminine', {
      salonName: 'Aura Beauty',
      primaryColor: '#9D7B6A',
      secondaryColor: '#E8D5D5',
      fontFamily: "'Noto Sans KR', sans-serif",
    }),
    features: {
      enableWaitingMode: true,
      enableStylistRecommendations: true,
      enableUpsellSuggestions: true,
      customStylesOnly: false,
    },
  },
};

// 获取沙龙配置
export function getSalonConfig(slug: string): SalonConfig | null {
  return demoSalons[slug] || null;
}

// 获取所有演示沙龙列表
export function getAllDemoSalons(): { slug: string; name: string }[] {
  return Object.entries(demoSalons).map(([slug, config]) => ({
    slug,
    name: config.theme.salonName,
  }));
}
