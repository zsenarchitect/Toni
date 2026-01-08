'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import type { SalonTheme } from '@/types/theme';
import { defaultTheme } from '@/themes/presets';

interface ThemeContextValue {
  theme: SalonTheme;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  isDarkMode: false,
});

interface ThemeProviderProps {
  theme?: SalonTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  // 检测是否为深色主题
  const isDarkMode = useMemo(() => {
    const bgColor = theme.colors.background;
    const rgb = hexToRgb(bgColor);
    if (!rgb) return false;
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  }, [theme.colors.background]);

  // 注入CSS变量
  useEffect(() => {
    const root = document.documentElement;
    
    // 颜色变量
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-background-secondary', theme.colors.backgroundSecondary);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-error', theme.colors.error);
    
    // 字体变量
    root.style.setProperty('--theme-font-family', theme.typography.fontFamily);
    if (theme.typography.headingFont) {
      root.style.setProperty('--theme-font-heading', theme.typography.headingFont);
    }
    
    // 圆角变量
    root.style.setProperty('--theme-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--theme-radius-md', theme.borderRadius.md);
    root.style.setProperty('--theme-radius-lg', theme.borderRadius.lg);
    root.style.setProperty('--theme-radius-xl', theme.borderRadius.xl);
    
    // 加载Google字体（如果不是系统字体）
    const fontFamily = theme.typography.fontFamily;
    if (fontFamily && !fontFamily.includes('-apple-system') && !fontFamily.includes('sans-serif')) {
      const fontName = fontFamily.replace(/['"]/g, '').split(',')[0].trim();
      loadGoogleFont(fontName);
    }
    
    // 应用自定义CSS
    if (theme.customCSS) {
      let styleEl = document.getElementById('theme-custom-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = theme.customCSS;
    }
    
    return () => {
      // 清理
      const styleEl = document.getElementById('theme-custom-css');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode }}>
      <div 
        style={{ 
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// 工具函数
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function loadGoogleFont(fontName: string) {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  
  // 避免重复加载
  const existingLink = document.querySelector(`link[href*="${encodeURIComponent(fontName)}"]`);
  if (!existingLink) {
    document.head.appendChild(link);
  }
}
