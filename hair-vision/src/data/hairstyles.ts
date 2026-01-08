import type { Hairstyle } from '@/types';

export const hairstyles: Hairstyle[] = [
  // 女士短发
  {
    id: 'f-short-bob',
    name: '经典波波头',
    nameEn: 'Classic Bob',
    description: '齐下巴的经典波波头，干练时尚',
    category: 'short',
    gender: 'female',
    thumbnail: '/hairstyles/f-short-bob.jpg',
    promptDescription: 'Classic bob cut that ends at the chin level, with clean straight edges, slightly layered for movement, sophisticated and polished look',
    tags: ['经典', '日常', '职业'],
    isPremium: false,
  },
  {
    id: 'f-short-pixie',
    name: '精灵短发',
    nameEn: 'Pixie Cut',
    description: '超短的精灵剪，个性十足',
    category: 'short',
    gender: 'female',
    thumbnail: '/hairstyles/f-short-pixie.jpg',
    promptDescription: 'Modern pixie cut with short sides, slightly longer textured top, edgy and stylish, emphasizing facial features',
    tags: ['个性', '时尚', '前卫'],
    isPremium: false,
  },
  {
    id: 'f-short-lob',
    name: '法式慵懒Bob',
    nameEn: 'French Lob',
    description: '略带卷度的法式中短发，随性优雅',
    category: 'short',
    gender: 'female',
    thumbnail: '/hairstyles/f-short-lob.jpg',
    promptDescription: 'French-style lob (long bob) with subtle waves, slightly tousled texture, effortlessly chic and romantic',
    tags: ['法式', '慵懒', '优雅'],
    isPremium: false,
  },
  // 女士中长发
  {
    id: 'f-medium-layers',
    name: '层次中长发',
    nameEn: 'Layered Medium',
    description: '有层次感的中长发，自然飘逸',
    category: 'medium',
    gender: 'female',
    thumbnail: '/hairstyles/f-medium-layers.jpg',
    promptDescription: 'Medium length hair with soft layers, face-framing pieces, natural movement and volume, versatile and flattering',
    tags: ['自然', '日常', '百搭'],
    isPremium: false,
  },
  {
    id: 'f-medium-curtain',
    name: '法式刘海',
    nameEn: 'Curtain Bangs',
    description: '中分帘式刘海配中长发，温柔气质',
    category: 'medium',
    gender: 'female',
    thumbnail: '/hairstyles/f-medium-curtain.jpg',
    promptDescription: 'Medium length hair with curtain bangs parted in the middle, soft face-framing layers, feminine and graceful',
    tags: ['温柔', '气质', '修颜'],
    isPremium: false,
  },
  {
    id: 'f-medium-wave',
    name: '韩式微卷',
    nameEn: 'Korean Soft Wave',
    description: '自然的S型微卷，韩系温柔风',
    category: 'medium',
    gender: 'female',
    thumbnail: '/hairstyles/f-medium-wave.jpg',
    promptDescription: 'Korean-style medium hair with soft S-waves, natural looking curls at the ends, glossy and healthy appearance',
    tags: ['韩系', '温柔', '减龄'],
    isPremium: false,
  },
  // 女士长发
  {
    id: 'f-long-straight',
    name: '黑长直',
    nameEn: 'Long Straight',
    description: '经典黑长直，清纯女神风',
    category: 'long',
    gender: 'female',
    thumbnail: '/hairstyles/f-long-straight.jpg',
    promptDescription: 'Long straight hair reaching past the shoulders, sleek and shiny, classic and elegant goddess look',
    tags: ['经典', '女神', '清纯'],
    isPremium: false,
  },
  {
    id: 'f-long-wave',
    name: '大波浪卷发',
    nameEn: 'Big Waves',
    description: '浪漫大波浪卷发，气场全开',
    category: 'long',
    gender: 'female',
    thumbnail: '/hairstyles/f-long-wave.jpg',
    promptDescription: 'Long hair with big glamorous waves, voluminous and bouncy, Hollywood-style sophisticated curls',
    tags: ['浪漫', '气场', '优雅'],
    isPremium: false,
  },
  {
    id: 'f-long-layered',
    name: '层次长发',
    nameEn: 'Long Layers',
    description: '有层次的长发，轻盈有动感',
    category: 'long',
    gender: 'female',
    thumbnail: '/hairstyles/f-long-layered.jpg',
    promptDescription: 'Long layered hair with face-framing pieces, lots of movement and dimension, modern and youthful',
    tags: ['层次', '动感', '年轻'],
    isPremium: false,
  },
  // 男士短发
  {
    id: 'm-short-fade',
    name: '渐变短发',
    nameEn: 'Fade Cut',
    description: '两侧渐变的经典男士短发',
    category: 'short',
    gender: 'male',
    thumbnail: '/hairstyles/m-short-fade.jpg',
    promptDescription: 'Classic fade haircut with shorter sides gradually blending to longer top, clean and professional look',
    tags: ['经典', '干练', '职业'],
    isPremium: false,
  },
  {
    id: 'm-short-textured',
    name: '纹理短发',
    nameEn: 'Textured Crop',
    description: '有纹理感的现代短发造型',
    category: 'short',
    gender: 'male',
    thumbnail: '/hairstyles/m-short-textured.jpg',
    promptDescription: 'Modern textured crop with choppy layers on top, natural messy texture, trendy and youthful',
    tags: ['时尚', '年轻', '潮流'],
    isPremium: false,
  },
  {
    id: 'm-short-buzz',
    name: '板寸头',
    nameEn: 'Buzz Cut',
    description: '清爽利落的极短发',
    category: 'short',
    gender: 'male',
    thumbnail: '/hairstyles/m-short-buzz.jpg',
    promptDescription: 'Very short buzz cut, uniform length all around, clean and low-maintenance, masculine look',
    tags: ['清爽', '硬朗', '简约'],
    isPremium: false,
  },
  // 男士中长发
  {
    id: 'm-medium-side',
    name: '侧分中长发',
    nameEn: 'Side Part',
    description: '经典侧分，商务精英风',
    category: 'medium',
    gender: 'male',
    thumbnail: '/hairstyles/m-medium-side.jpg',
    promptDescription: 'Classic side part hairstyle with medium length on top, slicked and polished, professional businessman look',
    tags: ['商务', '精英', '正式'],
    isPremium: false,
  },
  {
    id: 'm-medium-quiff',
    name: '飞机头',
    nameEn: 'Quiff',
    description: '前额蓬松的飞机头造型',
    category: 'medium',
    gender: 'male',
    thumbnail: '/hairstyles/m-medium-quiff.jpg',
    promptDescription: 'Modern quiff hairstyle with volume at the front, swept up and back, stylish and confident look',
    tags: ['时尚', '潮流', '自信'],
    isPremium: false,
  },
  {
    id: 'm-medium-korean',
    name: '韩式逗号刘海',
    nameEn: 'Korean Comma Hair',
    description: '韩式逗号刘海，温柔少年感',
    category: 'medium',
    gender: 'male',
    thumbnail: '/hairstyles/m-medium-korean.jpg',
    promptDescription: 'Korean-style comma bangs with soft curve at the forehead, natural and youthful, gentle appearance',
    tags: ['韩系', '温柔', '少年'],
    isPremium: false,
  },
  // 中性风格
  {
    id: 'u-mullet',
    name: '复古鲻鱼头',
    nameEn: 'Modern Mullet',
    description: '前短后长的现代鲻鱼头',
    category: 'medium',
    gender: 'unisex',
    thumbnail: '/hairstyles/u-mullet.jpg',
    promptDescription: 'Modern mullet hairstyle with shorter front and sides, longer in the back, edgy and retro-inspired',
    tags: ['复古', '个性', '前卫'],
    isPremium: true,
  },
  {
    id: 'u-shag',
    name: 'Shag发型',
    nameEn: 'Shag Cut',
    description: '70年代复古层次感发型',
    category: 'medium',
    gender: 'unisex',
    thumbnail: '/hairstyles/u-shag.jpg',
    promptDescription: '70s inspired shag haircut with lots of layers, feathered ends, rock and roll vibe, effortlessly cool',
    tags: ['复古', '摇滚', '层次'],
    isPremium: true,
  },
];

export function getHairstyleById(id: string): Hairstyle | undefined {
  return hairstyles.find((style) => style.id === id);
}

export function getHairstylesByCategory(category: Hairstyle['category']): Hairstyle[] {
  return hairstyles.filter((style) => style.category === category);
}

export function getHairstylesByGender(gender: Hairstyle['gender']): Hairstyle[] {
  return hairstyles.filter((style) => style.gender === gender || style.gender === 'unisex');
}

export function filterHairstyles(
  category?: Hairstyle['category'],
  gender?: Hairstyle['gender']
): Hairstyle[] {
  return hairstyles.filter((style) => {
    const categoryMatch = !category || style.category === category;
    const genderMatch = !gender || style.gender === gender || style.gender === 'unisex';
    return categoryMatch && genderMatch;
  });
}
