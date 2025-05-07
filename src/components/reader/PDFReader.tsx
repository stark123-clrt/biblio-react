import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooks } from '../../contexts/BookContext';
import { Book, ReadingProgress } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  X,
  List,
  Plus,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import NotesList from './NotesList';
import AddNoteForm from './AddNoteForm';
import BookmarksList from './BookmarksList';
import CommentSection from '../books/CommentSection';

// Import direct de pdfjs-dist avec ses types
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Définir correctement le worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface PDFReaderProps {
  book: Book;
}

interface UserType {
  id: string;
  username?: string;
  email?: string;
}

type SidebarModeType = 'notes' | 'bookmarks' | 'comments' | null;

const PDFReader = ({ book }: PDFReaderProps) => {
  const navigate = useNavigate(); // Pour la navigation
  const { user } = useAuth() as { user: UserType | null };
  const { updateReadingProgress, getReadingProgressByUserAndBook } = useBooks();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(book.page_count as number || 0);
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sidebarMode, setSidebarMode] = useState<SidebarModeType>(null);
  const [scale, setScale] = useState<number>(1.5);
  const [headerCollapsed, setHeaderCollapsed] = useState<boolean>(false);
  const [lastSavedPage, setLastSavedPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fonction pour fermer le lecteur et revenir au profil
  const closeReader = () => {
    // Sauvegarder immédiatement la progression avant de naviguer
    if (user?.id && book?.id && currentPage !== lastSavedPage) {
      const progressData: ReadingProgress = {
        user_id: user.id,
        book_id: book.id,
        current_page: currentPage,
        last_read: new Date().toISOString()
      } as ReadingProgress;
      
      updateReadingProgress(progressData);
      console.log("Progression sauvegardée avant navigation: Page", currentPage);
    }
    
    // Naviguer vers la page profil
    navigate('/profile', { 
      state: { 
        refreshNeeded: true,
        lastReadBookId: book.id
      } 
    });
  };

  // Charger le PDF
  useEffect(() => {
    console.log('Tentative de chargement du PDF...');

    const loadPDF = async () => {
      try {
        setLoading(true);
        console.log('URL du PDF:', book.file_path);

        // Utiliser le type correct pour loadingTask
        const loadingTask = pdfjsLib.getDocument({
          url: book.file_path,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        // Await sur promise pour obtenir le document
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        console.log('PDF chargé avec succès, pages:', pdf.numPages);
        setLoading(false);

        // Charger immédiatement la première page
        renderPage(1, pdf);
      } catch (err: any) {
        console.error('Erreur de chargement du PDF:', err);
        setError(`Erreur: ${err.message}`);
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      // Sauvegarder avant de quitter le composant
      if (user?.id && book?.id && currentPage !== lastSavedPage) {
        const progressData: ReadingProgress = {
          user_id: user.id,
          book_id: book.id,
          current_page: currentPage,
          last_read: new Date().toISOString()
        } as ReadingProgress;
        
        updateReadingProgress(progressData);
        console.log("Progression sauvegardée lors du démontage du composant:", currentPage);
      }
      
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [book.file_path]);

  // Fonction pour rendre une page
  const renderPage = async (pageNum: number, doc: PDFDocumentProxy | null) => {
    if (!doc) {
      console.log('Document PDF non disponible');
      return;
    }

    try {
      console.log(`Rendu de la page ${pageNum}`);
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas non disponible');
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Contexte 2D non disponible');
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Afficher un fond blanc
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      console.log(`Page ${pageNum} rendue`);
    } catch (err) {
      console.error(`Erreur de rendu de la page ${pageNum}:`, err);
    }
  };

  // Effect pour rendre la page quand elle change
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage, pdfDoc);
    }
  }, [currentPage, scale, pdfDoc]);

  // Charger la progression de lecture
  useEffect(() => {
    const loadProgress = async () => {
      if (user?.id && book?.id && !loading) {
        try {
          const progress = await getReadingProgressByUserAndBook(
            user.id,
            book.id
          );
          if (progress && progress.current_page) {
            setCurrentPage(progress.current_page);
            setLastSavedPage(progress.current_page);
          }
        } catch (err) {
          console.error('Erreur de chargement de la progression:', err);
        }
      }
    };

    loadProgress();
  }, [user?.id, book?.id, loading, getReadingProgressByUserAndBook]);

  // Sauvegarder la progression avec délai
  useEffect(() => {
    if (user?.id && book?.id && !loading && pdfDoc) {
      const timer = setTimeout(() => {
        const progressData: ReadingProgress = {
          user_id: user.id,
          book_id: book.id,
          current_page: currentPage,
          last_read: new Date().toISOString()
        } as ReadingProgress;
        
        updateReadingProgress(progressData);
        setLastSavedPage(currentPage);
        console.log("Progression sauvegardée automatiquement:", currentPage);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentPage, user?.id, book?.id, loading, pdfDoc, updateReadingProgress]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Navigation par clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]);

  // Ajout de navigation par clic sur les côtés de la page
  const handleTapNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const clickX = e.clientX;
    
    // Si on clique dans le tiers gauche de l'écran, on va à la page précédente
    if (clickX < containerWidth / 3) {
      goToPrevPage();
    }
    // Si on clique dans le tiers droit de l'écran, on va à la page suivante
    else if (clickX > (containerWidth * 2) / 3) {
      goToNextPage();
    }
  };

  // Support pour les gestures tactiles (swipe)
  useEffect(() => {
    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      
      // Swipe de droite à gauche -> page suivante
      if (diffX < -75 && currentPage < totalPages) {
        goToNextPage();
      }
      // Swipe de gauche à droite -> page précédente
      else if (diffX > 75 && currentPage > 1) {
        goToPrevPage();
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentPage, totalPages]);

  const toggleNotes = () => {
    setSidebarMode(sidebarMode === 'notes' ? null : 'notes');
    setShowAddNote(false);
  };

  const toggleBookmarks = () => {
    setSidebarMode(sidebarMode === 'bookmarks' ? null : 'bookmarks');
    setShowAddNote(false);
  };

  const toggleComments = () => {
    setSidebarMode(sidebarMode === 'comments' ? null : 'comments');
    setShowAddNote(false);
  };

  const toggleAddNote = () => {
    setShowAddNote(!showAddNote);
    setSidebarMode(null);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const toggleHeader = () => {
    setHeaderCollapsed(!headerCollapsed);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading PDF
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative pt-16"> {/* Ajout de pt-16 pour le décalage initial */}
      {/* Header - position fixe et z-index élevé */}
      <div className={`fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out ${headerCollapsed ? 'h-12 overflow-hidden' : 'h-auto'} bg-gray-100 px-4 py-3 border-b border-gray-300 shadow-md z-50`}>
        <div className="flex justify-between items-center">
          <div className="flex-1 flex items-center">
            {/* Bouton de fermeture */}
            <button
              onClick={closeReader}
              className="p-2 mr-3 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Retour au profil"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div>
              <h3 className="font-serif font-bold text-gray-800 truncate">{book.title}</h3>
              {!headerCollapsed && <p className="text-sm text-gray-600">{book.author}</p>}
            </div>
          </div>
          
          {/* Indicateur de page au centre */}
          <div className="text-sm text-gray-600 mx-2">
            Page {currentPage} sur {totalPages}
          </div>
          
          {/* Contrôles centraux */}
          {!headerCollapsed && (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Zoom controls */}
              <button
                onClick={zoomOut}
                className="p-2 rounded-full hover:bg-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 rounded-full hover:bg-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              
              <div className="h-6 border-l border-gray-300 mx-1"></div>
              
              <button
                onClick={toggleNotes}
                className={`p-2 rounded-full ${sidebarMode === 'notes' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200'}`}
                title="Notes"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={toggleBookmarks}
                className={`p-2 rounded-full ${sidebarMode === 'bookmarks' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200'}`}
                title="Bookmarks"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                onClick={toggleComments}
                className={`p-2 rounded-full ${sidebarMode === 'comments' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200'}`}
                title="Comments"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={toggleAddNote}
                className={`p-2 rounded-full ${showAddNote ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200'}`}
                title="Add Note"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Bouton pour afficher/masquer le header */}
          <button
            onClick={toggleHeader}
            className="p-2 rounded-full hover:bg-gray-200 ml-2"
            title={headerCollapsed ? "Afficher le menu" : "Masquer le menu"}
          >
            {headerCollapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* PDF Reader - avec gestion des clics pour navigation */}
      <div 
        className="flex flex-1 relative"
        ref={containerRef}
        onClick={handleTapNavigation}
      >
        <div className="flex-1 bg-gray-800 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p>Chargement du PDF...</p>
            </div>
          ) : (
            <div className="overflow-auto flex justify-center items-center h-full w-full">
              <canvas
                ref={canvasRef}
                className="shadow-lg"
                style={{ backgroundColor: 'white' }}
              />
            </div>
          )}
        </div>

        {/* Sidebars */}
        {sidebarMode === 'notes' && (
          <div className="w-80 bg-gray-50 border-l border-gray-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex justify-between">
              <h3 className="font-semibold">Vos Notes</h3>
              <button onClick={() => setSidebarMode(null)} className="hover:bg-gray-200 p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            {user && (
              <NotesList
                userId={user.id}
                bookId={book.id}
                onNoteClick={setCurrentPage}
              />
            )}
          </div>
        )}

        {sidebarMode === 'bookmarks' && (
          <div className="w-80 bg-gray-50 border-l border-gray-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex justify-between">
              <h3 className="font-semibold">Marque-pages</h3>
              <button onClick={() => setSidebarMode(null)} className="hover:bg-gray-200 p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            {user && (
              <BookmarksList
                userId={user.id}
                bookId={book.id}
                currentPage={currentPage}
                onBookmarkClick={setCurrentPage}
              />
            )}
          </div>
        )}

        {sidebarMode === 'comments' && (
          <div className="w-80 bg-gray-50 border-l border-gray-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex justify-between">
              <h3 className="font-semibold">Avis sur le livre</h3>
              <button onClick={() => setSidebarMode(null)} className="hover:bg-gray-200 p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <CommentSection bookId={book.id} />
            </div>
          </div>
        )}

        {showAddNote && (
          <div className="w-80 bg-gray-50 border-l border-gray-300 overflow-y-auto">
            <div className="p-4 border-b border-gray-300 flex justify-between">
              <h3 className="font-semibold">Ajouter une note</h3>
              <button onClick={toggleAddNote} className="hover:bg-gray-200 p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            {user && (
              <AddNoteForm
                userId={user.id}
                bookId={book.id}
                pageNumber={currentPage}
                onNoteSaved={() => setShowAddNote(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFReader;