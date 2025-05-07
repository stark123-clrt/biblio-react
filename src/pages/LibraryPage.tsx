import { useEffect, useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import BookCard from '../components/books/BookCard';
import { X, Filter } from 'lucide-react';

// Définition des interfaces pour les types
interface Book {
  id: string | number;
  title: string;
  author: string;
  description: string;
  category_id: string | number;
  file_path: string;
  cover_image: string;
  publication_year: number | string | null;
  page_count: number | null;
  created_at: string | Date | null;
  // Ajoutez d'autres propriétés selon vos besoins
}

interface Category {
  id: string | number;
  name: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

const LibraryPage = () => {
  const { books, categories } = useBooks();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [categoryCounts, setCategoryCounts] = useState<Record<string | number, number>>({});

  // Calculer le nombre de livres par catégorie
  useEffect(() => {
    const counts: Record<string | number, number> = {};
    books.forEach((book: Book) => {
      if (book.category_id) {
        counts[book.category_id] = (counts[book.category_id] || 0) + 1;
      }
    });
    setCategoryCounts(counts);
  }, [books]);

  useEffect(() => {
    document.title = 'Bibliothèque Chrétienne - Catalogue';
    
    let results = [...books];
    
    if (selectedCategory) {
      results = results.filter((book: Book) => book.category_id === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((book: Book) => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) || 
        book.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredBooks(results);
  }, [books, searchQuery, selectedCategory]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="p-10 text-3xl font-serif font-bold text-gray-900 mb-2">Notre Catalogue</h1>
          <p className="text-gray-600">
            Explorez nos ouvrages chrétiens classés par catégories
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Panneau latéral des catégories - réduit en hauteur */}
          <div className="md:w-1/4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 sticky top-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-1 text-amber-600" />
                  Catégories
                </h2>
                {selectedCategory && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-amber-600 hover:text-amber-700 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs ${!selectedCategory ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Toutes les catégories
                </button>
                
                {categories.map((category: Category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex justify-between items-center ${selectedCategory === category.id ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {categoryCounts[category.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal - grille modifiée pour plus de livres par ligne */}
          <div className="md:w-3/4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Rechercher un livre par titre, auteur ou description..."
                className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-gray-700">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'livre trouvé' : 'livres trouvés'}
              </h2>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book: Book) => (
                  <div key={book.id} className="h-auto max-h-96 overflow-hidden">
                    <BookCard 
                      key={book.id} 
                      book={book as any}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 mb-3 text-sm">
                  Aucun livre ne correspond à votre recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition-colors"
                >
                  Afficher tous les livres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;