import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';
import { useBooks } from '../../contexts/BookContext';
import { Plus, Edit } from 'lucide-react';
import { Category } from '../../types';

const AdminCategories = () => {
  const { categories, books } = useBooks();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  useEffect(() => {
    document.title = 'Manage Categories - Admin Dashboard';
  }, []);

  const countBooksInCategory = (categoryId: string) => {
    return books.filter(book => book.category_id === categoryId).length;
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedCategory(undefined);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gérer les catégories</h1>
          <p className="text-gray-600">Ajouter, modifier ou supprimer des catégories de livres.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCategory(undefined);
            setShowForm(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </button>
      </div>

      {showForm ? (
        <CategoryForm 
          category={selectedCategory}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedCategory(undefined);
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre de livres
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{countBooksInCategory(category.id)} livres</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {categories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune catégorie trouvée.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;