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

// 多角度照片输入类型 (V1.5)
export interface MultiAnglePhotos {
  front: string; // 正面照片（必需）
  left45?: string; // 左侧45度照片（可选）
  right45?: string; // 右侧45度照片（可选）
  back?: string; // 背面照片（可选）
}

// 图像分辨率类型 (成本优化)
export type ImageResolution = '1K' | '2K' | '4K';

// 订阅套餐类型
export type SubscriptionTier = 'essential' | 'professional' | 'enterprise';

// 模型类型 (用于降级策略)
export type GeminiModel = 'gemini-3.0-pro-image-generation' | 'gemini-2.0-flash-preview-image-generation';

// 信用系统
export interface CreditBalance {
  salonId: string;
  subscriptionTier: SubscriptionTier;
  baseCredits: number; // 套餐包含的基础信用
  usedCredits: number; // 已使用的信用
  purchasedCredits: number; // 额外购买的信用
  overageCredits: number; // 超出的信用（负数余额，用于后续计费）
  resetDate: Date; // 信用重置日期 (通常是每月1号)
  lastUpdated: Date;
}

// 信用使用记录
export interface CreditUsage {
  id: string;
  salonId: string;
  generationId?: string;
  creditsUsed: number;
  model: GeminiModel;
  resolution: ImageResolution;
  timestamp: Date;
  cost: number; // 实际成本
}

// 订阅套餐配置
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number;
  baseCredits: number; // 每月包含的信用
  payAsYouGoPrice: number; // 超出后的单价 (每信用)
  features: string[];
  freeTrialDays: number; // 免费试用天数
}

// 生成请求
export interface GenerateRequest {
  photo: string; // base64 (向后兼容，单张照片)
  multiAnglePhotos?: MultiAnglePhotos; // V1.5: 多角度照片（如果提供，优先使用）
  styleId: string;
  colorId?: string;
  viewAngle: ViewAngle;
  backgroundId: string;
  resolution?: ImageResolution; // 可选，默认从环境变量读取
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

// ============================================
// 沙龙定制化 & 增值服务功能
// ============================================

// 沙龙自定义发型
export interface SalonCustomStyle extends Hairstyle {
  salonId: string;
  isSignature: boolean;  // 是否为招牌项目
  recommendedServices: RecommendedService[];
  recommendedProducts: RecommendedProduct[];
}

// 推荐服务
export interface RecommendedService {
  id: string;
  name: string;
  price: number;
  reason: string;  // 推荐理由，用于展示
  effectPreview?: {
    parameter: 'glossiness' | 'volume' | 'smoothness' | 'saturation';
    boost: number;  // 效果提升百分比
  };
}

// 推荐产品
export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  usage: string;  // 使用场景描述
  imageUrl?: string;
}

// 造型师推荐
export interface StylistRecommendation {
  styleId: string;
  reason: string;  // 推荐理由
  priority: number;  // 优先级，1最高
}

// 效果对比模式
export interface EffectComparison {
  baseResult: string;  // 基础效果图
  upgradedResult: string;  // 升级后效果图
  baseService: {
    name: string;
    price: number;
  };
  upgradedService: {
    name: string;
    price: number;
    additions: string[];  // 增加的服务项
  };
}

// 参数化调整
export interface StyleParameters {
  // 长度调整
  lengthAdjustment: number;  // -5 到 +5 cm
  bangsLength: 'none' | 'above-brow' | 'brow' | 'eye' | 'longer';
  
  // 层次
  layerIntensity: number;  // 0-100
  
  // 烫发
  curlSize: 'straight' | 'slight' | 'medium' | 'large' | 'tight';
  
  // 染发
  colorBrightness: number;  // -50 到 +50
  
  // 质感
  glossiness: number;  // 0-100
  volume: number;  // 0-100
}

// 沙龙配置
export interface SalonConfig {
  id: string;
  name: string;
  logo?: string;
  customStyles: SalonCustomStyle[];
  services: RecommendedService[];
  products: RecommendedProduct[];
  settings: {
    showSystemStyles: boolean;  // 是否显示系统发型
    prioritizeSignature: boolean;  // 招牌优先显示
    enableUpsellSuggestions: boolean;  // 启用升级建议
  };
}
