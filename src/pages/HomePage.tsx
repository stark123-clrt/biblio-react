import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/books/BookCard';
import {
  BookOpen,
  Search,
  Users,
  Star,
  BookmarkIcon,
  Quote,
} from 'lucide-react';

// Définition des interfaces pour les types
interface Book {
  id: string | number;
  title: string;
  author: string;
  description: string;
  category_id: string | number;
  created_at?: string;
  createdAt?: string;
  file_path: string;
  cover_image: string;
  publication_year: number | string | null;
  page_count: number | null;
}

interface Category {
  id: string | number;
  name: string;
  books_count?: number;
}

interface Comment {
  id: string | number;
  book_id: string | number;
  username?: string;
  comment_text: string;
  rating: number;
  created_at: string;
  is_validated: boolean;
  bookTitle?: string;
}

const HomePage = () => {
  const { books, categories, comments } = useBooks();
  const { isAuthenticated } = useAuth();
  const [featuredComments, setFeaturedComments] = useState<Comment[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string | number, number>>({});

  useEffect(() => {
    document.title = 'Bibliothèque Chrétienne - Accueil';

    // Calculer le nombre de livres par catégorie
    const counts: Record<string | number, number> = {};
    books.forEach((book: Book) => {
      if (book.category_id) {
        counts[book.category_id] = (counts[book.category_id] || 0) + 1;
      }
    });
    setCategoryCounts(counts);

    const getComments = () => {
      if (!comments || comments.length === 0) return [];
      
      return comments
        .filter((comment: Comment) => comment.is_validated)
        .map((comment: Comment) => {
          const book = books.find((b: Book) => b.id === comment.book_id);
          return {
            ...comment,
            bookTitle: book ? book.title : 'Livre inconnu'
          };
        });
    };

    setFeaturedComments(getComments());
  }, [books, comments]);

  // Obtenir les 4 livres les plus récents
  const featuredBooks = [...books]
    .sort((a: Book, b: Book) => new Date(b.created_at || b.createdAt || '').getTime() - new Date(a.created_at || a.createdAt || '').getTime())
    .slice(0, 4);

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-amber-600" />,
      title: 'Collection Complète',
      description: 'Accédez à une vaste bibliothèque de littérature chrétienne couvrant divers sujets et catégories.',
    },
    {
      icon: <Search className="h-10 w-10 text-amber-600" />,
      title: 'Recherche Facile',
      description: 'Trouvez exactement ce dont vous avez besoin grâce à notre système de recherche et de filtrage puissant.',
    },
    {
      icon: <BookmarkIcon className="h-10 w-10 text-amber-600" />,
      title: 'Marque-pages & Notes',
      description: 'Créez des marque-pages et des notes personnelles pour capturer les idées importantes.',
    },
    {
      icon: <Users className="h-10 w-10 text-amber-600" />,
      title: 'Communauté',
      description: 'Rejoignez une communauté de croyants partageant leurs réflexions et discutant des ouvrages marquants.',
    },
  ];

  return (
    <div className="bg-stone-50">
      {/* Section Hero */}
      <section className="relative">
        <div className="bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1260&h=750&q=80')] bg-cover bg-center h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight max-w-2xl">
              Enrichissez Votre Foi à Travers la Lecture
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-xl">
              Découvrez une richesse de littérature chrétienne pour approfondir votre compréhension et renforcer votre marche avec Dieu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/library"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explorer la Bibliothèque
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  S'inscrire
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Livres à la Une - HAUTEUR RÉDUITE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Livres à la Une
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection d'ouvrages chrétiens inspirants et transformateurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book: Book) => (
              <div key={book.id} className="transform hover:-translate-y-2 transition-transform duration-300 h-auto max-h-96 overflow-hidden">
                <BookCard book={book as any} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/library"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Voir Tous les Livres
            </Link>
          </div>
        </div>
      </section>

      {/* Section Catégories - COMPTAGE CORRIGÉ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Parcourir par Catégorie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trouvez des livres adaptés à vos centres d'intérêt spécifiques.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                to={`/library?category=${category.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 text-center border border-gray-200 hover:border-amber-300 hover:scale-[1.02] flex flex-col items-center justify-center min-h-[120px]"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {category.name}
                </h3>
                <span className="text-sm text-gray-500 mt-1">
                  {categoryCounts[category.id] || 0} livres
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Pourquoi Choisir Notre Bibliothèque
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profitez de ces fonctionnalités conçues pour enrichir votre expérience de lecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col items-center h-full"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Avis des Lecteurs
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Découvrez ce que notre communauté pense des livres de notre bibliothèque.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredComments.length > 0 ? (
              featuredComments.map((comment: Comment, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-amber-600 transition-all duration-200 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < comment.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="relative mb-6 flex-grow">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-amber-500 opacity-50" />
                    <p className="text-gray-300 relative z-10 pl-4 italic">
                      {comment.comment_text.length > 200
                        ? `"${comment.comment_text.substring(0, 200)}..."`
                        : `"${comment.comment_text}"`}
                    </p>
                  </div>
                  <div className="font-medium mt-auto border-t border-gray-700 pt-4">
                    <p className="text-amber-400">{comment.bookTitle}</p>
                    <p className="text-white mt-1">
                      {comment.username || 'Lecteur Anonyme'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400">Aucun témoignage pour le moment. Soyez le premier à partager votre avis !</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-6">
            Prêt à Grandir dans la Foi et la Connaissance ?
          </h2>
          <p className="text-amber-100 max-w-2xl mx-auto mb-8">
            Rejoignez notre communauté de croyants et accédez à l'ensemble de nos ressources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-white hover:bg-gray-100 text-amber-800 px-8 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Créer un Compte
              </Link>
            )}
            <Link
              to="/library"
              className="border border-white text-white hover:bg-amber-800 px-8 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Explorer les Livres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;