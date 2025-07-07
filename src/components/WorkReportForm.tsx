import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Colleague {
  id: string;
  name: string;
  department: string;
  email: string;
  createdAt: string;
}

interface Worksite {
  id: string;
  name: string;
  address: string;
  description: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  defaultHours: number;
  createdAt: string;
}

interface WorkReportFormProps {
  onSave: (report: {
    date: string;
    startTime: string;
    endTime: string;
    project: string;
    description: string;
    hours: number;
    colleagues: Colleague[];
    worksite: string;
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
    worksite: '',
  });

  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedColleagues, setSelectedColleagues] = useState<Colleague[]>([]);

  useEffect(() => {
    const savedColleagues = localStorage.getItem('colleagues');
    if (savedColleagues) {
      setColleagues(JSON.parse(savedColleagues));
    }

    const savedWorksites = localStorage.getItem('worksites');
    if (savedWorksites) {
      setWorksites(JSON.parse(savedWorksites));
    }

    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

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
      colleagues: selectedColleagues,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleColleague = (colleague: Colleague) => {
    setSelectedColleagues(prev => {
      const isSelected = prev.find(c => c.id === colleague.id);
      if (isSelected) {
        return prev.filter(c => c.id !== colleague.id);
      } else {
        return [...prev, colleague];
      }
    });
  };

  const handleProjectSelect = (projectId: string) => {
    if (projectId === 'custom') {
      setFormData(prev => ({ ...prev, project: '', description: '' }));
    } else {
      const selectedProject = projects.find(p => p.id === projectId);
      if (selectedProject) {
        const defaultEndTime = calculateEndTimeFromHours(formData.startTime, selectedProject.defaultHours);
        setFormData(prev => ({ 
          ...prev, 
          project: selectedProject.name,
          description: selectedProject.description,
          endTime: defaultEndTime
        }));
      }
    }
  };

  const calculateEndTimeFromHours = (startTime: string, hours: number) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalMinutes = startHour * 60 + startMinute + hours * 60;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  const handleWorksiteSelect = (worksiteId: string) => {
    if (worksiteId === 'custom') {
      setFormData(prev => ({ ...prev, worksite: '' }));
    } else {
      const selectedWorksite = worksites.find(w => w.id === worksiteId);
      if (selectedWorksite) {
        setFormData(prev => ({ ...prev, worksite: selectedWorksite.name }));
      }
    }
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
              <div className="space-y-2">
                {projects.length > 0 && (
                  <Select onValueChange={handleProjectSelect}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Gespeichertes Projekt wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="custom">Eigene Eingabe</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name} ({project.defaultHours}h)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  placeholder="z.B. Website Redesign für Firma XYZ"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="worksite">Baustelle/Arbeitsort</Label>
              <div className="space-y-2">
                {worksites.length > 0 && (
                  <Select onValueChange={handleWorksiteSelect}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Gespeicherte Baustelle wählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="custom">Eigene Eingabe</SelectItem>
                      {worksites.map((worksite) => (
                        <SelectItem key={worksite.id} value={worksite.id}>
                          {worksite.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Input
                  id="worksite"
                  value={formData.worksite}
                  onChange={(e) => handleInputChange('worksite', e.target.value)}
                  placeholder="z.B. Hauptbaustelle Berlin, Büro Hamburg"
                  className="mt-1"
                />
              </div>
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

        {colleagues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Kollegen für diesen Tag
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {colleagues.map((colleague) => (
                  <div
                    key={colleague.id}
                    onClick={() => toggleColleague(colleague)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedColleagues.find(c => c.id === colleague.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{colleague.name}</div>
                    <div className="text-sm text-gray-500">{colleague.department}</div>
                  </div>
                ))}
              </div>

              {selectedColleagues.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ausgewählte Kollegen ({selectedColleagues.length}):
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedColleagues.map((colleague) => (
                      <Badge
                        key={colleague.id}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {colleague.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
