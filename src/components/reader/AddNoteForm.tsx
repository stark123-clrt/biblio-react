// components/reader/AddNoteForm.tsx
import { useState } from 'react';
import { useBooks } from '../../contexts/BookContext';
import { Save } from 'lucide-react';

interface AddNoteFormProps {
  userId: string;
  bookId: string;
  pageNumber: number;
  onNoteSaved: () => void;
}

const AddNoteForm = ({
  userId,
  bookId,
  pageNumber,
  onNoteSaved,
}: AddNoteFormProps) => {
  const { addNote } = useBooks();
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!noteText.trim()) {
      setError('Please enter a note');
      return;
    }

    setLoading(true);

    try {
      await addNote({
        user_id: userId,
        book_id: bookId,
        note_text: noteText,
        page_number: pageNumber,
      });

      setNoteText('');
      onNoteSaved();
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="note-text"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Note
        </label>
        <textarea
          id="note-text"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Write your thoughts about this page..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </div>

      <div className="text-xs text-gray-500 mb-4">
        This note will be saved for page {pageNumber}.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </>
        )}
      </button>
    </form>
  );
};

export default AddNoteForm;
