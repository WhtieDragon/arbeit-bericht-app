
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { defaultThemes } from '@/data/themes';

const ThemeSelector = () => {
  const { designSettings, updateTheme, currentTheme } = useTheme();
  const allThemes = [...defaultThemes, ...designSettings.customThemes];

  const ThemePreview = ({ theme, isActive, onClick }: any) => (
    <Card 
      className={`cursor-pointer transition-all hover:scale-105 ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{theme.name}</CardTitle>
          {isActive && <Check className="w-4 h-4 text-blue-500" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Color Preview */}
          <div className="flex space-x-1">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
          
          {/* Sample Card Preview */}
          <div 
            className="p-3 rounded text-xs"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderRadius: theme.borderRadius 
            }}
          >
            <div className="font-medium mb-1">Beispiel Karte</div>
            <div style={{ color: theme.colors.textSecondary }}>
              Sekundärer Text
            </div>
            <button
              className="mt-2 px-2 py-1 text-xs text-white rounded"
              style={{ 
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius 
              }}
            >
              Button
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Auswählen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm theme-text-secondary mb-4">
            Wähle ein vordefiniertes Theme oder erstelle ein eigenes Theme.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allThemes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isActive={currentTheme.id === theme.id}
                onClick={() => updateTheme(theme.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Theme Details */}
      <Card>
        <CardHeader>
          <CardTitle>Aktuelles Theme: {currentTheme.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Primärfarbe</div>
              <div 
                className="w-full h-12 rounded border"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div className="text-xs theme-text-secondary">
                {currentTheme.colors.primary}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Sekundärfarbe</div>
              <div 
                className="w-full h-12 rounded border"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <div className="text-xs theme-text-secondary">
                {currentTheme.colors.secondary}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Akzentfarbe</div>
              <div 
                className="w-full h-12 rounded border"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
              <div className="text-xs theme-text-secondary">
                {currentTheme.colors.accent}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Hintergrund</div>
              <div 
                className="w-full h-12 rounded border"
                style={{ backgroundColor: currentTheme.colors.background }}
              />
              <div className="text-xs theme-text-secondary">
                {currentTheme.colors.background}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSelector;
