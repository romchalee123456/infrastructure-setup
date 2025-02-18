import { useState, useEffect } from "react";
import { Search, Mail, User, BookOpen, Users, Library, History} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300 flex items-center gap-2">
            <BookOpen size={20} />
            Books
          </Link>
          {role === "admin" && (
            <>
          <Link to="/manage-book" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <Library size={20} />
          <span>Manage Book</span>
        </Link>
        
        <Link to="/manage-user" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <Users size={20} />
          <span>Manage Member</span>
        </Link>
        </>
          )}
        <Link to="/borrow-history" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <History size={20} />
          <span>Borrow History</span>
        </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <User size={24} className="hover:text-gray-300" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50">
                <Link
                  to="/manage-profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
