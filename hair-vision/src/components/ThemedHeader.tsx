'use client';

import { useTheme } from './ThemeProvider';
import { Scissors } from 'lucide-react';

interface ThemedHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export function ThemedHeader({ showBack, onBack, title, subtitle }: ThemedHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <header 
      className="px-6 pt-8 pb-6"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        {theme.branding.logo ? (
          <img 
            src={theme.branding.logo} 
            alt={theme.salonName}
            className="h-10 w-auto"
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Scissors 
              className="w-6 h-6" 
              style={{ color: theme.colors.secondary }}
            />
          </div>
        )}
        
        {/* Text */}
        <div>
          <h1 
            className="text-2xl font-bold"
            style={{ 
              color: theme.colors.text,
              fontFamily: theme.typography.headingFont || theme.typography.fontFamily,
            }}
          >
            {title || theme.branding.appName}
          </h1>
          {(subtitle || theme.branding.tagline) && (
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {subtitle || theme.branding.tagline}
            </p>
          )}
        </div>
      </div>
      
      {/* Powered by (可选) */}
      {theme.branding.showPoweredBy && (
        <p 
          className="text-xs mt-4 opacity-50"
          style={{ color: theme.colors.textMuted }}
        >
          Powered by MeRROR
        </p>
      )}
    </header>
  );
}
