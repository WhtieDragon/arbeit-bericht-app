
import { FileText, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkReport {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  description: string;
  hours: number;
  createdAt: string;
  colleagues: any[];
  worksite: string;
}

interface StatisticsProps {
  reports: WorkReport[];
  totalHoursThisWeek: number;
}

const Statistics = ({ reports, totalHoursThisWeek }: StatisticsProps) => {
  const todayReports = reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  return (
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
          <div className="text-2xl font-bold text-purple-900">{todayReports}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
