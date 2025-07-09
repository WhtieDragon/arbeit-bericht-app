
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Coffee } from 'lucide-react';

interface BreakTimeInputProps {
  value: number;
  onChange: (minutes: number) => void;
}

const BreakTimeInput = ({ value, onChange }: BreakTimeInputProps) => {
  return (
    <div>
      <Label htmlFor="breakTime" className="flex items-center gap-2">
        <Coffee className="w-4 h-4" />
        Pausenzeit (Minuten)
      </Label>
      <Input
        id="breakTime"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="0"
        min="0"
        max="480"
        className="mt-1"
      />
    </div>
  );
};

export default BreakTimeInput;
