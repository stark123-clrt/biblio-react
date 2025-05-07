import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut, LogIn, Menu, X, Library } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="font-serif text-xl font-bold">
                Christian Library
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-amber-800 font-semibold'
                  : 'hover:bg-amber-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/library"
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/library')
                  ? 'bg-amber-800 font-semibold'
                  : 'hover:bg-amber-800'
              }`}
            >
              Library
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/admin')
                    ? 'bg-amber-800 font-semibold'
                    : 'hover:bg-amber-800'
                }`}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/profile')
                      ? 'bg-amber-800 font-semibold'
                      : 'hover:bg-amber-800'
                  }`}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-amber-800 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/login')
                    ? 'bg-amber-800 font-semibold'
                    : 'hover:bg-amber-800'
                }`}
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-amber-700 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-amber-800 font-semibold'
                  : 'hover:bg-amber-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/library"
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/library')
                  ? 'bg-amber-800 font-semibold'
                  : 'hover:bg-amber-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/admin')
                    ? 'bg-amber-800 font-semibold'
                    : 'hover:bg-amber-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/profile')
                      ? 'bg-amber-800 font-semibold'
                      : 'hover:bg-amber-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{user?.username}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-amber-800 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive('/login')
                    ? 'bg-amber-800 font-semibold'
                    : 'hover:bg-amber-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;