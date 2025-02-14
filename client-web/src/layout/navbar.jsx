import { useState } from "react";
import { Search, Mail, User, BookOpen, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token
    setIsAuthenticated(false); // อัปเดต state
    navigate("/login"); // ไปหน้า login
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* เมนูหลัก */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold">Library</Link>
          <Link to="/books" className="hover:text-gray-300 flex items-center gap-2">
            <BookOpen size={20} />
            Books
          </Link>
          <Link to="/authors" className="hover:text-gray-300 flex items-center gap-2">
            <Users size={20} />
            Authors
          </Link>
        </div>

        {/* เมนูขวา */}
        <div className="flex items-center space-x-6">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Messages */}
          <Link to="/messages" className="hover:text-gray-300">
            <Mail size={24} />
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="hover:text-gray-300">Username</span>
              <User size={24} className="hover:text-gray-300" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                <Link
                  to="/profile"
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
