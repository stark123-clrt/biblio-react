import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Tag, 
  MessageSquare, 
  Home 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/books', label: 'Books', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/categories', label: 'Categories', icon: <Tag className="w-5 h-5" /> },
    { path: '/admin/comments', label: 'Comments', icon: <MessageSquare className="w-5 h-5" /> },
  ];
  
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="ml-3">Back to Website</span>
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;