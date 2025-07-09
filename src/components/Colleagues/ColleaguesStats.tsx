
import { Card, CardContent } from "@/components/ui/card";

interface ColleaguesStatsProps {
  totalCount: number;
}

const ColleaguesStats = ({ totalCount }: ColleaguesStatsProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-sm text-gray-500">Gesamt Kollegen</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColleaguesStats;
