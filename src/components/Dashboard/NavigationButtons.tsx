
import { Plus, FileText, FolderOpen, Users, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onCreateReport: () => void;
  onViewReports: () => void;
  onManageProjects: () => void;
  onManageColleagues: () => void;
  onManageWorksites: () => void;
  reportsCount: number;
}

const NavigationButtons = ({ 
  onCreateReport, 
  onViewReports, 
  onManageProjects, 
  onManageColleagues, 
  onManageWorksites, 
  reportsCount 
}: NavigationButtonsProps) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onCreateReport} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Neuen Bericht erstellen
      </Button>

      <Button 
        onClick={onViewReports} 
        variant="outline" 
        className="w-full py-6 text-lg border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <FileText className="w-5 h-5 mr-2" />
        Alle Berichte anzeigen ({reportsCount})
      </Button>

      <Button 
        onClick={onManageProjects} 
        variant="outline" 
        className="w-full py-6 text-lg border-purple-200 text-purple-700 hover:bg-purple-50"
      >
        <FolderOpen className="w-5 h-5 mr-2" />
        Wiederkehrende Projekte
      </Button>

      <Button 
        onClick={onManageColleagues} 
        variant="outline" 
        className="w-full py-6 text-lg border-green-200 text-green-700 hover:bg-green-50"
      >
        <Users className="w-5 h-5 mr-2" />
        Kollegenliste verwalten
      </Button>

      <Button 
        onClick={onManageWorksites} 
        variant="outline" 
        className="w-full py-6 text-lg border-orange-200 text-orange-700 hover:bg-orange-50"
      >
        <MapPin className="w-5 h-5 mr-2" />
        Baustellenliste verwalten
      </Button>
    </div>
  );
};

export default NavigationButtons;
