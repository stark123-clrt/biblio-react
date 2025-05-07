import { useBooks } from '../../contexts/BookContext';
import { Book, BookOpen, Users, MessageSquare } from 'lucide-react';

const DashboardStats = () => {
  const { books, categories, comments } = useBooks();
  
  const stats = [
    { 
      label: 'Total Books',
      value: books.length,
      icon: <Book className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800',
    },
    { 
      label: 'Categories',
      value: categories.length,
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100 text-green-800',
    },
    { 
      label: 'Comments',
      value: comments.length,
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800',
    },
    { 
      label: 'Users',
      value: 2, // Mock value from mockUsers
      icon: <Users className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-100 text-amber-800',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className={`px-2 py-1 text-xs rounded-full ${stat.color}`}>
              Active
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;