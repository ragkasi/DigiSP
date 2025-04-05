
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Music, Users, Calendar, Search } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-symphoni-light">
      <NavBar />
      
      <main>
        {/* Hero section */}
        <section className="relative overflow-hidden py-20 px-6">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Find Your Perfect 
                  <br></br>
                  <span className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary bg-clip-text text-transparent"> Music Mentor</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  DigiSP connects passionate music students with experienced mentors for personalized learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary hover:opacity-90">
                    <Link to="/student/signup">Find a Mentor</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/mentor/signup">Become a Mentor</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Music teaching"
                  className="rounded-lg shadow-xl max-w-full h-auto"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How DigiSP Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-full bg-symphoni-primary/20 flex items-center justify-center mb-4">
                  <Music className="h-8 w-8 text-symphoni-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Instrument</h3>
                <p className="text-gray-600">
                  Select from piano, violin, guitar, drums, or flute to find specialized teachers.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-full bg-symphoni-secondary/20 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-symphoni-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Your Schedule</h3>
                <p className="text-gray-600">
                  Tell us when you're available for lessons and we'll find mentors that match.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-full bg-symphoni-primary/20 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-symphoni-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Mentors</h3>
                <p className="text-gray-600">
                  Review mentor profiles, ratings, and student testimonials.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-full bg-symphoni-secondary/20 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-symphoni-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="text-gray-600">
                  Select your perfect mentor and start your musical journey together!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-symphoni-accent">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Join hundreds of students who have found their perfect music mentor through DigiSP.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-symphoni-primary to-symphoni-secondary hover:opacity-90">
              <Link to="/student/signup">Sign Up As Student</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container max-w-6xl text-center text-sm text-gray-500">
          <p>© 2025 DigiSP - Connecting Music Mentors & Students</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
