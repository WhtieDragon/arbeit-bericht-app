
import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Worksite {
  id: string;
  name: string;
  address: string;
  description: string;
  createdAt: string;
}

interface WorksitesListProps {
  onBack: () => void;
}

const WorksitesList = ({ onBack }: WorksitesListProps) => {
  const [worksites, setWorksites] = useState<Worksite[]>(() => {
    const saved = localStorage.getItem('worksites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingWorksite, setEditingWorksite] = useState<Worksite | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: ''
  });

  const saveWorksites = (updatedWorksites: Worksite[]) => {
    setWorksites(updatedWorksites);
    localStorage.setItem('worksites', JSON.stringify(updatedWorksites));
  };

  const addWorksite = () => {
    if (!formData.name.trim()) return;

    const newWorksite: Worksite = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      description: formData.description,
      createdAt: new Date().toISOString()
    };

    const updatedWorksites = [...worksites, newWorksite];
    saveWorksites(updatedWorksites);
    setFormData({ name: '', address: '', description: '' });
    setShowAddForm(false);
  };

  const editWorksite = (worksite: Worksite) => {
    setEditingWorksite(worksite);
    setFormData({
      name: worksite.name,
      address: worksite.address,
      description: worksite.description
    });
    setShowEditForm(true);
  };

  const updateWorksite = () => {
    if (!formData.name.trim() || !editingWorksite) return;

    const updatedWorksites = worksites.map(worksite =>
      worksite.id === editingWorksite.id
        ? { ...worksite, name: formData.name, address: formData.address, description: formData.description }
        : worksite
    );

    saveWorksites(updatedWorksites);
    setFormData({ name: '', address: '', description: '' });
    setEditingWorksite(null);
    setShowEditForm(false);
  };

  const deleteWorksite = (id: string) => {
    const updatedWorksites = worksites.filter(worksite => worksite.id !== id);
    saveWorksites(updatedWorksites);
  };

  const filteredWorksites = worksites.filter(worksite =>
    worksite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worksite.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worksite.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">Baustellen</h1>
      </div>

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Baustellen durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Button 
          onClick={() => setShowAddForm(true)} 
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Baustelle hinzufügen
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{worksites.length}</div>
            <div className="text-sm text-gray-500">Gesamt Baustellen</div>
          </div>
        </CardContent>
      </Card>

      {filteredWorksites.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {worksites.length === 0 ? 'Noch keine Baustellen' : 'Keine Baustellen gefunden'}
            </h3>
            <p className="text-gray-500">
              {worksites.length === 0 
                ? 'Füge deine ersten Baustellen hinzu.' 
                : 'Versuche einen anderen Suchbegriff.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredWorksites.map((worksite) => (
            <Card key={worksite.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {worksite.name}
                    </h3>
                    {worksite.address && (
                      <p className="text-sm text-gray-600 mb-1">
                        {worksite.address}
                      </p>
                    )}
                    {worksite.description && (
                      <p className="text-sm text-gray-500">
                        {worksite.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editWorksite(worksite)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
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
                          <DialogTitle>Baustelle löschen</DialogTitle>
                          <DialogDescription>
                            Möchtest du {worksite.name} wirklich aus der Baustellenliste entfernen?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Abbrechen</Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => deleteWorksite(worksite.id)}
                          >
                            Löschen
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Worksite Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Baustelle hinzufügen</DialogTitle>
            <DialogDescription>
              Füge eine neue Baustelle zu deiner Liste hinzu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Hauptbaustelle Berlin"
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Musterstraße 123, 12345 Berlin"
              />
            </div>
            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Zusätzliche Informationen zur Baustelle"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Abbrechen
            </Button>
            <Button onClick={addWorksite} disabled={!formData.name.trim()}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Worksite Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baustelle bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Daten von {editingWorksite?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Hauptbaustelle Berlin"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Adresse</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Musterstraße 123, 12345 Berlin"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Beschreibung</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Zusätzliche Informationen zur Baustelle"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditForm(false)}>
              Abbrechen
            </Button>
            <Button onClick={updateWorksite} disabled={!formData.name.trim()}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorksitesList;
