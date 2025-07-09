
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface ColleaguesEmptyStateProps {
  hasColleagues: boolean;
}

const ColleaguesEmptyState = ({ hasColleagues }: ColleaguesEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasColleagues ? 'Keine Kollegen gefunden' : 'Noch keine Kollegen'}
        </h3>
        <p className="text-gray-500">
          {hasColleagues 
            ? 'Versuche einen anderen Suchbegriff.' 
            : 'Füge deine ersten Kollegen hinzu.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default ColleaguesEmptyState;
