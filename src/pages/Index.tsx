
import { useState, useEffect } from 'react';
import WorkReportForm from '@/components/WorkReportForm';
import ReportsList from '@/components/ReportsList';
import ColleaguesList from '@/components/ColleaguesList';
import WorksitesList from '@/components/WorksitesList';
import ProjectsList from '@/components/ProjectsList';
import DashboardView from '@/components/Dashboard/DashboardView';
import DesignSettingsView from '@/components/DesignSettings/DesignSettingsView';

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
  breakMinutes?: number;
}

const Index = () => {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'list' | 'colleagues' | 'worksites' | 'projects' | 'design'>('dashboard');

  useEffect(() => {
    console.log('Index component mounted, activeView:', activeView);
    
    const savedReports = localStorage.getItem('workReports');
    if (savedReports) {
      try {
        const parsedReports = JSON.parse(savedReports);
        // Migration: Add missing fields to existing reports
        const migratedReports = parsedReports.map((report: any) => ({
          ...report,
          colleagues: report.colleagues || [],
          worksite: report.worksite || '',
          breakMinutes: report.breakMinutes || 0,
        }));
        setReports(migratedReports);
        
        // Save migrated data back to localStorage
        if (JSON.stringify(parsedReports) !== JSON.stringify(migratedReports)) {
          localStorage.setItem('workReports', JSON.stringify(migratedReports));
        }
      } catch (error) {
        console.error('Error parsing saved reports:', error);
        setReports([]);
      }
    }
  }, []);

  const saveReport = (report: Omit<WorkReport, 'id' | 'createdAt'>) => {
    console.log('Saving report:', report);
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

  const editReport = (updatedReport: WorkReport) => {
    console.log('Editing report:', updatedReport);
    const updatedReports = reports.map(report =>
      report.id === updatedReport.id ? updatedReport : report
    );
    setReports(updatedReports);
    localStorage.setItem('workReports', JSON.stringify(updatedReports));
  };

  const deleteReport = (id: string) => {
    console.log('Deleting report:', id);
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

  const handleViewChange = (view: typeof activeView) => {
    console.log('Changing view to:', view);
    setActiveView(view);
  };

  console.log('Rendering Index with activeView:', activeView);

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-md mx-auto theme-bg min-h-screen">
        <div className="p-6">
          {activeView === 'dashboard' && (
            <DashboardView
              reports={reports}
              totalHoursThisWeek={totalHoursThisWeek}
              onCreateReport={() => handleViewChange('create')}
              onViewReports={() => handleViewChange('list')}
              onManageProjects={() => handleViewChange('projects')}
              onManageColleagues={() => handleViewChange('colleagues')}
              onManageWorksites={() => handleViewChange('worksites')}
              onDesignSettings={() => handleViewChange('design')}
            />
          )}
          {activeView === 'create' && (
            <WorkReportForm 
              onSave={saveReport} 
              onCancel={() => handleViewChange('dashboard')} 
            />
          )}
          {activeView === 'list' && (
            <ReportsList 
              reports={reports} 
              onBack={() => handleViewChange('dashboard')}
              onDelete={deleteReport}
              onEdit={editReport}
            />
          )}
          {activeView === 'colleagues' && (
            <ColleaguesList 
              onBack={() => handleViewChange('dashboard')}
            />
          )}
          {activeView === 'worksites' && (
            <WorksitesList 
              onBack={() => handleViewChange('dashboard')}
            />
          )}
          {activeView === 'projects' && (
            <ProjectsList 
              onBack={() => handleViewChange('dashboard')}
            />
          )}
          {activeView === 'design' && (
            <DesignSettingsView 
              onBack={() => handleViewChange('dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
