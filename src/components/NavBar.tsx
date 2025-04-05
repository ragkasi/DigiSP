
import { Link, useLocation } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 
      "font-medium text-symphoni-dark border-b-2 border-symphoni-primary" : 
      "text-gray-600 hover:text-symphoni-dark";
  };

  return (
    <header className="py-6 px-6 md:px-10 bg-white shadow-sm">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-symphoni-primary to-symphoni-secondary bg-clip-text text-transparent">
                DigiSP
              </h1>
            </Link>
          </div>
          
          <nav className="flex flex-wrap gap-4 md:gap-8 justify-center">
            <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
              Home
            </Link>
            <Link to="/student/signup" className={`${isActive("/student/signup")} transition-colors duration-200`}>
              Student Sign-Up
            </Link>
            <Link to="/mentor/signup" className={`${isActive("/mentor/signup")} transition-colors duration-200`}>
              Mentor Sign-Up
            </Link>
            <Link to="/student/dashboard" className={`${isActive("/student/dashboard")} transition-colors duration-200`}>
              Student Dashboard
            </Link>
            <Link to="/mentor/dashboard" className={`${isActive("/mentor/dashboard")} transition-colors duration-200`}>
              Mentor Dashboard
            </Link>
            <Link to="/admin" className={`${isActive("/admin")} transition-colors duration-200`}>
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
