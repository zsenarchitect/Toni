import type { RecommendedService, RecommendedProduct } from '@/types';

// 示例服务列表 (沙龙可自定义)
export const defaultServices: RecommendedService[] = [
  {
    id: 'deep-treatment',
    name: '深层修护护理',
    price: 150,
    reason: '为受损发质补充蛋白质和水分，提升光泽度',
    effectPreview: {
      parameter: 'glossiness',
      boost: 40,
    },
  },
  {
    id: 'gloss-treatment',
    name: '光泽护理',
    price: 80,
    reason: '快速提升头发光泽，持续2-3周',
    effectPreview: {
      parameter: 'glossiness',
      boost: 25,
    },
  },
  {
    id: 'volume-treatment',
    name: '蓬松护理',
    price: 100,
    reason: '为细软发质增加蓬松感和支撑力',
    effectPreview: {
      parameter: 'volume',
      boost: 30,
    },
  },
  {
    id: 'color-protection',
    name: '染后护色',
    price: 120,
    reason: '锁住染发颜色，延长持色时间',
    effectPreview: {
      parameter: 'saturation',
      boost: 20,
    },
  },
  {
    id: 'smoothing-treatment',
    name: '柔顺护理',
    price: 180,
    reason: '告别毛躁，让头发丝滑顺服',
    effectPreview: {
      parameter: 'smoothness',
      boost: 50,
    },
  },
];

// 示例产品列表 (沙龙可自定义)
export const defaultProducts: RecommendedProduct[] = [
  {
    id: 'curl-mousse',
    name: '卷发定型慕斯',
    price: 45,
    usage: '烫发后日常造型，保持卷度定型',
  },
  {
    id: 'color-shampoo',
    name: '护色洗发水',
    price: 38,
    usage: '染发后使用，延长颜色持久度',
  },
  {
    id: 'heat-protector',
    name: '热护喷雾',
    price: 35,
    usage: '吹风/卷发前使用，保护发质',
  },
  {
    id: 'hair-oil',
    name: '护发精油',
    price: 52,
    usage: '日常使用，增加光泽减少毛躁',
  },
  {
    id: 'volume-powder',
    name: '蓬松粉',
    price: 28,
    usage: '发根使用，增加蓬松感',
  },
];

// 根据发型推荐服务
export function getRecommendedServicesForStyle(
  styleCategory: string,
  hasColor: boolean
): RecommendedService[] {
  const recommendations: RecommendedService[] = [];
  
  // 所有发型都可以推荐光泽护理
  recommendations.push(defaultServices.find(s => s.id === 'gloss-treatment')!);
  
  // 染发推荐护色
  if (hasColor) {
    recommendations.push(defaultServices.find(s => s.id === 'color-protection')!);
  }
  
  // 烫发推荐深层修护
  if (styleCategory === 'perm') {
    recommendations.push(defaultServices.find(s => s.id === 'deep-treatment')!);
  }
  
  return recommendations.filter(Boolean);
}

// 根据发型推荐产品
export function getRecommendedProductsForStyle(
  styleCategory: string,
  hasColor: boolean,
  hasPerm: boolean
): RecommendedProduct[] {
  const recommendations: RecommendedProduct[] = [];
  
  if (hasPerm) {
    recommendations.push(defaultProducts.find(p => p.id === 'curl-mousse')!);
  }
  
  if (hasColor) {
    recommendations.push(defaultProducts.find(p => p.id === 'color-shampoo')!);
  }
  
  // 通用推荐
  recommendations.push(defaultProducts.find(p => p.id === 'hair-oil')!);
  
  return recommendations.filter(Boolean);
}
