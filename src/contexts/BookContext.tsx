import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Book, Category, Comment, Note, ReadingProgress } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface BookContextType {
  books: Book[];
  categories: Category[];
  comments: Comment[];
  notes: Note[];
  readingProgress: ReadingProgress[];
  filteredBooks: Book[];
  setFilteredBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  getBookById: (id: string) => Book | undefined;
  getBooksByCategory: (categoryId: string) => Book[];
  getCommentsByBookId: (bookId: string) => Comment[];
  getNotesByUserAndBook: (userId: string, bookId: string) => Promise<Note[]>;
  getReadingProgressByUserAndBook: (
    userId: string,
    bookId: string
  ) => Promise<ReadingProgress | undefined>;
  addComment: (comment: Omit<Comment, 'id' | 'created_at'>) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'created_at'>) => Promise<void>;
  updateReadingProgress: (progress: {
    user_id: string;
    book_id: string;
    current_page: number;
  }) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*');
      if (categoriesData) setCategories(categoriesData);

      // Load books
      const { data: booksData } = await supabase.from('books').select('*');
      if (booksData) {
        setBooks(booksData);
        setFilteredBooks(booksData);
      }

      // Load validated comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('is_validated', true);
      if (commentsData) setComments(commentsData);

      // AJOUT ICI: Charger les données de progression de lecture
      const { data: progressData, error: progressError } = await supabase
        .from('reading_progress')
        .select('*');

      if (progressError) {
        console.error('Error loading reading progress:', progressError);
      } else if (progressData) {
        console.log('Reading progress loaded:', progressData.length, 'records');
        setReadingProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    }
  };

  const getBookById = (id: string) => {
    return books.find((book) => book.id === id);
  };

  const getBooksByCategory = (categoryId: string) => {
    return books.filter((book) => book.category_id === categoryId);
  };

  const getCommentsByBookId = (bookId: string) => {
    return comments.filter(
      (comment) => comment.book_id === bookId && comment.is_validated
    );
  };

  const getNotesByUserAndBook = async (userId: string, bookId: string) => {
    if (!userId || !bookId) return [];

    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId);

      return data || [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  };

  const getReadingProgressByUserAndBook = async (
    userId: string,
    bookId: string
  ) => {
    if (!userId || !bookId) return undefined;

    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching reading progress:', error);
        return undefined;
      }

      return data || undefined;
    } catch (error) {
      console.error('Error loading reading progress:', error);
      return undefined;
    }
  };

  const addComment = async (comment: Omit<Comment, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setComments((prev) => [...prev, data]);
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'created_at'>) => {
    try {
      // Validate required fields
      if (!note.note_text?.trim()) {
        throw new Error('Note text is required');
      }
      if (!note.user_id) {
        throw new Error('User ID is required');
      }
      if (!note.book_id) {
        throw new Error('Book ID is required');
      }
      if (typeof note.page_number !== 'number' || note.page_number < 1) {
        throw new Error('Valid page number is required');
      }

      // Insertion dans Supabase avec gestion optimisée des erreurs
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: note.user_id,
            book_id: note.book_id,
            note_text: note.note_text.trim(),
            page_number: note.page_number,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Error adding note');
      }

      if (data && data.length > 0) {
        setNotes((prev) => [...prev, data[0]]);
        toast.success('Note added successfully');
        return data[0];
      } else {
        throw new Error('No data returned from the database');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error adding note');
      }
      throw error;
    }
  };

  const updateReadingProgress = async (progress: {
    user_id: string;
    book_id: string;
    current_page: number;
  }) => {
    if (!progress.user_id || !progress.book_id) {
      console.error('Invalid user_id or book_id');
      return;
    }

    try {
      const { data: existingProgress } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', progress.user_id)
        .eq('book_id', progress.book_id)
        .maybeSingle();

      if (existingProgress) {
        const { error: updateError } = await supabase
          .from('reading_progress')
          .update({
            current_page: progress.current_page,
            last_read: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('reading_progress')
          .insert([
            {
              user_id: progress.user_id,
              book_id: progress.book_id,
              current_page: progress.current_page,
              last_read: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating reading progress:', error);
      toast.error('Error updating reading progress');
    }
  };

  const value = {
    books,
    categories,
    comments,
    notes,
    readingProgress,
    filteredBooks,
    setFilteredBooks,
    getBookById,
    getBooksByCategory,
    getCommentsByBookId,
    getNotesByUserAndBook,
    getReadingProgressByUserAndBook,
    addComment,
    addNote,
    updateReadingProgress,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
