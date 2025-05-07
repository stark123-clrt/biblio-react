import { useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';
import { useBooks } from '../../contexts/BookContext';
import { BarChart as Chart, Clock, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  useEffect(() => {
    document.title = 'Admin Dashboard - Christian Library';
  }, []);

  const { books, comments } = useBooks();
  
  // Sort books by most recent
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get pending comments
  const pendingComments = comments.filter(comment => !comment.isValidated);
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin dashboard.</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Books */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-medium text-gray-800">Recent Books</h3>
            </div>
            <span className="text-xs font-medium bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
              {books.length} Total
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBooks.map(book => (
              <div key={book.id} className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="h-12 w-10 object-cover rounded"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {recentBooks.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No books available.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Pending Comments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <Chart className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-medium text-gray-800">Pending Comments</h3>
            </div>
            <span className="text-xs font-medium bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
              {pendingComments.length} Pending
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingComments.map(comment => (
              <div key={comment.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{comment.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{comment.commentText}</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < comment.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium hover:bg-green-200 transition-colors duration-200">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200 transition-colors duration-200">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingComments.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No pending comments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;