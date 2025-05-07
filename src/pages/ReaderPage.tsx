import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import PDFReader from '../components/reader/PDFReader';

const ReaderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookById } = useBooks();
  const navigate = useNavigate();
  
  const book = id ? getBookById(id) : undefined;
  
  useEffect(() => {
    if (book) {
      document.title = `Reading: ${book.title} - Christian Library`;
    } else {
      document.title = 'Book Not Found - Christian Library';
    }
  }, [book]);
  
  if (!book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">
            The book you are trying to read does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/library')}
            className="bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors duration-200"
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <PDFReader book={book} />
    </div>
  );
};

export default ReaderPage;