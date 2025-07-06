
import { useState } from 'react';
import { ArrowLeft, Plus, User, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Colleague {
  id: string;
  name: string;
  department: string;
  email: string;
  createdAt: string;
}

interface ColleaguesListProps {
  onBack: () => void;
}

const ColleaguesList = ({ onBack }: ColleaguesListProps) => {
  const [colleagues, setColleagues] = useState<Colleague[]>(() => {
    const saved = localStorage.getItem('colleagues');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: ''
  });

  const saveColleagues = (updatedColleagues: Colleague[]) => {
    setColleagues(updatedColleagues);
    localStorage.setItem('colleagues', JSON.stringify(updatedColleagues));
  };

  const addColleague = () => {
    if (!formData.name.trim()) return;

    const newColleague: Colleague = {
      id: Date.now().toString(),
      name: formData.name,
      department: formData.department,
      email: formData.email,
      createdAt: new Date().toISOString()
    };

    const updatedColleagues = [...colleagues, newColleague];
    saveColleagues(updatedColleagues);
    setFormData({ name: '', department: '', email: '' });
    setShowAddForm(false);
  };

  const deleteColleague = (id: string) => {
    const updatedColleagues = colleagues.filter(colleague => colleague.id !== id);
    saveColleagues(updatedColleagues);
  };

  const filteredColleagues = colleagues.filter(colleague =>
    colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colleague.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colleague.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">Kollegen</h1>
      </div>

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Kollegen durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Button 
          onClick={() => setShowAddForm(true)} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Kollegen hinzufügen
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{colleagues.length}</div>
            <div className="text-sm text-gray-500">Gesamt Kollegen</div>
          </div>
        </CardContent>
      </Card>

      {filteredColleagues.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {colleagues.length === 0 ? 'Noch keine Kollegen' : 'Keine Kollegen gefunden'}
            </h3>
            <p className="text-gray-500">
              {colleagues.length === 0 
                ? 'Füge deine ersten Kollegen hinzu.' 
                : 'Versuche einen anderen Suchbegriff.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredColleagues.map((colleague) => (
            <Card key={colleague.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {colleague.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {colleague.department}
                    </p>
                    <p className="text-sm text-gray-500">
                      {colleague.email}
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
                        <DialogTitle>Kollegen löschen</DialogTitle>
                        <DialogDescription>
                          Möchtest du {colleague.name} wirklich aus der Kollegenliste entfernen?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Abbrechen</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => deleteColleague(colleague.id)}
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

      {/* Add Colleague Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Kollegen hinzufügen</DialogTitle>
            <DialogDescription>
              Füge einen neuen Kollegen zu deiner Liste hinzu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Max Mustermann"
              />
            </div>
            <div>
              <Label htmlFor="department">Abteilung</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="IT, Marketing, etc."
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="max@firma.de"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Abbrechen
            </Button>
            <Button onClick={addColleague} disabled={!formData.name.trim()}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColleaguesList;
