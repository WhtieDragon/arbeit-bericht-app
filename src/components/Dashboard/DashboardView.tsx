
import Statistics from './Statistics';
import NavigationButtons from './NavigationButtons';
import RecentReports from './RecentReports';

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

interface DashboardViewProps {
  reports: WorkReport[];
  totalHoursThisWeek: number;
  onCreateReport: () => void;
  onViewReports: () => void;
  onManageProjects: () => void;
  onManageColleagues: () => void;
  onManageWorksites: () => void;
}

const DashboardView = ({
  reports,
  totalHoursThisWeek,
  onCreateReport,
  onViewReports,
  onManageProjects,
  onManageColleagues,
  onManageWorksites
}: DashboardViewProps) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Arbeitsberichte</h1>
        <p className="text-gray-600">Verwalte deine täglichen Arbeitsberichte</p>
      </div>

      <Statistics reports={reports} totalHoursThisWeek={totalHoursThisWeek} />

      <NavigationButtons
        onCreateReport={onCreateReport}
        onViewReports={onViewReports}
        onManageProjects={onManageProjects}
        onManageColleagues={onManageColleagues}
        onManageWorksites={onManageWorksites}
        reportsCount={reports.length}
      />

      <RecentReports reports={reports} />
    </div>
  );
};

export default DashboardView;
