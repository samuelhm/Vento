import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient";
import type { CategoryNode } from "../types";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await httpClient.get("/catalog/categories/tree");
        const payload = response.data;
        setCategories(Array.isArray(payload.data) ? payload.data : []);
      } catch {
        setCategoriesError("No se pudieron cargar las categorías");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  return { categories, isLoadingCategories, categoriesError };
};
