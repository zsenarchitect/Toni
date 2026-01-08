// 沙龙主题配置类型

export interface SalonTheme {
  // 基础信息
  id: string;
  salonName: string;
  
  // Logo & 品牌
  branding: {
    logo?: string;
    logoPosition: 'left' | 'center';
    appName: string;
    tagline?: string;
    showPoweredBy: boolean;  // 是否显示 "Powered by MeRROR"
  };
  
  // 颜色系统
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    error: string;
  };
  
  // 字体
  typography: {
    fontFamily: string;
    headingFont?: string;
  };
  
  // 圆角
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  // 自定义CSS
  customCSS?: string;
}

// 主题预设类型
export type ThemePreset = 
  | 'classic-black-gold' 
  | 'modern-minimal' 
  | 'luxury-dark' 
  | 'soft-feminine' 
  | 'urban-industrial';

// 沙龙配置（包含主题）
export interface SalonConfig {
  slug: string;  // URL slug, e.g., "serge-normant"
  theme: SalonTheme;
  features: {
    enableWaitingMode: boolean;  // 等位区模式
    enableStylistRecommendations: boolean;
    enableUpsellSuggestions: boolean;
    customStylesOnly: boolean;  // 只显示沙龙自定义发型
  };
  customDomain?: string;  // 自定义域名
}
