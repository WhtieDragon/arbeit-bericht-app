
import React, { useState } from 'react';
import { ArrowLeft, Palette, Layout, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';
import LayoutEditor from './LayoutEditor';
import CustomThemeCreator from './CustomThemeCreator';

interface DesignSettingsViewProps {
  onBack: () => void;
}

const DesignSettingsView = ({ onBack }: DesignSettingsViewProps) => {
  const { resetToDefaults } = useTheme();
  const [activeTab, setActiveTab] = useState<'themes' | 'layout' | 'custom'>('themes');

  const handleReset = () => {
    if (confirm('Möchtest du wirklich alle Design-Einstellungen zurücksetzen?')) {
      resetToDefaults();
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold theme-text">Design-Einstellungen</h1>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Zurücksetzen
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 theme-surface theme-rounded p-1">
        <Button
          variant={activeTab === 'themes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('themes')}
          className="flex-1"
          size="sm"
        >
          <Palette className="w-4 h-4 mr-2" />
          Themes
        </Button>
        <Button
          variant={activeTab === 'layout' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('layout')}
          className="flex-1"
          size="sm"
        >
          <Layout className="w-4 h-4 mr-2" />
          Layout
        </Button>
        <Button
          variant={activeTab === 'custom' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('custom')}
          className="flex-1"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Eigene Themes
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'themes' && <ThemeSelector />}
        {activeTab === 'layout' && <LayoutEditor />}
        {activeTab === 'custom' && <CustomThemeCreator />}
      </div>
    </div>
  );
};

export default DesignSettingsView;
