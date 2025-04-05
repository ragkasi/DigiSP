import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Instrument } from "@/types";
import { addMentor } from "@/services/mockData";

const MentorSignup = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instrument: "",
    availability: "",
    bio: "",
    resumeLink: "",
    imageUrl: "",
    starRating: 0
  });

  const instruments: Instrument[] = ["Violin", "Guitar", "Piano", "Drums", "Flute"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstrumentChange = (value: string) => {
    setFormData(prev => ({ ...prev, instrument: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add random avatar and initialize empty reviews and default rating
    addMentor({
      ...formData,
      imageUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`,
      starRating: 5
    });
    
    toast({
      title: "Registration Successful!",
      description: "Your mentor profile has been created. Students can now find you.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      instrument: "",
      availability: "",
      bio: "",
      resumeLink: "",
      imageUrl: "",
      starRating: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
      <NavBar />
      
      <main className="container max-w-3xl py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-symphoni-dark mb-2">Become a Music Mentor</h1>
          <p className="text-gray-600">Share your musical expertise with students eager to learn</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Enter your full name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instrument">What instrument do you teach?</Label>
              <Select 
                onValueChange={handleInstrumentChange}
                required
              >
                <SelectTrigger id="instrument">
                  <SelectValue placeholder="Select an instrument" />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument} value={instrument}>
                      {instrument}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">When are you available to teach?</Label>
              <Input 
                id="availability" 
                name="availability" 
                placeholder="e.g. Weekday evenings, Saturday mornings" 
                required 
                value={formData.availability}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                placeholder="Describe your musical background and teaching style"
                required
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resumeLink">Portfolio/Resume Link</Label>
              <Input 
                id="resumeLink" 
                name="resumeLink" 
                placeholder="https://yourportfolio.com" 
                value={formData.resumeLink}
                onChange={handleChange}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-symphoni-secondary to-symphoni-primary hover:opacity-90"
            >
              Submit Profile
            </Button>
          </form>
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

export default MentorSignup;
