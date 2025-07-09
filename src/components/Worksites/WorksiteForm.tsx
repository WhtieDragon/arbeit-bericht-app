
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Worksite {
  id: string;
  name: string;
  address: string;
  description: string;
  createdAt: string;
}

interface FormData {
  name: string;
  address: string;
  description: string;
}

interface WorksiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: () => void;
  title: string;
  description: string;
  submitLabel: string;
  editingWorksite?: Worksite | null;
}

const WorksiteForm = ({ 
  isOpen, 
  onClose, 
  formData, 
  onFormDataChange, 
  onSubmit, 
  title, 
  description, 
  submitLabel,
  editingWorksite 
}: WorksiteFormProps) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {editingWorksite ? `Bearbeite die Daten von ${editingWorksite.name}.` : description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="z.B. Hauptbaustelle Berlin"
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Musterstraße 123, 12345 Berlin"
            />
          </div>
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Zusätzliche Informationen zur Baustelle"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={onSubmit} disabled={!formData.name.trim()}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorksiteForm;
