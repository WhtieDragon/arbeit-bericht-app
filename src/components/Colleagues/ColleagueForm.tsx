
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Colleague {
  id: string;
  name: string;
  department: string;
  email: string;
  createdAt: string;
}

interface ColleagueFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; department: string; email: string }) => void;
  colleague?: Colleague | null;
  mode: 'add' | 'edit';
}

const ColleagueForm = ({ isOpen, onClose, onSubmit, colleague, mode }: ColleagueFormProps) => {
  const [formData, setFormData] = useState({
    name: colleague?.name || '',
    department: colleague?.department || '',
    email: colleague?.email || ''
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onSubmit(formData);
    setFormData({ name: '', department: '', email: '' });
  };

  const handleClose = () => {
    setFormData({ name: '', department: '', email: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Neuen Kollegen hinzufügen' : `Kollegen bearbeiten`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Füge einen neuen Kollegen zu deiner Liste hinzu.'
              : `Bearbeite die Daten von ${colleague?.name}.`
            }
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
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            {mode === 'add' ? 'Hinzufügen' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColleagueForm;
