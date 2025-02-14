import { BookPlus, UserPlus, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-4">
        <Link to="/add-book" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <BookPlus size={20} />
          <span>Add Book</span>
        </Link>
        
        <Link to="/add-user" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <UserPlus size={20} />
          <span>Add User</span>
        </Link>
        
        <Link to="/borrow-history" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
          <History size={20} />
          <span>Borrow History</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
