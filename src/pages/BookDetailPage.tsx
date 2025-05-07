import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from '../components/books/CommentSection';
import { Book as BookIcon, Calendar, Clock, FileText, ExternalLink } from 'lucide-react';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookById, categories } = useBooks();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const book = id ? getBookById(id) : undefined;
  const category = book ? categories.find(c => c.id === book.category_id) : undefined;
  
  useEffect(() => {
    if (book) {
      document.title = `${book.title} - Christian Library`;
    } else {
      document.title = 'Book Not Found - Christian Library';
    }
  }, [book]);
  
  if (!book) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
            <p className="text-gray-600 mb-6">
              The book you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/library"
              className="bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors duration-200"
            >
              Go to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleReadClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/read/${book.id}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-amber-600">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-1">/</span>
              <Link to="/library" className="hover:text-amber-600">Library</Link>
            </li>
            {category && (
              <li className="flex items-center">
                <span className="mx-1">/</span>
                <Link to={`/library?category=${category.id}`} className="hover:text-amber-600">{category.name}</Link>
              </li>
            )}
            <li className="flex items-center">
              <span className="mx-1">/</span>
              <span className="text-gray-700">{book.title}</span>
            </li>
          </ol>
        </nav>
        
        {/* Book header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3 aspect-[2/3] relative overflow-hidden">
              <img
                src={book.cover_image || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg'}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8 md:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                {category && (
                  <Link
                    to={`/library?category=${category.id}`}
                    className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                )}
                <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {book.publication_year}
                </span>
              </div>
              
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-gray-700 text-lg mb-4">by {book.author}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                  <span>{book.publication_year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-2 text-amber-600" />
                  <span>{book.page_count} pages</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-amber-600" />
                  <span>~{Math.round(book.page_count / 30)} hours to read</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReadClick}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center py-3 px-6 rounded-md font-medium transition-colors duration-200"
                >
                  <BookIcon className="h-5 w-5 mr-2" />
                  {isAuthenticated ? 'Read Now' : 'Login to Read'}
                </button>
                <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 p-8">
          <CommentSection bookId={book.id} />
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;