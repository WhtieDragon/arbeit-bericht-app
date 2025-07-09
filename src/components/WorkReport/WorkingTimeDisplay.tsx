
import { Clock } from 'lucide-react';

interface WorkingTimeDisplayProps {
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
}

const WorkingTimeDisplay = ({ startTime, endTime, breakMinutes, totalHours }: WorkingTimeDisplayProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-600">Arbeitszeit-Berechnung</span>
      </div>
      <div className="text-sm text-blue-700 space-y-1">
        <div>Arbeitszeit: {startTime} - {endTime}</div>
        {breakMinutes > 0 && (
          <div>Pausenzeit: {breakMinutes} Minuten</div>
        )}
        <div className="font-medium">Effektive Arbeitszeit: {totalHours.toFixed(2)} Stunden</div>
      </div>
    </div>
  );
};

export default WorkingTimeDisplay;
