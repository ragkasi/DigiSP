import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { MentorCard } from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mentor } from "@/types";
import { findMatchingMentors, MENTORS, addMatch, STUDENTS } from "@/services/mockData";

const MentorsListing = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const instrument = searchParams.get("instrument") || "";
  const availability = searchParams.get("availability") || "";
  const studentId = parseInt(searchParams.get("student") || "0");
  
  const [matchingMentors, setMatchingMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isMatched, setIsMatched] = useState(false);
  
  useEffect(() => {
    if (instrument) {
      const mentors = findMatchingMentors(instrument, availability);
      setMatchingMentors(mentors.length > 0 ? mentors : MENTORS.filter(m => m.instrument === instrument));
    } else {
      setMatchingMentors(MENTORS);
    }
  }, [instrument, availability]);
  
  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };
  
  const handleConfirmMatch = () => {
    if (selectedMentor && studentId) {
      const student = STUDENTS.find(s => s.id === studentId);
      
      if (student) {
        addMatch({
          mentor: selectedMentor,
          student
        });
        
        setIsMatched(true);
        
        toast({
          title: "Match Confirmed!",
          description: `You've been matched with ${selectedMentor.name}. They will contact you soon to schedule your first lesson.`,
        });
      }
    }
  };
  
  const handleResetMatch = () => {
    setSelectedMentor(null);
    setIsMatched(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
      <NavBar />
      
      <main className="container max-w-6xl py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-symphoni-dark mb-2">
            Available {instrument} Mentors
          </h1>
          <p className="text-gray-600">
            Browse our talented mentors and select the one that's right for you
          </p>
        </div>
        
        {isMatched && selectedMentor ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center mb-10">
            <h2 className="text-2xl font-bold text-symphoni-primary mb-4">
              You're matched with {selectedMentor.name}!
            </h2>
            <p className="mb-6">
              They'll be in touch with you soon to start your {instrument} journey.
            </p>
            <Button
              variant="outline"
              onClick={handleResetMatch}
            >
              Change Your Match
            </Button>
          </div>
        ) : selectedMentor ? (
          <div className="flex justify-center mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
              <h3 className="text-xl font-medium mb-2">
                You've selected {selectedMentor.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Ready to start learning {instrument} with this mentor?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleConfirmMatch}
                  className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary"
                >
                  Confirm Match
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMentor(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        
        {matchingMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onSelectMentor={handleSelectMentor}
                isSelected={selectedMentor?.id === mentor.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">
              No mentors found matching your criteria
            </h3>
            <p className="text-gray-500 mt-2">
              Please try different preferences or check back later as new mentors join.
            </p>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container max-w-6xl text-center text-sm text-gray-500">
          <p>© 2025 DigiSP - Connecting Music Mentors & Students</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorsListing;
