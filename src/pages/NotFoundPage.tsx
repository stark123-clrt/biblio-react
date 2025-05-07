import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-6" />
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          <Link
            to="/library"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;