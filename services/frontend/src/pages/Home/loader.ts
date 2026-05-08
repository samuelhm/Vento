import httpClient from "../../utils/httpClient";
import type { Category, CategoryUI } from "../../types/categoryTypes";
import { CATEGORY_UI_CONFIG, DEFAULT_CATEGORY_CONFIG } from "./utils";
import { notify } from "../../utils/notifications";

export const homeLoader = async (): Promise<CategoryUI[]> => {
  try {
    const response = await httpClient.get("/catalog/categories");
    const categories: Category[] = response.data.data ?? [];

    return categories.map((cat) => {
      const config = CATEGORY_UI_CONFIG[cat.name.toLowerCase()] || DEFAULT_CATEGORY_CONFIG;

      return {
        ...cat,
        url: config.image,
        altText: config.alt, // Sobrescribimos el altText con el de nuestra configuración
      };
    });
  } catch {
    notify('error', 'Error de conexión', 'No se han podido cargar las categorías.');
    return [];
  }
};
