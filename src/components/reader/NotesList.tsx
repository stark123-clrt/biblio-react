// components/reader/NotesList.tsx
import { useEffect, useState } from 'react';
import { useBooks } from '../../contexts/BookContext';
import { Note } from '../../types';
import { BookOpen } from 'lucide-react';

interface NotesListProps {
  userId: string;
  bookId: string;
  onNoteClick: (pageNumber: number) => void; // Nouvelle prop pour la navigation
}

const NotesList = ({ userId, bookId, onNoteClick }: NotesListProps) => {
  const { getNotesByUserAndBook } = useBooks();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const notesData = await getNotesByUserAndBook(userId, bookId);
        setNotes(notesData);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [userId, bookId, getNotesByUserAndBook]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600 mx-auto mb-2"></div>
        Loading notes...
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>You haven't added any notes for this book yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 hover:bg-amber-50 cursor-pointer transition-colors"
          onClick={() => onNoteClick(note.page_number)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
              Page {note.page_number}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{note.note_text}</p>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
