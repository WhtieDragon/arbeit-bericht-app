
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, DesignSettings, LayoutConfig } from '@/types/theme';
import { defaultThemes, defaultLayoutConfig } from '@/data/themes';

interface ThemeContextType {
  currentTheme: Theme;
  designSettings: DesignSettings;
  updateTheme: (themeId: string) => void;
  updateLayout: (layout: LayoutConfig) => void;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (themeId: string) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designSettings, setDesignSettings] = useState<DesignSettings>(() => {
    const saved = localStorage.getItem('designSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to parse saved design settings:', error);
      }
    }
    return {
      activeTheme: 'modern-blue',
      layout: defaultLayoutConfig,
      customThemes: [],
    };
  });

  const currentTheme = React.useMemo(() => {
    const allThemes = [...defaultThemes, ...designSettings.customThemes];
    return allThemes.find(theme => theme.id === designSettings.activeTheme) || defaultThemes[0];
  }, [designSettings.activeTheme, designSettings.customThemes]);

  useEffect(() => {
    localStorage.setItem('designSettings', JSON.stringify(designSettings));
    
    // Apply theme variables to CSS
    const root = document.documentElement;
    const theme = currentTheme;
    
    // Update CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-warning', theme.colors.warning);
    root.style.setProperty('--theme-error', theme.colors.error);
    root.style.setProperty('--theme-border-radius', theme.borderRadius);
    root.style.setProperty('--theme-font-family', theme.typography.fontFamily);
  }, [currentTheme, designSettings]);

  const updateTheme = (themeId: string) => {
    setDesignSettings(prev => ({
      ...prev,
      activeTheme: themeId,
    }));
  };

  const updateLayout = (layout: LayoutConfig) => {
    setDesignSettings(prev => ({
      ...prev,
      layout,
    }));
  };

  const addCustomTheme = (theme: Theme) => {
    setDesignSettings(prev => ({
      ...prev,
      customThemes: [...prev.customThemes, theme],
    }));
  };

  const removeCustomTheme = (themeId: string) => {
    setDesignSettings(prev => ({
      ...prev,
      customThemes: prev.customThemes.filter(theme => theme.id !== themeId),
      activeTheme: prev.activeTheme === themeId ? 'modern-blue' : prev.activeTheme,
    }));
  };

  const resetToDefaults = () => {
    setDesignSettings({
      activeTheme: 'modern-blue',
      layout: defaultLayoutConfig,
      customThemes: [],
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        designSettings,
        updateTheme,
        updateLayout,
        addCustomTheme,
        removeCustomTheme,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
