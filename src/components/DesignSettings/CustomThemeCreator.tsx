import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme, ThemeColors } from '@/types/theme';

const CustomThemeCreator = () => {
  const { designSettings, addCustomTheme, removeCustomTheme, updateTheme } = useTheme();
  const [isCreating, setIsCreating] = useState(false);
  
  const [newTheme, setNewTheme] = useState<Partial<Theme>>({
    name: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    borderRadius: '0.5rem',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  });

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setNewTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors!,
        [colorKey]: value
      }
    }));
  };

  const handleSaveTheme = () => {
    if (!newTheme.name || !newTheme.colors) {
      alert('Bitte gib einen Namen für das Theme ein');
      return;
    }

    const theme: Theme = {
      id: `custom-${Date.now()}`,
      name: newTheme.name,
      colors: newTheme.colors,
      borderRadius: newTheme.borderRadius!,
      typography: newTheme.typography!,
      spacing: newTheme.spacing!
    };

    addCustomTheme(theme);
    setIsCreating(false);
    setNewTheme({
      name: '',
      colors: {
        primary: '#3B82F6',
        secondary: '#6366F1',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: '0.5rem',
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
    });
  };

  const colorFields = [
    { key: 'primary' as const, label: 'Primärfarbe', description: 'Hauptfarbe für Buttons und Links' },
    { key: 'secondary' as const, label: 'Sekundärfarbe', description: 'Zweite Hauptfarbe' },
    { key: 'accent' as const, label: 'Akzentfarbe', description: 'Hervorhebungsfarbe' },
    { key: 'background' as const, label: 'Hintergrund', description: 'Haupthintergrundfarbe' },
    { key: 'surface' as const, label: 'Oberfläche', description: 'Kartenfarbe' },
    { key: 'text' as const, label: 'Textfarbe', description: 'Haupttextfarbe' },
    { key: 'textSecondary' as const, label: 'Sekundärer Text', description: 'Schwächere Textfarbe' },
    { key: 'border' as const, label: 'Rahmenfarbe', description: 'Farbe für Rahmen' },
    { key: 'success' as const, label: 'Erfolg', description: 'Erfolgsfarbe' },
    { key: 'warning' as const, label: 'Warnung', description: 'Warnfarbe' },
    { key: 'error' as const, label: 'Fehler', description: 'Fehlerfarbe' },
  ];

  return (
    <div className="space-y-6">
      {/* Existing Custom Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Eigene Themes
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Neues Theme
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {designSettings.customThemes.length === 0 ? (
            <p className="text-sm theme-text-secondary text-center py-8">
              Noch keine eigenen Themes erstellt. Klicke auf "Neues Theme" um anzufangen.
            </p>
          ) : (
            <div className="space-y-3">
              {designSettings.customThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3 theme-surface theme-rounded border theme-border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    <div>
                      <div className="font-medium theme-text">{theme.name}</div>
                      <div className="text-xs theme-text-secondary">Eigenes Theme</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateTheme(theme.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Palette className="w-4 h-4 mr-1" />
                      Verwenden
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm(`Theme "${theme.name}" wirklich löschen?`)) {
                          removeCustomTheme(theme.id);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme Creator */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Neues Theme erstellen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                value={newTheme.name || ''}
                onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mein eigenes Theme"
              />
            </div>

            <div>
              <Label>Border Radius</Label>
              <Select
                value={newTheme.borderRadius}
                onValueChange={(value) => setNewTheme(prev => ({ ...prev, borderRadius: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Eckig (0)</SelectItem>
                  <SelectItem value="0.25rem">Leicht rund (0.25rem)</SelectItem>
                  <SelectItem value="0.5rem">Normal rund (0.5rem)</SelectItem>
                  <SelectItem value="0.75rem">Rund (0.75rem)</SelectItem>
                  <SelectItem value="1rem">Sehr rund (1rem)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold">Farben</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {colorFields.map(({ key, label, description }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`color-${key}`} className="text-sm">
                      {label}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id={`color-${key}`}
                        type="color"
                        value={newTheme.colors?.[key] || '#000000'}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={newTheme.colors?.[key] || ''}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs theme-text-secondary">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-base font-semibold">Vorschau</Label>
              <div 
                className="mt-3 p-4 rounded border"
                style={{ 
                  backgroundColor: newTheme.colors?.surface,
                  borderRadius: newTheme.borderRadius,
                  borderColor: newTheme.colors?.border
                }}
              >
                <div 
                  className="font-medium mb-2"
                  style={{ color: newTheme.colors?.text }}
                >
                  Beispiel Karte
                </div>
                <div 
                  className="text-sm mb-3"
                  style={{ color: newTheme.colors?.textSecondary }}
                >
                  Das ist ein Beispieltext für das neue Theme
                </div>
                <button
                  className="px-3 py-1 text-sm text-white rounded"
                  style={{ 
                    backgroundColor: newTheme.colors?.primary,
                    borderRadius: newTheme.borderRadius 
                  }}
                >
                  Beispiel Button
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Abbrechen
              </Button>
              <Button onClick={handleSaveTheme}>
                <Save className="w-4 h-4 mr-2" />
                Theme speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomThemeCreator;
