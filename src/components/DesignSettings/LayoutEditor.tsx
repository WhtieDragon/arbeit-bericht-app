
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LayoutEditor = () => {
  const { designSettings, updateLayout } = useTheme();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleFieldVisibilityChange = (fieldId: string, visible: boolean) => {
    const updatedFields = designSettings.layout.formFields.map(field =>
      field.id === fieldId ? { ...field, visible } : field
    );
    
    updateLayout({
      ...designSettings.layout,
      formFields: updatedFields
    });
  };

  const handleFieldWidthChange = (fieldId: string, width: 'full' | 'half' | 'third') => {
    const updatedFields = designSettings.layout.formFields.map(field =>
      field.id === fieldId ? { ...field, width } : field
    );
    
    updateLayout({
      ...designSettings.layout,
      formFields: updatedFields
    });
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedItem(fieldId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetFieldId) return;

    const fields = [...designSettings.layout.formFields];
    const draggedIndex = fields.findIndex(f => f.id === draggedItem);
    const targetIndex = fields.findIndex(f => f.id === targetFieldId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove dragged item and insert at target position
      const [draggedField] = fields.splice(draggedIndex, 1);
      fields.splice(targetIndex, 0, draggedField);

      // Update order values
      const updatedFields = fields.map((field, index) => ({
        ...field,
        order: index + 1
      }));

      updateLayout({
        ...designSettings.layout,
        formFields: updatedFields
      });
    }

    setDraggedItem(null);
  };

  const sortedFields = [...designSettings.layout.formFields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formular Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm theme-text-secondary mb-4">
            Ziehe die Felder, um ihre Reihenfolge zu ändern, und passe ihre Eigenschaften an.
          </p>
          
          <div className="space-y-3">
            {sortedFields.map((field) => (
              <div
                key={field.id}
                draggable
                onDragStart={(e) => handleDragStart(e, field.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, field.id)}
                className={`flex items-center space-x-4 p-3 theme-surface theme-rounded border theme-border cursor-move hover:shadow-md transition-shadow ${
                  draggedItem === field.id ? 'opacity-50' : ''
                }`}
              >
                <GripVertical className="w-4 h-4 theme-text-secondary" />
                
                <div className="flex-1">
                  <div className="font-medium theme-text">{field.label}</div>
                  <div className="text-xs theme-text-secondary">{field.type}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {field.visible ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Switch
                      checked={field.visible}
                      onCheckedChange={(checked) => handleFieldVisibilityChange(field.id, checked)}
                    />
                  </div>

                  <Select
                    value={field.width}
                    onValueChange={(value: 'full' | 'half' | 'third') => 
                      handleFieldWidthChange(field.id, value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Voll</SelectItem>
                      <SelectItem value="half">Halb</SelectItem>
                      <SelectItem value="third">Drittel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm theme-text-secondary mb-4">
            Passe die Anordnung der Dashboard-Karten an.
          </p>
          
          <div className="space-y-3">
            {designSettings.layout.dashboardCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 theme-surface theme-rounded border theme-border"
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 theme-text-secondary" />
                  <div>
                    <div className="font-medium theme-text">{card.name}</div>
                    <div className="text-xs theme-text-secondary">Größe: {card.size}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={card.visible}
                    onCheckedChange={(checked) => {
                      const updatedCards = designSettings.layout.dashboardCards.map(c =>
                        c.id === card.id ? { ...c, visible: checked } : c
                      );
                      updateLayout({
                        ...designSettings.layout,
                        dashboardCards: updatedCards
                      });
                    }}
                  />
                  
                  <Select
                    value={card.size}
                    onValueChange={(value: 'small' | 'medium' | 'large') => {
                      const updatedCards = designSettings.layout.dashboardCards.map(c =>
                        c.id === card.id ? { ...c, size: value } : c
                      );
                      updateLayout({
                        ...designSettings.layout,
                        dashboardCards: updatedCards
                      });
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">S</SelectItem>
                      <SelectItem value="medium">M</SelectItem>
                      <SelectItem value="large">L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutEditor;
