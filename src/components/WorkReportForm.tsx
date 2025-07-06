
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkReportFormProps {
  onSave: (report: {
    date: string;
    startTime: string;
    endTime: string;
    project: string;
    description: string;
    hours: number;
  }) => void;
  onCancel: () => void;
}

const WorkReportForm = ({ onSave, onCancel }: WorkReportFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    project: '',
    description: '',
  });

  const calculateHours = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const hours = calculateHours(formData.startTime, formData.endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project.trim() || !formData.description.trim()) {
      alert('Bitte fülle alle Pflichtfelder aus');
      return;
    }

    onSave({
      ...formData,
      hours,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="mr-3 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Neuer Arbeitsbericht</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grunddaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Startzeit *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endTime">Endzeit *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">
                Gesamtarbeitszeit: {hours.toFixed(2)} Stunden
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projektdetails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project">Projekt/Kunde *</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                placeholder="z.B. Website Redesign für Firma XYZ"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Tätigkeitsbeschreibung *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Beschreibe deine ausgeführten Tätigkeiten..."
                required
                className="mt-1 min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkReportForm;
