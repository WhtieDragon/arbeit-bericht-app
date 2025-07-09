
import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColleagueCard from './Colleagues/ColleagueCard';
import ColleagueForm from './Colleagues/ColleagueForm';
import ColleaguesStats from './Colleagues/ColleaguesStats';
import ColleaguesEmptyState from './Colleagues/ColleaguesEmptyState';

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
  
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingColleague, setEditingColleague] = useState<Colleague | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const saveColleagues = (updatedColleagues: Colleague[]) => {
    setColleagues(updatedColleagues);
    localStorage.setItem('colleagues', JSON.stringify(updatedColleagues));
  };

  const handleAddColleague = () => {
    setFormMode('add');
    setEditingColleague(null);
    setShowForm(true);
  };

  const handleEditColleague = (colleague: Colleague) => {
    setFormMode('edit');
    setEditingColleague(colleague);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: { name: string; department: string; email: string }) => {
    if (formMode === 'add') {
      const newColleague: Colleague = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      saveColleagues([...colleagues, newColleague]);
    } else if (editingColleague) {
      const updatedColleagues = colleagues.map(colleague =>
        colleague.id === editingColleague.id
          ? { ...colleague, ...formData }
          : colleague
      );
      saveColleagues(updatedColleagues);
    }
    setShowForm(false);
  };

  const handleDeleteColleague = (id: string) => {
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
          onClick={handleAddColleague} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Kollegen hinzufügen
        </Button>
      </div>

      <ColleaguesStats totalCount={colleagues.length} />

      {filteredColleagues.length === 0 ? (
        <ColleaguesEmptyState hasColleagues={colleagues.length > 0} />
      ) : (
        <div className="space-y-3">
          {filteredColleagues.map((colleague) => (
            <ColleagueCard
              key={colleague.id}
              colleague={colleague}
              onEdit={handleEditColleague}
              onDelete={handleDeleteColleague}
            />
          ))}
        </div>
      )}

      <ColleagueForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        colleague={editingColleague}
        mode={formMode}
      />
    </div>
  );
};

export default ColleaguesList;
