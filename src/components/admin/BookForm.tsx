import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Category, Book } from '../../types';
import { Upload, X, Save, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface BookFormProps {
  book?: Book;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const BookForm = ({ book, categories, onSuccess, onCancel }: BookFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    description: book?.description || '',
    category_id: book?.category_id || '',
    publication_year: book?.publication_year?.toString() || '',
    page_count: book?.page_count?.toString() || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'pdf' | 'cover'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${type === 'pdf' ? 'books' : 'covers'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('library')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('library')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let file_path = book?.file_path;
      let cover_image = book?.cover_image;

      // Handle PDF upload
      if (fileInputRef.current?.files?.[0]) {
        file_path = await handleFileUpload(fileInputRef.current.files[0], 'pdf');
      }

      // Handle cover image upload
      if (coverInputRef.current?.files?.[0]) {
        cover_image = await handleFileUpload(coverInputRef.current.files[0], 'cover');
      }

      const bookData = {
        ...formData,
        file_path,
        cover_image,
        publication_year: parseInt(formData.publication_year),
        page_count: parseInt(formData.page_count)
      };

      if (book) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', book.id);

        if (error) throw error;
        toast.success('Livre mis à jour avec succès');
      } else {
        // Create new book
        const { error } = await supabase
          .from('books')
          .insert([bookData]);

        if (error) throw error;
        toast.success('Livre ajouté avec succès');
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?');
    if (!confirmed) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', book.id);

      if (error) throw error;

      toast.success('Livre supprimé avec succès');
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {book ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auteur
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            required
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année de publication
            </label>
            <input
              type="number"
              value={formData.publication_year}
              onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de pages
            </label>
            <input
              type="number"
              value={formData.page_count}
              onChange={(e) => setFormData({ ...formData, page_count: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fichier PDF
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {book?.file_path && (
            <p className="mt-1 text-sm text-gray-500">
              Fichier actuel : {book.file_path.split('/').pop()}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image de couverture
          </label>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {book?.cover_image && (
            <div className="mt-2">
              <img
                src={book.cover_image}
                alt="Couverture actuelle"
                className="h-20 w-auto object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          {book && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {book ? 'Mettre à jour' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;