
import React from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { MENTORS, MATCHES } from "@/services/mockData";
import { Mentor } from "@/types";
import { toast } from "sonner";

const Index = () => {
  const [mentors, setMentors] = React.useState<Mentor[]>(MENTORS);
  
  const handleApprove = (mentorId: number) => {
    setMentors(
      mentors.map(mentor => 
        mentor.id === mentorId 
          ? { ...mentor, approved: true, pending: false } 
          : mentor
      )
    );
    toast("Mentor approved successfully");
  };
  
  const handleReject = (mentorId: number) => {
    setMentors(
      mentors.map(mentor => 
        mentor.id === mentorId 
          ? { ...mentor, approved: false, pending: false } 
          : mentor
      )
    );
    toast("Mentor application rejected");
  };
  
  const getStudentCount = (mentorId: number) => {
    return MATCHES.filter(match => match.mentor.id === mentorId).length;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
      <NavBar />
      
      <main className="container max-w-6xl py-12 px-4">
        <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage mentor applications and assignments</p>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.filter(mentor => mentor.pending).map(mentor => (
                <Card key={mentor.id} className="overflow-hidden">
                  <CardHeader className="bg-amber-50 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{mentor.name}</h3>
                          <p className="text-sm text-gray-500">{mentor.instrument}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600">{mentor.bio}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <div>Resume:</div>
                        <a 
                          href={mentor.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleApprove(mentor.id)}
                          className="flex-1"
                          variant="outline"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(mentor.id)}
                          className="flex-1"
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mentors.filter(mentor => mentor.pending).length === 0 && (
                <div className="col-span-2 bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">No pending mentor applications</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Approved Mentors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.filter(mentor => mentor.approved).map(mentor => (
                <Card key={mentor.id} className="overflow-hidden">
                  <CardHeader className="bg-green-50 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{mentor.name}</h3>
                          <p className="text-sm text-gray-500">{mentor.instrument}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Students:</span> {getStudentCount(mentor.id)}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Rating:</span> {mentor.starRating}/5
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <div>Resume:</div>
                        <a 
                          href={mentor.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          toast("Feature coming soon!");
                        }}
                      >
                        Manage Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mentors.filter(mentor => mentor.approved).length === 0 && (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">No approved mentors</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Rejected Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.filter(mentor => mentor.approved === false && !mentor.pending).map(mentor => (
                <Card key={mentor.id} className="overflow-hidden border-red-100">
                  <CardHeader className="bg-red-50 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{mentor.name}</h3>
                          <p className="text-sm text-gray-500">{mentor.instrument}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Rejected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <div>Resume:</div>
                        <a 
                          href={mentor.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleApprove(mentor.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Reconsider Approval
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mentors.filter(mentor => mentor.approved === false && !mentor.pending).length === 0 && (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-gray-500">No rejected applications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container max-w-6xl text-center text-sm text-gray-500">
          <p>© 2025 DigiSP - Connecting Music Mentors & Students</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
