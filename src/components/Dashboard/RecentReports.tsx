
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface RecentReportsProps {
  reports: WorkReport[];
}

const RecentReports = ({ reports }: RecentReportsProps) => {
  if (reports.length === 0) return null;

  return (
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
                <div className="text-sm text-gray-500">
                  {report.date} • {report.hours}h
                  {report.colleagues && report.colleagues.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      • {report.colleagues.length} Kollege{report.colleagues.length !== 1 ? 'n' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {report.startTime} - {report.endTime}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReports;
