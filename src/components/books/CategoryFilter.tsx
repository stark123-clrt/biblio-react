import { useEffect, useState } from 'react';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, onSelectCategory }: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onSelectCategory(newCategory);
  };

  useEffect(() => {
    // Reset selected category when categories change
    setSelectedCategory(null);
  }, [categories]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
        {selectedCategory && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              onSelectCategory(null);
            }}
            className="px-4 py-2 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;