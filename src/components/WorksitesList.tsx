
import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorksitesStats from './Worksites/WorksitesStats';
import WorksitesEmptyState from './Worksites/WorksitesEmptyState';
import WorksiteCard from './Worksites/WorksiteCard';
import WorksiteForm from './Worksites/WorksiteForm';

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

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setFormData({ name: '', address: '', description: '' });
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setFormData({ name: '', address: '', description: '' });
    setEditingWorksite(null);
  };

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

      <WorksitesStats totalCount={worksites.length} />

      {filteredWorksites.length === 0 ? (
        <WorksitesEmptyState hasWorksites={worksites.length > 0} />
      ) : (
        <div className="space-y-3">
          {filteredWorksites.map((worksite) => (
            <WorksiteCard
              key={worksite.id}
              worksite={worksite}
              onEdit={editWorksite}
              onDelete={deleteWorksite}
            />
          ))}
        </div>
      )}

      <WorksiteForm
        isOpen={showAddForm}
        onClose={handleCloseAddForm}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={addWorksite}
        title="Neue Baustelle hinzufügen"
        description="Füge eine neue Baustelle zu deiner Liste hinzu."
        submitLabel="Hinzufügen"
      />

      <WorksiteForm
        isOpen={showEditForm}
        onClose={handleCloseEditForm}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={updateWorksite}
        title="Baustelle bearbeiten"
        description=""
        submitLabel="Speichern"
        editingWorksite={editingWorksite}
      />
    </div>
  );
};

export default WorksitesList;
