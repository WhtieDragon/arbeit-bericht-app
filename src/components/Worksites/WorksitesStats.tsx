
import { Card, CardContent } from "@/components/ui/card";

interface WorksitesStatsProps {
  totalCount: number;
}

const WorksitesStats = ({ totalCount }: WorksitesStatsProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-sm text-gray-500">Gesamt Baustellen</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorksitesStats;
