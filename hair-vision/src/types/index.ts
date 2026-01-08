// 发型类型
export interface Hairstyle {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: 'short' | 'medium' | 'long';
  gender: 'male' | 'female' | 'unisex';
  thumbnail: string;
  promptDescription: string;
  tags: string[];
  isPremium: boolean;
}

// 发色类型
export interface HairColor {
  id: string;
  name: string;
  nameEn: string;
  hexCode: string;
  category: 'natural' | 'fashion';
  promptDescription: string;
}

// 背景类型
export interface Background {
  id: string;
  name: string;
  value: string;
  thumbnail?: string;
}

// 视角类型
export type ViewAngle = 'front' | 'side' | 'back';

// 生成请求
export interface GenerateRequest {
  photo: string; // base64
  styleId: string;
  colorId?: string;
  viewAngle: ViewAngle;
  backgroundId: string;
}

// 生成结果
export interface GenerationResult {
  id: string;
  originalPhoto: string;
  resultPhoto: string;
  style: Hairstyle;
  color?: HairColor;
  viewAngle: ViewAngle;
  background: Background;
  createdAt: Date;
}

// 会话状态
export interface SessionState {
  currentPhoto: string | null;
  selectedStyle: Hairstyle | null;
  selectedColor: HairColor | null;
  selectedBackground: Background | null;
  selectedViewAngle: ViewAngle;
  generatedResults: Map<ViewAngle, string>;
  isGenerating: boolean;
}
