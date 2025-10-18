import { JobApplication } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MoreVertical, Edit2, Trash2, MapPin, DollarSign, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface JobApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  applied: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  interviewing: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  offer: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  accepted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function JobApplicationCard({ application, onEdit, onDelete }: JobApplicationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="truncate">{application.title}</h3>
            <p className="text-muted-foreground mt-1">{application.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors[application.status]}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(application)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(application.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Applied {formatDate(application.dateApplied)}</span>
        </div>
        {application.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{application.location}</span>
          </div>
        )}
        {application.salary && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{application.salary}</span>
          </div>
        )}
        {application.notes && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{application.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
