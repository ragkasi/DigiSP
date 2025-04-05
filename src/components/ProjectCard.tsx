
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle,
  PlusCircle
} from "lucide-react";
import { Project, ProjectStatus, PracticeSong } from "@/types";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onViewProject: (projectId: number) => void;
  onCreateTake?: (projectId: number) => void;
}

export function ProjectCard({ project, onViewProject, onCreateTake }: ProjectCardProps) {
  // Helper function to get status color
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-200 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Needs Work":
        return "bg-amber-100 text-amber-800";
      case "Mastered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Check if the project has any takes
  const hasTakes = project.takes.length > 0;
  
  // Calculate progress metrics
  const totalFeedbackItems = project.takes.reduce((acc, take) => {
    return acc + (take.feedback?.length || 0);
  }, 0);
  
  const resolvedFeedbackItems = project.takes.reduce((acc, take) => {
    return acc + (take.feedback?.filter(f => f.resolved)?.length || 0);
  }, 0);
  
  const progressPercentage = totalFeedbackItems > 0
    ? Math.round((resolvedFeedbackItems / totalFeedbackItems) * 100)
    : hasTakes ? 50 : 0;

  const latestTakeDate = hasTakes 
    ? format(new Date(project.takes[project.takes.length - 1].recordedAt), "MMM d, yyyy")
    : null;

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <CardHeader className={`p-4 ${getStatusColor(project.status)} bg-opacity-20`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              <Music className="h-3 w-3" />
              <span>{project.instrument}</span>
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  progressPercentage >= 100
                    ? 'bg-green-500'
                    : progressPercentage > 30
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-1 text-gray-500" />
              <span>{project.takes.length} {project.takes.length === 1 ? 'take' : 'takes'}</span>
            </div>
            
            {latestTakeDate && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>{latestTakeDate}</span>
              </div>
            )}
            
            {totalFeedbackItems > 0 && (
              <div className="flex items-center">
                {resolvedFeedbackItems === totalFeedbackItems ? (
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                )}
                <span>
                  {resolvedFeedbackItems}/{totalFeedbackItems} notes addressed
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => onViewProject(project.id)}
        >
          <PlayCircle className="h-4 w-4 mr-1" />
          View Project
        </Button>
        
        {onCreateTake && (
          <Button 
            variant="outline"
            onClick={() => onCreateTake(project.id)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            New Take
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
