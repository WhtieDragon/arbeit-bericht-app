
import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, FileText, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'hours' | 'project'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'week' | 'month' | 'today'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const filterReports = (reports: WorkReport[]) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      
      switch (filterBy) {
        case 'today':
          return report.date === todayString;
        case 'week':
          const weekStart = getWeekStart(today);
          return reportDate >= weekStart && reportDate <= today;
        case 'month':
          const monthStart = getMonthStart(today);
          return reportDate >= monthStart && reportDate <= today;
        default:
          return true;
      }
    });
  };

  const searchReports = (reports: WorkReport[]) => {
    if (!searchTerm) return reports;
    
    return reports.filter(report =>
      report.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.date.includes(searchTerm)
    );
  };

  const sortReports = (reports: WorkReport[]) => {
    return [...reports].sort((a, b) => {
      switch (sortBy) {
        case 'hours':
          return b.hours - a.hours;
        case 'project':
          return a.project.localeCompare(b.project);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  };

  const processedReports = sortReports(searchReports(filterReports(reports)));
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalHours = processedReports.reduce((sum, report) => sum + report.hours, 0);

  const getFilterLabel = () => {
    switch (filterBy) {
      case 'today': return 'Heute';
      case 'week': return 'Diese Woche';
      case 'month': return 'Dieser Monat';
      default: return 'Alle';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Alle Berichte</h1>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Berichte durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter & Sortierung
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="filter">Zeitraum</Label>
                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Berichte</SelectItem>
                    <SelectItem value="today">Heute</SelectItem>
                    <SelectItem value="week">Diese Woche</SelectItem>
                    <SelectItem value="month">Dieser Monat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort">Sortieren nach</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Datum (neueste zuerst)</SelectItem>
                    <SelectItem value="hours">Stunden (meiste zuerst)</SelectItem>
                    <SelectItem value="project">Projekt (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{processedReports.length}</div>
              <div className="text-sm text-gray-500">{getFilterLabel()} • Berichte</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-500">{getFilterLabel()} • Stunden</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {processedReports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterBy !== 'all' 
                ? 'Keine Berichte gefunden' 
                : 'Noch keine Berichte'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterBy !== 'all'
                ? 'Versuche andere Suchbegriffe oder Filter.'
                : 'Erstelle deinen ersten Arbeitsbericht um loszulegen.'}
            </p>
            {(searchTerm || filterBy !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {processedReports.map((report) => (
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
