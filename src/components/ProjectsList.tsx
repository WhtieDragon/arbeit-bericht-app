
import { useState } from 'react';
import { ArrowLeft, Plus, FolderOpen, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  name: string;
  description: string;
  defaultHours: number;
  createdAt: string;
}

interface ProjectsListProps {
  onBack: () => void;
}

const ProjectsList = ({ onBack }: ProjectsListProps) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultHours: 8
  });

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const addProject = () => {
    if (!formData.name.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      defaultHours: formData.defaultHours,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setFormData({ name: '', description: '', defaultHours: 8 });
    setShowAddForm(false);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    saveProjects(updatedProjects);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mr-3 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Wiederkehrende Projekte</h1>
      </div>

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Projekte durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Button 
          onClick={() => setShowAddForm(true)} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Projekt hinzufügen
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-sm text-gray-500">Gespeicherte Projekte</div>
          </div>
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {projects.length === 0 ? 'Noch keine Projekte' : 'Keine Projekte gefunden'}
            </h3>
            <p className="text-gray-500">
              {projects.length === 0 
                ? 'Füge deine wiederkehrenden Projekte hinzu.' 
                : 'Versuche einen anderen Suchbegriff.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-1">
                        {project.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Standard: {project.defaultHours}h
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Projekt löschen</DialogTitle>
                        <DialogDescription>
                          Möchtest du "{project.name}" wirklich aus der Projektliste entfernen?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Abbrechen</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => deleteProject(project.id)}
                        >
                          Löschen
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Projekt hinzufügen</DialogTitle>
            <DialogDescription>
              Füge ein wiederkehrendes Projekt zu deiner Liste hinzu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Projektname *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Website Wartung Kunde XYZ"
              />
            </div>
            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschreibung der wiederkehrenden Tätigkeiten..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="defaultHours">Standard-Arbeitszeit (Stunden)</Label>
              <Input
                id="defaultHours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={formData.defaultHours}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultHours: parseFloat(e.target.value) || 8 }))}
                placeholder="8"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Abbrechen
            </Button>
            <Button onClick={addProject} disabled={!formData.name.trim()}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsList;
