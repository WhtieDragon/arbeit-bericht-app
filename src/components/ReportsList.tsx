
import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WorkReport {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  description: string;
  hours: number;
  createdAt: string;
}

interface ReportsListProps {
  reports: WorkReport[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const ReportsList = ({ reports, onBack, onDelete }: ReportsListProps) => {
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  const sortedReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalHours = reports.reduce((sum, report) => sum + report.hours, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Alle Berichte</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
              <div className="text-sm text-gray-500">Gesamt Berichte</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-500">Gesamt Stunden</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {sortedReports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Noch keine Berichte
            </h3>
            <p className="text-gray-500">
              Erstelle deinen ersten Arbeitsbericht um loszulegen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div 
                  className="space-y-3"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {report.project}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bericht löschen</DialogTitle>
                          <DialogDescription>
                            Möchtest du diesen Arbeitsbericht wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(report.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {report.startTime} - {report.endTime} ({report.hours.toFixed(1)}h)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedReport.project}</DialogTitle>
              <DialogDescription>
                Arbeitsbericht vom {formatDate(selectedReport.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Startzeit</div>
                  <div className="text-gray-600">{selectedReport.startTime}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Endzeit</div>
                  <div className="text-gray-600">{selectedReport.endTime}</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-1">Gesamtarbeitszeit</div>
                <div className="text-lg font-semibold text-blue-600">
                  {selectedReport.hours.toFixed(2)} Stunden
                </div>
              </div>
              
              <div>
                <div className="font-medium text-gray-900 mb-2">Tätigkeitsbeschreibung</div>
                <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {selectedReport.description}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReportsList;
