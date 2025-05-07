import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { ExternalLink } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-amber-100">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={book.cover_image || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg'}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-serif text-lg font-bold line-clamp-1">
            {book.title}
          </h3>
          <p className="text-amber-200 text-sm">{book.author}</p>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {book.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            {book.publication_year}
          </span>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            {book.page_count} pages
          </span>
        </div>
      </div>
      
      <div className="px-4 pb-4 mt-auto">
        <div className="flex space-x-2">
          <Link
            to={`/book/${book.id}`}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md text-center transition-colors duration-200"
          >
            Details
          </Link>
          <Link
            to={`/read/${book.id}`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard