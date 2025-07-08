
import { useState } from 'react';
import { ArrowLeft, FileText, Calendar, Clock, Users, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReportEditDialog from './ReportEditDialog';

interface Colleague {
  id: string;
  name: string;
  department: string;
  email: string;
  createdAt: string;
}

interface WorkReport {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  description: string;
  hours: number;
  createdAt: string;
  colleagues: Colleague[];
  worksite: string;
}

interface ReportsListProps {
  reports: WorkReport[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onEdit?: (updatedReport: WorkReport) => void;
}

const ReportsList = ({ reports, onBack, onDelete, onEdit }: ReportsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReport, setEditingReport] = useState<WorkReport | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditReport = (report: WorkReport) => {
    setEditingReport(report);
    setShowEditDialog(true);
  };

  const handleSaveReport = (updatedReport: WorkReport) => {
    if (onEdit) {
      onEdit(updatedReport);
    }
    setEditingReport(null);
    setShowEditDialog(false);
  };

  const filteredReports = reports.filter(report =>
    report.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.worksite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.colleagues.some(colleague => 
      colleague.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    new Date(report.date).toLocaleDateString().includes(searchTerm)
  );

  const totalHours = filteredReports.reduce((sum, report) => sum + report.hours, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Arbeitsberichte</h1>
      </div>

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Berichte durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredReports.length}</div>
                <div className="text-sm text-gray-500">
                  {searchTerm ? 'Gefundene Berichte' : 'Gesamt Berichte'}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">
                  {searchTerm ? 'Gefilterte Stunden' : 'Gesamt Stunden'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reports.length === 0 ? 'Noch keine Berichte' : 'Keine Berichte gefunden'}
            </h3>
            <p className="text-gray-500">
              {reports.length === 0 
                ? 'Erstelle deinen ersten Arbeitsbericht.' 
                : 'Versuche einen anderen Suchbegriff.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{report.project}</h3>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {report.startTime} - {report.endTime} ({report.hours.toFixed(1)}h)
                      </div>
                      {report.worksite && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {report.worksite}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{report.description}</p>

                    {report.colleagues && report.colleagues.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {report.colleagues.map((colleague) => (
                            <Badge key={colleague.id} variant="secondary" className="text-xs">
                              {colleague.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReport(report)}
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
                          <DialogTitle>Bericht löschen</DialogTitle>
                          <DialogDescription>
                            Möchtest du den Arbeitsbericht für "{report.project}" vom {new Date(report.date).toLocaleDateString()} wirklich löschen?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Abbrechen</Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => onDelete(report.id)}
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

      {editingReport && (
        <ReportEditDialog
          report={editingReport}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleSaveReport}
        />
      )}
    </div>
  );
};

export default ReportsList;
