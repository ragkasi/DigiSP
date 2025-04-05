
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { VideoRecorder } from "./VideoRecorder";
import { SheetMusicViewer } from "./SheetMusicViewer";
import { 
  Video, 
  ArrowLeft, 
  Play, 
  PlusCircle, 
  Save,
  MessageSquare
} from "lucide-react";
import { Project, PracticeSong, Mentor, ProjectTake } from "@/types";
import { format } from "date-fns";
import { 
  addProjectTake,
  addFeedback,
  updateProjectStatus,
  updateProjectReflection,
  PRACTICE_SONGS
} from "@/services/mockData";
import { toast } from "sonner";

export interface ProjectDetailProps {
  project: Project;
  mentor?: Mentor | null;
  isMentor?: boolean;
  mentorId?: number;
  onBack: () => void;
  onRefresh: () => void;
}

export function ProjectDetail({ project, mentor, isMentor, mentorId, onBack, onRefresh }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTake, setSelectedTake] = useState<ProjectTake | null>(
    project.takes.length > 0 ? project.takes[project.takes.length - 1] : null
  );
  const [reflection, setReflection] = useState(project.reflection || "");
  const [status, setStatus] = useState(project.status);
  
  const song = PRACTICE_SONGS.find(
    s => s.sheetMusicUrl === project.sheetMusicUrl
  ) as PracticeSong;
  
  const handleStartRecording = () => {
    setActiveTab("record");
    setIsRecording(true);
  };
  
  const handleRecordingComplete = (videoUrl: string) => {
    const newTake = addProjectTake(project.id, { videoUrl });
    setIsRecording(false);
    onRefresh();
    toast.success("Take recorded successfully!");
  };
  
  const handleAddFeedback = (takeId: number, measureNumber: number, comment: string) => {
    if (!mentor && !mentorId) return;
    
    addFeedback(takeId, project.id, {
      takeId,
      mentorId: mentor?.id || mentorId || 0,
      measureNumber,
      comment,
      resolved: false
    });
    
    onRefresh();
    toast.success("Feedback added successfully!");
  };
  
  const handleSaveReflection = () => {
    updateProjectReflection(project.id, reflection);
    toast.success("Reflection saved successfully!");
    onRefresh();
  };
  
  const handleUpdateStatus = (newStatus: typeof status) => {
    updateProjectStatus(project.id, newStatus);
    setStatus(newStatus);
    toast.success(`Project status updated to ${newStatus}`);
    onRefresh();
  };

  // Use either isMentor prop or check if mentor exists to determine if we're in mentor mode
  const isInMentorMode = isMentor !== undefined ? isMentor : !!mentor;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Projects</span>
        </button>
        
        <Badge
          className={
            status === "Mastered"
              ? "bg-green-100 text-green-800"
              : status === "Needs Work"
              ? "bg-amber-100 text-amber-800"
              : status === "In Progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {status}
        </Badge>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">{project.instrument}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="takes">Takes ({project.takes.length})</TabsTrigger>
          {!isInMentorMode && <TabsTrigger value="record">Record</TabsTrigger>}
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Sheet Music</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <img 
                  src={project.sheetMusicUrl} 
                  alt={`Sheet music for ${project.title}`} 
                  className="w-full"
                />
              </div>
              
              {!isInMentorMode && (
                <div className="mt-4">
                  <Button onClick={handleStartRecording}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Record New Take
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Latest Take</h3>
              {selectedTake ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <p className="text-sm text-gray-500">
                        Recorded on {format(new Date(selectedTake.recordedAt), "MMMM d, yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <video 
                        src={selectedTake.videoUrl}
                        controls
                        className="w-full rounded"
                      />
                      
                      {selectedTake.feedback && selectedTake.feedback.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </h4>
                          
                          <div className="space-y-2">
                            {selectedTake.feedback.map((item, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-md text-sm">
                                {item.measureNumber && (
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mb-1">
                                    Measure {item.measureNumber}
                                  </span>
                                )}
                                <p>{item.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {!isInMentorMode && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleStartRecording}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Record New Take
                      </Button>
                      
                      <Button 
                        variant={status === "Mastered" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleUpdateStatus("Mastered")}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Mark as Mastered
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border p-6 text-center">
                  <p className="text-gray-500 mb-4">No takes recorded yet</p>
                  {!isInMentorMode && (
                    <Button onClick={handleStartRecording}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Record First Take
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="takes" className="pt-4">
          <h3 className="text-lg font-medium mb-3">All Takes</h3>
          
          {project.takes.length > 0 ? (
            <div className="space-y-4">
              {project.takes.map((take, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">
                        Take #{index + 1} - {format(new Date(take.recordedAt), "MMMM d, yyyy")}
                      </p>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedTake(take)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <video 
                        src={take.videoUrl}
                        controls
                        className="w-full rounded"
                      />
                      
                      <div>
                        {isInMentorMode && (
                          <div className="mb-4">
                            <SheetMusicViewer 
                              sheetMusicUrl={project.sheetMusicUrl}
                              songTitle={project.title}
                              onAddFeedback={(measureNumber, comment) => 
                                handleAddFeedback(take.id, measureNumber, comment)
                              }
                            />
                          </div>
                        )}
                        
                        {take.feedback && take.feedback.length > 0 ? (
                          <div className="space-y-2 mt-4">
                            <h4 className="text-sm font-medium">Feedback:</h4>
                            {take.feedback.map((item, idx) => (
                              <div key={idx} className="p-3 bg-gray-50 rounded-md text-sm">
                                {item.measureNumber && (
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mb-1">
                                    Measure {item.measureNumber}
                                  </span>
                                )}
                                <p>{item.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          isInMentorMode && (
                            <p className="text-gray-500 text-sm mt-4">
                              Click on the sheet music to leave feedback
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6 text-center">
              <p className="text-gray-500 mb-4">No takes recorded yet</p>
              {!isInMentorMode && (
                <Button onClick={handleStartRecording}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Record First Take
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="record" className="pt-4">
          {isRecording && song && (
            <div>
              <h3 className="text-lg font-medium mb-3">Record Your Performance</h3>
              <VideoRecorder 
                song={song}
                onRecordingComplete={handleRecordingComplete}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reflection" className="pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Your Reflection</h3>
              <p className="text-gray-500 text-sm mb-4">
                Reflect on your progress and what you've learned from this piece
              </p>
              
              <Textarea
                placeholder="Write your reflections here..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={6}
                className="w-full"
                disabled={isInMentorMode}
              />
              
              {!isInMentorMode && (
                <Button
                  className="mt-3"
                  onClick={handleSaveReflection}
                  disabled={!reflection.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Reflection
                </Button>
              )}
            </div>
            
            {!isInMentorMode && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Project Status</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Update your project status based on your progress
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {["In Progress", "Needs Work", "Mastered"].map((statusOption) => (
                    <Button
                      key={statusOption}
                      variant={status === statusOption ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(statusOption as any)}
                    >
                      {statusOption}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
