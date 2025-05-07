// components/reader/BookmarksList.tsx
import { useEffect, useState } from 'react';
import { Bookmark, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  page_number: number;
  title: string;
  created_at: string;
}

interface BookmarksListProps {
  userId: string;
  bookId: string;
  currentPage: number;
  onBookmarkClick: (pageNumber: number) => void;
}

const BookmarksList = ({
  userId,
  bookId,
  currentPage,
  onBookmarkClick,
}: BookmarksListProps) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .order('page_number', { ascending: true });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId, bookId]);

  const addBookmark = async () => {
    try {
      const { error } = await supabase.from('bookmarks').insert([
        {
          user_id: userId,
          book_id: bookId,
          page_number: currentPage,
          title: bookmarkTitle || `Page ${currentPage}`,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          toast.error('You already have a bookmark for this page');
        } else {
          throw error;
        }
      } else {
        toast.success('Bookmark added');
        fetchBookmarks();
        setShowAddForm(false);
        setBookmarkTitle('');
      }
    } catch (err) {
      console.error('Error adding bookmark:', err);
      toast.error('Failed to add bookmark');
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);

      if (error) throw error;

      toast.success('Bookmark removed');
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600 mx-auto mb-2"></div>
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">Bookmarks</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200"
          title={showAddForm ? 'Cancel' : 'Add bookmark for current page'}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <div className="text-sm text-gray-700 mb-2">
            Add bookmark for page {currentPage}:
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Bookmark title (optional)"
              value={bookmarkTitle}
              onChange={(e) => setBookmarkTitle(e.target.value)}
              className="flex-grow px-2 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={addBookmark}
              className="px-3 py-1 bg-amber-600 text-white text-sm rounded-r-md hover:bg-amber-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-4">
          <Bookmark className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No bookmarks yet.</p>
          <p>Click the + button to add one for the current page.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:bg-amber-50 cursor-pointer"
            >
              <div
                className="flex-grow"
                onClick={() => onBookmarkClick(bookmark.page_number)}
              >
                <div className="font-medium text-gray-800">
                  {bookmark.title}
                </div>
                <div className="text-xs text-gray-500">
                  Page {bookmark.page_number}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(bookmark.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Remove bookmark"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksList;
