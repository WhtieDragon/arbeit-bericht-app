
import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkReportForm from '@/components/WorkReportForm';
import ReportsList from '@/components/ReportsList';

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

const Index = () => {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'list'>('dashboard');

  useEffect(() => {
    const savedReports = localStorage.getItem('workReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const saveReport = (report: Omit<WorkReport, 'id' | 'createdAt'>) => {
    const newReport: WorkReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('workReports', JSON.stringify(updatedReports));
    setActiveView('dashboard');
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('workReports', JSON.stringify(updatedReports));
  };

  const totalHoursThisWeek = reports
    .filter(report => {
      const reportDate = new Date(report.date);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return reportDate >= weekStart;
    })
    .reduce((sum, report) => sum + report.hours, 0);

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Arbeitsberichte</h1>
        <p className="text-gray-600">Verwalte deine täglichen Arbeitsberichte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Gesamt Berichte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{reports.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Diese Woche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalHoursThisWeek.toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Heute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={() => setActiveView('create')} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Neuen Bericht erstellen
        </Button>

        <Button 
          onClick={() => setActiveView('list')} 
          variant="outline" 
          className="w-full py-6 text-lg border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <FileText className="w-5 h-5 mr-2" />
          Alle Berichte anzeigen ({reports.length})
        </Button>
      </div>

      {reports.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Letzte Berichte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(-3).reverse().map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{report.project}</div>
                    <div className="text-sm text-gray-500">{report.date} • {report.hours}h</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {report.startTime} - {report.endTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'create' && (
            <WorkReportForm 
              onSave={saveReport} 
              onCancel={() => setActiveView('dashboard')} 
            />
          )}
          {activeView === 'list' && (
            <ReportsList 
              reports={reports} 
              onBack={() => setActiveView('dashboard')}
              onDelete={deleteReport}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
