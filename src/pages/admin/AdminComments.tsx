import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooks } from '../../contexts/BookContext';
import { Comment } from '../../types';
import { Search, Check, X } from 'lucide-react';

const AdminComments = () => {
  const { comments, books } = useBooks();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments);

  useEffect(() => {
    document.title = 'Manage Comments - Admin Dashboard';
  }, []);

  useEffect(() => {
    let filtered = [...comments];
    
    // Apply status filter
    if (filter === 'pending') {
      filtered = filtered.filter(comment => !comment.isValidated);
    } else if (filter === 'approved') {
      filtered = filtered.filter(comment => comment.isValidated);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comment => 
        comment.commentText.toLowerCase().includes(query) || 
        comment.username.toLowerCase().includes(query)
      );
    }
    
    // Sort by most recent
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredComments(filtered);
  }, [comments, filter, searchQuery]);

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Comments</h1>
        <p className="text-gray-600">Review and moderate user comments.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search comments or username"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="flex">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm border-t border-b border-l border-gray-300 rounded-l-md ${
                filter === 'all' 
                  ? 'bg-gray-100 text-gray-800 font-medium' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm border border-gray-300 ${
                filter === 'pending' 
                  ? 'bg-gray-100 text-gray-800 font-medium' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 text-sm border-t border-b border-r border-gray-300 rounded-r-md ${
                filter === 'approved' 
                  ? 'bg-gray-100 text-gray-800 font-medium' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Approved
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComments.map(comment => (
                <tr key={comment.id} className={`hover:bg-gray-50 ${!comment.isValidated ? 'bg-amber-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{comment.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getBookTitle(comment.bookId)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">{comment.commentText}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comment.isValidated ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!comment.isValidated ? (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button className="text-red-600 hover:text-red-900">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredComments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComments;