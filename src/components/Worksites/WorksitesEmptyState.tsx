
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface WorksitesEmptyStateProps {
  hasWorksites: boolean;
}

const WorksitesEmptyState = ({ hasWorksites }: WorksitesEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasWorksites ? 'Keine Baustellen gefunden' : 'Noch keine Baustellen'}
        </h3>
        <p className="text-gray-500">
          {hasWorksites 
            ? 'Versuche einen anderen Suchbegriff.' 
            : 'Füge deine ersten Baustellen hinzu.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default WorksitesEmptyState;
