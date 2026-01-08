import type { HairColor } from '@/types';

export const hairColors: HairColor[] = [
  // 自然色系
  {
    id: 'natural-black',
    name: '自然黑',
    nameEn: 'Natural Black',
    hexCode: '#1a1a1a',
    category: 'natural',
    promptDescription: 'natural black hair color, deep and rich black with subtle shine',
  },
  {
    id: 'natural-dark-brown',
    name: '深棕色',
    nameEn: 'Dark Brown',
    hexCode: '#3d2314',
    category: 'natural',
    promptDescription: 'dark brown hair color, rich chocolate brown with warm undertones',
  },
  {
    id: 'natural-medium-brown',
    name: '中棕色',
    nameEn: 'Medium Brown',
    hexCode: '#5c4033',
    category: 'natural',
    promptDescription: 'medium brown hair color, natural chestnut brown with golden highlights',
  },
  {
    id: 'natural-light-brown',
    name: '浅棕色',
    nameEn: 'Light Brown',
    hexCode: '#8b7355',
    category: 'natural',
    promptDescription: 'light brown hair color, warm caramel brown with sun-kissed appearance',
  },
  {
    id: 'natural-blonde',
    name: '金色',
    nameEn: 'Blonde',
    hexCode: '#d4a84b',
    category: 'natural',
    promptDescription: 'natural blonde hair color, warm golden blonde with dimensional highlights',
  },
  {
    id: 'natural-auburn',
    name: '栗红色',
    nameEn: 'Auburn',
    hexCode: '#922724',
    category: 'natural',
    promptDescription: 'auburn hair color, rich reddish-brown with copper undertones',
  },
  {
    id: 'natural-ginger',
    name: '姜红色',
    nameEn: 'Ginger',
    hexCode: '#b5651d',
    category: 'natural',
    promptDescription: 'ginger red hair color, warm copper orange with natural variation',
  },
  // 时尚色系
  {
    id: 'fashion-ash-gray',
    name: '雾霾灰',
    nameEn: 'Ash Gray',
    hexCode: '#8e8e8e',
    category: 'fashion',
    promptDescription: 'ash gray hair color, cool-toned silver gray with smoky effect',
  },
  {
    id: 'fashion-silver',
    name: '银白色',
    nameEn: 'Silver',
    hexCode: '#c0c0c0',
    category: 'fashion',
    promptDescription: 'silver white hair color, bright metallic silver with platinum shine',
  },
  {
    id: 'fashion-platinum',
    name: '铂金色',
    nameEn: 'Platinum Blonde',
    hexCode: '#e5e4e2',
    category: 'fashion',
    promptDescription: 'platinum blonde hair color, very light icy blonde, almost white',
  },
  {
    id: 'fashion-rose-gold',
    name: '玫瑰金',
    nameEn: 'Rose Gold',
    hexCode: '#b76e79',
    category: 'fashion',
    promptDescription: 'rose gold hair color, soft pink with golden undertones, romantic and trendy',
  },
  {
    id: 'fashion-pink',
    name: '粉色',
    nameEn: 'Pink',
    hexCode: '#ff69b4',
    category: 'fashion',
    promptDescription: 'pastel pink hair color, soft bubblegum pink, playful and vibrant',
  },
  {
    id: 'fashion-lavender',
    name: '薰衣草紫',
    nameEn: 'Lavender',
    hexCode: '#b57edc',
    category: 'fashion',
    promptDescription: 'lavender purple hair color, soft pastel purple with ethereal quality',
  },
  {
    id: 'fashion-blue',
    name: '雾蓝色',
    nameEn: 'Dusty Blue',
    hexCode: '#6699cc',
    category: 'fashion',
    promptDescription: 'dusty blue hair color, muted steel blue with gray undertones',
  },
  {
    id: 'fashion-teal',
    name: '青色',
    nameEn: 'Teal',
    hexCode: '#008080',
    category: 'fashion',
    promptDescription: 'teal hair color, blue-green shade, ocean-inspired and unique',
  },
  {
    id: 'fashion-burgundy',
    name: '酒红色',
    nameEn: 'Burgundy',
    hexCode: '#800020',
    category: 'fashion',
    promptDescription: 'burgundy hair color, deep wine red, sophisticated and bold',
  },
  {
    id: 'fashion-red',
    name: '正红色',
    nameEn: 'Vivid Red',
    hexCode: '#ff0000',
    category: 'fashion',
    promptDescription: 'vivid red hair color, bright cherry red, bold and eye-catching',
  },
];

export function getColorById(id: string): HairColor | undefined {
  return hairColors.find((color) => color.id === id);
}

export function getColorsByCategory(category: HairColor['category']): HairColor[] {
  return hairColors.filter((color) => color.category === category);
}
