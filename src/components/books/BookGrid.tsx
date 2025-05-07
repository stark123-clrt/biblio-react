import { Book } from '../../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
}

const BookGrid = ({ books }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;