
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Colleague {
  id: string;
  name: string;
  department: string;
  email: string;
  createdAt: string;
}

interface ColleagueCardProps {
  colleague: Colleague;
  onEdit: (colleague: Colleague) => void;
  onDelete: (id: string) => void;
}

const ColleagueCard = ({ colleague, onEdit, onDelete }: ColleagueCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {colleague.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {colleague.department}
            </p>
            <p className="text-sm text-gray-500">
              {colleague.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(colleague)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kollegen löschen</DialogTitle>
                  <DialogDescription>
                    Möchtest du {colleague.name} wirklich aus der Kollegenliste entfernen?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Abbrechen</Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => onDelete(colleague.id)}
                  >
                    Löschen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColleagueCard;
