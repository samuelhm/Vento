import { useState, useEffect } from 'react';
import httpClient from '../utils/httpClient';
import type { CategoryTree } from '../types/searchTypes';
import { notify } from '../utils/notifications';

interface CategorySelectorProps {
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategorySelector = ({ selectedCategoryId, onCategoryChange }: CategorySelectorProps) => {
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<CategoryTree | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<CategoryTree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await httpClient.get('/catalog/categories/tree');
        const categories: CategoryTree[] = response.data.data ?? [];
        setCategoryTree(categories);
      } catch {
        notify('error', 'Error de conexión', 'No se han podido cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId || categoryTree.length === 0) {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
      return;
    }

    const selectedId = Number.parseInt(selectedCategoryId, 10);
    if (Number.isNaN(selectedId)) {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
      return;
    }

    let matchedMainCategory: CategoryTree | null = null;
    let matchedSubCategory: CategoryTree | null = null;

    for (const mainCategory of categoryTree) {
      if (mainCategory.id === selectedId) {
        matchedMainCategory = mainCategory;
        break;
      }

      const directSubCategory = mainCategory.subcategories.find((sub) => sub.id === selectedId);
      if (directSubCategory) {
        matchedMainCategory = mainCategory;
        matchedSubCategory = directSubCategory;
        break;
      }

      for (const subCategory of mainCategory.subcategories) {
        const nestedSubCategory = subCategory.subcategories.find((nested) => nested.id === selectedId);
        if (nestedSubCategory) {
          matchedMainCategory = mainCategory;
          matchedSubCategory = subCategory;
          break;
        }
      }

      if (matchedMainCategory) {
        break;
      }
    }

    setSelectedMainCategory(matchedMainCategory);
    setSelectedSubCategory(matchedSubCategory);
  }, [selectedCategoryId, categoryTree]);

  const handleMainCategoryChange = (categoryId: string) => {
    if (!categoryId) {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
      onCategoryChange('');
      return;
    }

    const category = categoryTree.find(cat => cat.id.toString() === categoryId);
    setSelectedMainCategory(category || null);
    setSelectedSubCategory(null);
    onCategoryChange(categoryId);
  };

  const handleSubCategoryChange = (categoryId: string) => {
    if (!categoryId) {
      setSelectedSubCategory(null);
      if (selectedMainCategory) {
        onCategoryChange(selectedMainCategory.id.toString());
      }
      return;
    }

    const subCategory = selectedMainCategory?.subcategories.find(
      cat => cat.id.toString() === categoryId
    );
    setSelectedSubCategory(subCategory || null);
    onCategoryChange(categoryId);
  };

  const handleSubSubCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <div className="text-sm text-gray-500">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Categoría
      </label>

      {/* Main Categories */}
      <select
        value={selectedMainCategory?.id.toString() || ''}
        onChange={(e) => handleMainCategoryChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="">Todas las categorías</option>
        {categoryTree.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} ({category.count})
          </option>
        ))}
      </select>

      {/* Subcategories */}
      {selectedMainCategory && selectedMainCategory.subcategories.length > 0 && (
        <select
          value={selectedSubCategory?.id.toString() || ''}
          onChange={(e) => handleSubCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="">Todas las subcategorías</option>
          {selectedMainCategory.subcategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name} ({subCategory.count})
            </option>
          ))}
        </select>
      )}

      {/* Sub-subcategories */}
      {selectedSubCategory && selectedSubCategory.subcategories.length > 0 && (
        <select
          value={selectedCategoryId}
          onChange={(e) => handleSubSubCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value={selectedSubCategory.id}>Todas las opciones</option>
          {selectedSubCategory.subcategories.map((subSubCategory) => (
            <option key={subSubCategory.id} value={subSubCategory.id}>
              {subSubCategory.name} ({subSubCategory.count})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
