import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ExternalLink, Music, RefreshCcw, Video } from "lucide-react";
import { Project, Session, Mentor } from "@/types";
import { MENTORS, PROJECTS } from "@/services/mockData";
import { format } from "date-fns";
import { ProjectDetail } from "@/components/ProjectDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MentorDashboard = () => {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(0);
  
  useEffect(() => {
    if (MENTORS.length > 0) {
      setMentor(MENTORS.find(m => m.approved) || MENTORS[0]);
    }
  }, []);
  
  useEffect(() => {
    if (mentor) {
      const mockSessions: Session[] = [];
      
      for (let i = 1; i <= 5; i++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + i);
        
        mockSessions.push({
          id: i,
          mentorId: mentor.id,
          studentId: (i % 5) + 1,
          instrument: mentor.instrument as any,
          date: sessionDate,
          startTime: `${15 + i}:00`,
          endTime: `${15 + i}:30`,
          zoomLink: "https://zoom.us/j/123456789"
        });
      }
      
      setSessions(mockSessions);
    }
  }, [mentor]);
  
  useEffect(() => {
    setProjects(PROJECTS);
  }, [refresh]);
  
  const getStudentNameById = (id: number) => {
    return `Student ${id}`;
  };
  
  const handleCancelSession = (sessionId: number) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    toast(`Session ${sessionId} cancelled`);
  };
  
  const handleRefreshProjects = () => {
    setRefresh(prev => prev + 1);
    toast("Projects refreshed");
  };
  
  const handleViewProject = (projectId: number) => {
    setSelectedProjectId(projectId);
  };
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
        <NavBar />
        <main className="container max-w-6xl py-12 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Mentor Dashboard</h1>
            <p className="text-gray-600">Please sign up as a mentor first.</p>
            <Button className="mt-4" onClick={() => window.location.href = "/mentor/signup"}>
              Sign Up
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
      <NavBar />
      
      <main className="container max-w-6xl py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Mentor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mentor.name}!</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
              <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{mentor.name}</p>
              <Badge variant="outline">{mentor.instrument}</Badge>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="sessions">
          <TabsList className="mb-6">
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="projects">Projects to Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions" className="space-y-8">
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => {
                  const studentName = getStudentNameById(session.studentId);
                  
                  return (
                    <Card key={session.id} className="overflow-hidden border-symphoni-primary/30">
                      <CardHeader className="bg-symphoni-primary/10 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Session with {studentName}</h3>
                          <Badge variant="outline">{session.instrument}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {session.date instanceof Date 
                              ? format(session.date, "EEEE, MMMM d, yyyy") 
                              : session.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{session.startTime} - {session.endTime}</span>
                        </div>
                        {session.zoomLink && (
                          <a 
                            href={session.zoomLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-symphoni-secondary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Join Zoom Session</span>
                          </a>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          variant="outline" 
                          className="text-destructive hover:bg-destructive/10 w-full"
                          onClick={() => handleCancelSession(session.id)}
                        >
                          Cancel Session
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">No upcoming sessions scheduled.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Projects to Review</h2>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefreshProjects}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            {projects.filter(p => p.takes.length > 0).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(project => project.takes.length > 0)
                  .map(project => {
                    const hasUnreviewedTakes = project.takes.some(take => 
                      !take.feedback || take.feedback.length === 0
                    );
                    
                    return (
                      <Card 
                        key={project.id} 
                        className={`overflow-hidden ${hasUnreviewedTakes ? 'border-symphoni-primary' : ''}`}
                      >
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-gray-500">
                                Student: {getStudentNameById(project.studentId)}
                              </p>
                            </div>
                            <Badge variant={hasUnreviewedTakes ? "default" : "outline"}>
                              {hasUnreviewedTakes ? 'New' : 'Reviewed'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Music className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{project.instrument}</span>
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Takes:</span> {project.takes.length}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            className="w-full"
                            variant={hasUnreviewedTakes ? "default" : "outline"}
                            onClick={() => handleViewProject(project.id)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            {hasUnreviewedTakes ? 'Review Project' : 'View Project'}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">No projects to review.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog 
        open={selectedProjectId !== null} 
        onOpenChange={() => setSelectedProjectId(null)}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {selectedProject && (
              <ProjectDetail 
                project={selectedProject}
                onBack={() => setSelectedProjectId(null)}
                mentor={mentor}
                onRefresh={() => handleRefreshProjects()}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-white py-6 border-t">
        <div className="container max-w-6xl text-center text-sm text-gray-500">
          <p>© 2025 DigiSP - Connecting Music Mentors & Students</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorDashboard;
