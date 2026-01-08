import type { SalonTheme } from '@/types/theme';

// 默认主题 - 经典黑金
export const defaultTheme: SalonTheme = {
  id: 'default',
  salonName: 'MeRROR',
  branding: {
    logoPosition: 'left',
    appName: 'MeRROR',
    tagline: 'Salon Style Preview',
    showPoweredBy: false,
  },
  colors: {
    primary: '#000000',
    primaryLight: '#333333',
    primaryDark: '#000000',
    secondary: '#D4AF37',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E5E5E5',
    success: '#22C55E',
    error: '#EF4444',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};

// 现代极简
export const modernMinimal: SalonTheme = {
  ...defaultTheme,
  id: 'modern-minimal',
  colors: {
    ...defaultTheme.colors,
    primary: '#111111',
    primaryLight: '#444444',
    secondary: '#888888',
    background: '#FAFAFA',
    backgroundSecondary: '#F0F0F0',
    border: '#E0E0E0',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

// 奢华深色
export const luxuryDark: SalonTheme = {
  ...defaultTheme,
  id: 'luxury-dark',
  colors: {
    primary: '#C9A962',
    primaryLight: '#DFC88A',
    primaryDark: '#A68B4B',
    secondary: '#8B7355',
    background: '#1A1A1A',
    backgroundSecondary: '#2A2A2A',
    text: '#F5F5F5',
    textSecondary: '#CCCCCC',
    textMuted: '#888888',
    border: '#3A3A3A',
    success: '#4ADE80',
    error: '#F87171',
  },
};

// 柔和女性化
export const softFeminine: SalonTheme = {
  ...defaultTheme,
  id: 'soft-feminine',
  colors: {
    ...defaultTheme.colors,
    primary: '#B76E79',
    primaryLight: '#D4A5AC',
    primaryDark: '#9A5A64',
    secondary: '#E8D5D5',
    background: '#FDF8F8',
    backgroundSecondary: '#F8F0F0',
    border: '#EDE0E0',
  },
  typography: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
};

// 都市工业风
export const urbanIndustrial: SalonTheme = {
  ...defaultTheme,
  id: 'urban-industrial',
  colors: {
    ...defaultTheme.colors,
    primary: '#2D2D2D',
    primaryLight: '#4A4A4A',
    secondary: '#FF6B35',
    background: '#F5F5F5',
    backgroundSecondary: '#E8E8E8',
  },
  typography: {
    fontFamily: "'Space Grotesk', -apple-system, sans-serif",
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
  },
};

// 主题预设集合
export const themePresets = {
  'classic-black-gold': defaultTheme,
  'modern-minimal': modernMinimal,
  'luxury-dark': luxuryDark,
  'soft-feminine': softFeminine,
  'urban-industrial': urbanIndustrial,
};

// 创建沙龙定制主题
export function createSalonTheme(
  basePreset: keyof typeof themePresets,
  customization: {
    salonName: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  }
): SalonTheme {
  const base = themePresets[basePreset];
  
  return {
    ...base,
    id: `salon-${customization.salonName.toLowerCase().replace(/\s+/g, '-')}`,
    salonName: customization.salonName,
    branding: {
      ...base.branding,
      logo: customization.logo,
      appName: `${customization.salonName} Style Preview`,
      showPoweredBy: false,
    },
    colors: {
      ...base.colors,
      ...(customization.primaryColor && {
        primary: customization.primaryColor,
        primaryLight: lightenColor(customization.primaryColor, 20),
        primaryDark: darkenColor(customization.primaryColor, 20),
      }),
      ...(customization.secondaryColor && {
        secondary: customization.secondaryColor,
      }),
    },
    typography: {
      ...base.typography,
      ...(customization.fontFamily && {
        fontFamily: customization.fontFamily,
      }),
    },
  };
}

// 颜色工具函数
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
