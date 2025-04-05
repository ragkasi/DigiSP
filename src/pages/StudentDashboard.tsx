import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Session, Student, Mentor, Project } from "@/types";
import { MATCHES, STUDENTS, MENTORS } from "@/services/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Music, Plus } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetail } from "@/components/ProjectDetail";
import { NewProjectForm } from "@/components/NewProjectForm";
import { Tuner } from "@/components/Tuner";
import { toast } from "sonner";
import { getStudentProjects } from "@/services/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentDashboard = () => {
  const { toast: showToast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [refresh, setRefresh] = useState(0); // To force refresh of data
  
  useEffect(() => {
    if (STUDENTS.length > 0) {
      setStudent(STUDENTS[0]);
    } else {
      const mockStudent: Student = {
        id: 1,
        name: "Demo Student",
        email: "student@example.com",
        instrument: "Piano",
        availability: "Weekends, Weekday evenings",
        bio: "Learning piano",
        imageUrl: `https://randomuser.me/api/portraits/women/33.jpg`,
      };
      setStudent(mockStudent);
    }
  }, []);
  
  useEffect(() => {
    if (student) {
      const studentMatches = MATCHES.filter(match => match.student.id === student.id);
      
      const mockSessions: Session[] = studentMatches.map((match, index) => {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + (index + 1) * 2);
        
        return {
          id: index + 1,
          mentorId: match.mentor.id,
          studentId: student.id,
          instrument: match.student.instrument as any,
          date: sessionDate,
          startTime: "16:00",
          endTime: "16:30",
          zoomLink: "https://zoom.us/j/123456789"
        };
      });
      
      setSessions(mockSessions);
      
      setProjects(getStudentProjects(student.id));
    }
  }, [student, refresh]);
  
  const getMentorById = (id: number) => {
    return MENTORS.find(mentor => mentor.id === id);
  };
  
  const handleCancelSession = (sessionId: number) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    showToast({
      title: "Session Cancelled",
      description: "Your lesson has been cancelled successfully.",
    });
  };
  
  const handleViewProject = (projectId: number) => {
    setSelectedProjectId(projectId);
  };
  
  const handleCreateTake = (projectId: number) => {
    setSelectedProjectId(projectId);
    // To implement recording
  };
  
  const handleRefreshProjects = () => {
    setRefresh(prev => prev + 1);
  };
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
        <NavBar />
        <main className="container max-w-6xl py-12 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Please sign up as a student first.</p>
            <Button className="mt-4" onClick={() => window.location.href = "/student/signup"}>
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
            <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {student.name}!</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={student.imageUrl} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="sessions">
          <TabsList className="mb-6">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="practice">Practice Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upcoming Sessions</h2>
              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map(session => {
                    const mentor = getMentorById(session.mentorId);
                    
                    return (
                      <Card key={session.id} className="overflow-hidden border-symphoni-primary/30">
                        <CardHeader className="bg-symphoni-primary/10 p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={mentor?.imageUrl} alt={mentor?.name} />
                              <AvatarFallback>{mentor?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{mentor?.name}</h3>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Music className="h-3 w-3" />
                                <span>{session.instrument}</span>
                              </div>
                            </div>
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
                  <p className="text-gray-500">No upcoming sessions. Find a mentor to schedule your first lesson!</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-symphoni-primary to-symphoni-secondary"
                    onClick={() => window.location.href = "/mentors"}
                  >
                    Browse Mentors
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Mentors</h2>
              {MATCHES.filter(match => match.student.id === student.id).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MATCHES
                    .filter(match => match.student.id === student.id)
                    .map(match => (
                      <Card key={match.mentor.id} className="overflow-hidden">
                        <div className="p-4 flex items-center space-x-4">
                          <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarImage src={match.mentor.imageUrl} alt={match.mentor.name} />
                            <AvatarFallback>{match.mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{match.mentor.name}</h3>
                            <Badge variant="outline" className="bg-white/50 mt-1">
                              {match.mentor.instrument}
                            </Badge>
                          </div>
                        </div>
                        <div className="px-4 pb-4">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.location.href = "/mentors"}
                          >
                            Schedule New Lesson
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">You haven't been matched with any mentors yet.</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-symphoni-primary to-symphoni-secondary"
                    onClick={() => window.location.href = "/mentors"}
                  >
                    Find a Mentor
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button onClick={() => setShowAddProjectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewProject={handleViewProject}
                      onCreateTake={handleCreateTake}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500 mb-4">No projects yet. Create your first project to start tracking your progress!</p>
                  <Button 
                    className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary"
                    onClick={() => setShowAddProjectDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Practice Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Tuner />
                </div>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-medium">Practice Stats</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Streak</p>
                        <p className="text-2xl font-bold">3 days</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total Practice Time</p>
                        <p className="text-2xl font-bold">14.5 hours</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Projects Mastered</p>
                        <p className="text-2xl font-bold">
                          {projects.filter(p => p.status === "Mastered").length} / {projects.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                onRefresh={handleRefreshProjects}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={showAddProjectDialog} 
        onOpenChange={setShowAddProjectDialog}
      >
        <DialogContent className="max-w-2xl">
          {student && (
            <NewProjectForm
              studentId={student.id}
              instrument={student.instrument as any}
              onProjectCreated={(project) => {
                setShowAddProjectDialog(false);
                handleRefreshProjects();
                toast("Project created successfully", {
                  description: `"${project.title}" has been added to your projects.`
                });
              }}
              onCancel={() => setShowAddProjectDialog(false)}
            />
          )}
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

export default StudentDashboard;
