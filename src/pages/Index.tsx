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
    const savedReports = localStorage.getItem('workReports');
    if (savedReports) {
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

  const editReport = (updatedReport: WorkReport) => {
    const updatedReports = reports.map(report =>
      report.id === updatedReport.id ? updatedReport : report
    );
    setReports(updatedReports);
    localStorage.setItem('workReports', JSON.stringify(updatedReports));
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

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-md mx-auto theme-bg min-h-screen">
        <div className="p-6">
          {activeView === 'dashboard' && (
            <DashboardView
              reports={reports}
              totalHoursThisWeek={totalHoursThisWeek}
              onCreateReport={() => setActiveView('create')}
              onViewReports={() => setActiveView('list')}
              onManageProjects={() => setActiveView('projects')}
              onManageColleagues={() => setActiveView('colleagues')}
              onManageWorksites={() => setActiveView('worksites')}
              onDesignSettings={() => setActiveView('design')}
            />
          )}
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
              onEdit={editReport}
            />
          )}
          {activeView === 'colleagues' && (
            <ColleaguesList 
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'worksites' && (
            <WorksitesList 
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'projects' && (
            <ProjectsList 
              onBack={() => setActiveView('dashboard')}
            />
          )}
          {activeView === 'design' && (
            <DesignSettingsView 
              onBack={() => setActiveView('dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
