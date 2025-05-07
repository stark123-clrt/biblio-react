import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BookContext';
import { Book, ReadingProgress } from '../types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  BookOpen,
  Clock,
  Settings,
  Download,
  Trash2,
  BookMarked,
  Award,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Définition des interfaces manquantes
interface UserType {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

interface BookWithProgress extends Book {
  progress: ReadingProgress;
}

// Interface simplifiée pour le state de location
interface LocationState {
  refreshNeeded?: boolean;
  lastReadBookId?: string | number;
}

const UserProfilePage = () => {
  const { user } = useAuth() as { user: UserType };
  const { books, readingProgress } = useBooks() as { 
    books: Book[], 
    readingProgress: ReadingProgress[] 
  };
  const [userBooks, setUserBooks] = useState<BookWithProgress[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  useEffect(() => {
    document.title = 'Ma Bibliothèque - Christian Library';
  }, []);

  // Effet pour charger les données en cas de retour du lecteur
  useEffect(() => {
    if (locationState?.refreshNeeded) {
      console.log("Navigation depuis le lecteur détectée, actualisation forcée");
      loadUserBooks();
      
      // Effacer le state pour éviter un rechargement continu
      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  const loadUserBooks = async () => {
    setLoading(true);
    if (user) {
      console.log("ID de l'utilisateur connecté:", user.id);
      console.log('Nombre de livres disponibles:', books.length);
      console.log(
        'Nombre de progressions disponibles:',
        readingProgress.length
      );

      let userProgress: ReadingProgress[] = [];

      // Vérifier si readingProgress contient des données
      if (readingProgress && readingProgress.length > 0) {
        console.log('Utilisation des données du contexte');
        userProgress = readingProgress.filter(
          (progress) => progress.user_id === user.id
        );
      } else {
        // Fallback: requête directe à Supabase
        console.log('Requête directe à Supabase pour les progressions');
        const { data, error } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Erreur Supabase:', error);
        } else if (data) {
          console.log('Données récupérées depuis Supabase:', data);
          userProgress = data as ReadingProgress[];
        }
      }

      console.log("Progressions de l'utilisateur:", userProgress);

      // Associer les livres avec leur progression
      if (userProgress.length > 0) {
        const booksWithProgress = userProgress
          .map((progress) => {
            const book = books.find((b) => b.id === progress.book_id);
            if (!book) {
              console.log(`Livre non trouvé pour l'ID: ${progress.book_id}`);
              return null;
            }
            return { ...book, progress } as BookWithProgress;
          })
          .filter(Boolean) as BookWithProgress[];

        console.log('Livres avec progression:', booksWithProgress);
        setUserBooks(booksWithProgress);
      } else {
        console.log('Aucune progression trouvée pour cet utilisateur');
        setUserBooks([]);
      }
    }
    setLoading(false);
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadUserBooks();
  }, [user, books, readingProgress]);

  // Fonction pour mettre en évidence le livre récemment lu
  const getHighlightClass = (bookId: string | number) => {
    if (locationState?.lastReadBookId === bookId) {
      return "ring-2 ring-amber-500 shadow-md";
    }
    return "";
  };

  if (!user) {
    return null;
  }

  const calculateReadingPercentage = (currentPage: number, totalPages: number): number => {
    if (!currentPage || !totalPages) return 0;
    return Math.min(Math.round((currentPage / totalPages) * 100), 100);
  };

  const formatLastRead = (dateString: string): string => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return 'Date invalide';
    }
  };

  const handleContinueReading = (bookId: string | number): void => {
    navigate(`/read/${bookId}`);
  };

  const handleRemoveBook = (bookId: string | number): void => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir retirer ce livre de votre bibliothèque ?'
      )
    ) {
      // Supprimer la progression de lecture
      supabase
        .from('reading_progress')
        .delete()
        .match({ user_id: user.id, book_id: bookId })
        .then(({ error }) => {
          if (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression du livre');
          } else {
            toast.success('Livre retiré de votre bibliothèque');
            // Mettre à jour la liste des livres
            setUserBooks(userBooks.filter((book) => book.id !== bookId));
          }
        });
    }
  };

  const handleDownloadBook = (bookId: string | number, title: string): void => {
    // Implémentation du téléchargement
    console.log(`Téléchargement du livre ${bookId}: ${title}`);
  
    // Obtenir l'URL du PDF
    supabase
      .from('books')
      .select('file_path')
      .eq('id', bookId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error('Erreur lors du téléchargement');
          return;
        }
  
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        // Version corrigée de l'expression régulière
        const safeTitle = title.replace(/[ \t\n\r]+/g, '_');
        link.download = `${safeTitle}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        toast.success('Téléchargement démarré');
      });
  };

  // Filtrer les livres selon l'onglet actif
  const getFilteredBooks = (): BookWithProgress[] => {
    switch (activeTab) {
      case 'in-progress':
        return userBooks.filter((book) => {
          const percentage = calculateReadingPercentage(
            book.progress.current_page,
            book.page_count as number
          );
          return percentage > 0 && percentage < 100;
        });
      case 'completed':
        return userBooks.filter((book) => {
          const percentage = calculateReadingPercentage(
            book.progress.current_page,
            book.page_count as number
          );
          return percentage === 100;
        });
      case 'not-started':
        return userBooks.filter((book) => {
          return book.progress.current_page <= 1;
        });
      default:
        return userBooks;
    }
  };

  const filteredBooks = getFilteredBooks();

  // Calculer les statistiques
  const totalBooks = userBooks.length;
  const booksStarted = userBooks.filter(
    (book) => book.progress.current_page > 1
  ).length;
  const booksCompleted = userBooks.filter(
    (book) =>
      calculateReadingPercentage(
        book.progress.current_page,
        book.page_count as number
      ) === 100
  ).length;
  const notesCount = 0; // À implémenter avec le système de notes

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-amber-700 to-amber-500 h-32 sm:h-40"></div>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="-mt-12 sm:-mt-16 flex justify-center">
                  <div className="bg-white p-2 rounded-full ring-4 ring-amber-600">
                    <User className="h-20 w-20 sm:h-24 sm:w-24 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-center sm:text-left">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {user.username}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Membre depuis{' '}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <Settings className="h-4 w-4 mr-2" />
                  Éditer le profil
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          Statistiques de lecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Livres dans ma bibliothèque
                </p>
                <p className="text-3xl font-bold text-blue-800 mt-1">
                  {totalBooks}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <BookMarked className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Livres commencés
                </p>
                <p className="text-3xl font-bold text-green-800 mt-1">
                  {booksStarted}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Livres terminés
                </p>
                <p className="text-3xl font-bold text-purple-800 mt-1">
                  {booksCompleted}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  Notes prises
                </p>
                <p className="text-3xl font-bold text-yellow-800 mt-1">
                  {notesCount}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <BookMarked className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Ma Bibliothèque
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Rechercher..."
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'in-progress'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'completed'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés
            </button>
            <button
              onClick={() => setActiveTab('not-started')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'not-started'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Non commencés
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-gray-600">
                Chargement de vos livres...
              </span>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const readingPercentage = calculateReadingPercentage(
                  book.progress.current_page,
                  book.page_count as number
                );
                const isCompleted = readingPercentage === 100;

                return (
                  <div
                    key={book.id}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 h-auto max-h-96 overflow-y-auto ${getHighlightClass(book.id)}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <img
                          src={book.cover_image}
                          alt={`Couverture de ${book.title}`}
                          className="w-16 h-24 object-cover rounded-md mr-4 shadow-sm"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              'https://via.placeholder.com/100x150?text=No+Cover';
                          }}
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600">{book.author}</p>

                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              Dernière lecture:{' '}
                              {formatLastRead(book.progress.last_read)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>
                            Page {book.progress.current_page} sur{' '}
                            {book.page_count} ({readingPercentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              isCompleted ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${readingPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {isCompleted ? (
                          <button
                            onClick={() =>
                              handleDownloadBook(book.id, book.title)
                            }
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </button>
                        ) : (
                          <button
                            onClick={() => handleContinueReading(book.id)}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Continuer
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveBook(book.id)}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pas de livres dans cette catégorie
              </h3>
              <p className="text-gray-600 mb-4">
                {userBooks.length === 0
                  ? "Vous n'avez pas encore commencé à lire de livres."
                  : "Vous n'avez pas de livres dans cette catégorie."}
              </p>
              <Link
                to="/library"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
              >
                Parcourir la bibliothèque
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        {userBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Activité récente
            </h2>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {userBooks
                .slice(0, 5)
                .sort(
                  (a, b) =>
                    new Date(b.progress.last_read).getTime() -
                    new Date(a.progress.last_read).getTime()
                )
                .map((book, index) => (
                  <div
                    key={`${book.id}-${index}`}
                    className={`p-4 flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${getHighlightClass(book.id)}`}
                  >
                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <span className="text-gray-900">
                            Vous avez continué à lire{' '}
                          </span>
                          <Link
                            to={`/read/${book.id}`}
                            className="text-amber-600 font-medium hover:underline"
                          >
                            {book.title}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                          {new Date(book.progress.last_read).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Page {book.progress.current_page} (
                        {calculateReadingPercentage(
                          book.progress.current_page,
                          book.page_count as number
                        )}
                        % terminé)
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;