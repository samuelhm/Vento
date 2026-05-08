import { useEffect, useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Form, useActionData, useLoaderData, useSubmit, useNavigation } from "react-router";
import { toast } from "sonner";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { InputText } from "../../components/InputText";
import { InputTextarea } from "../../components/InputTextarea/InputTextarea";
import { InputSelect } from "../../components/InputSelect/InputSelect";
import { useCategories } from "../CreateProduct/hooks/useCategories";
import type { EditProductActionResult, EditProductLoaderData } from "./types";
import { ImageUploadManager, type UploadedImage } from "../../components/ImageUploadManager";

type CategoryPath = {
  categoryId: string;
  subcategoryId: string;
  thirdLevelCategoryId: string;
};

const EMPTY_CATEGORY_PATH: CategoryPath = {
  categoryId: "",
  subcategoryId: "",
  thirdLevelCategoryId: "",
};

const findCategoryPath = (targetCategoryId: number, categories: ReturnType<typeof useCategories>["categories"]): CategoryPath => {
  for (const category of categories) {
    if (category.id === targetCategoryId) {
      return {
        categoryId: String(category.id),
        subcategoryId: "",
        thirdLevelCategoryId: "",
      };
    }

    for (const subcategory of category.subcategories ?? []) {
      if (subcategory.id === targetCategoryId) {
        return {
          categoryId: String(category.id),
          subcategoryId: String(subcategory.id),
          thirdLevelCategoryId: "",
        };
      }

      for (const thirdLevelCategory of subcategory.subcategories ?? []) {
        if (thirdLevelCategory.id === targetCategoryId) {
          return {
            categoryId: String(category.id),
            subcategoryId: String(subcategory.id),
            thirdLevelCategoryId: String(thirdLevelCategory.id),
          };
        }
      }
    }
  }

  return EMPTY_CATEGORY_PATH;
};

export const EditProduct = () => {
  const loaderData = useLoaderData() as EditProductLoaderData;
  const actionData = useActionData() as EditProductActionResult;
  const navigation = useNavigation();
  const submit = useSubmit();
  const { categories, isLoadingCategories, categoriesError } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [selectedThirdLevelCategoryId, setSelectedThirdLevelCategoryId] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);

  const isSubmitting = navigation.state === "submitting";

  // Error feedback
  useEffect(() => {
    if (actionData?.status === "error") {
      toast.error(actionData.message || "Error al actualizar el anuncio");
    }
  }, [actionData]);

  useEffect(() => {
    if (categories.length === 0 || selectedCategoryId) {
      return;
    }

    const categoryPath = findCategoryPath(loaderData.categoryId, categories);
    setSelectedCategoryId(categoryPath.categoryId);
    setSelectedSubcategoryId(categoryPath.subcategoryId);
    setSelectedThirdLevelCategoryId(categoryPath.thirdLevelCategoryId);
  }, [categories, selectedCategoryId, loaderData.categoryId]);

  const selectedCategory =
    categories.find((category) => String(category.id) === selectedCategoryId) ?? null;
  const availableSubcategories = selectedCategory?.subcategories ?? [];
  const selectedSubcategory =
    availableSubcategories.find((subcategory) => String(subcategory.id) === selectedSubcategoryId) ??
    null;
  const availableThirdLevelCategories = selectedSubcategory?.subcategories ?? [];

  const hasSubcategories = availableSubcategories.length > 0;
  const hasThirdLevelCategories = availableThirdLevelCategories.length > 0;

  const finalCategoryId =
    selectedThirdLevelCategoryId ||
    selectedSubcategoryId ||
    selectedCategoryId ||
    String(loaderData.categoryId || "");

  const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
    setImages(newImages);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priceStr = String(formData.get("price") ?? "").trim();
    const price = Number(priceStr);

    if (!title) {
      toast.warning("El título es obligatorio");
      return;
    }
    if (title.length < 5) {
      toast.warning("El título debe tener al menos 5 caracteres");
      return;
    }

    if (!description) {
      toast.warning("La descripción es obligatoria");
      return;
    }
    if (description.length > 700) {
      toast.warning("La descripción no puede superar los 700 caracteres");
      return;
    }

    if (!priceStr) {
      toast.warning("El precio es obligatorio");
      return;
    }
    if (isNaN(price) || price < 0) {
      toast.warning("El precio no puede ser negativo");
      return;
    }

    if (!finalCategoryId) {
      toast.warning("Debes seleccionar una categoría");
      return;
    }

    const finalFormData = new FormData(event.currentTarget);
    finalFormData.delete("images");

    const photosMetadata = images.map((img) => {
      if (img.existingPath) {
        return { type: "existing", value: img.existingPath };
      }
      if (img.file) {
        finalFormData.append("images", img.file);
        return { type: "new", value: img.id };
      }
      return null;
    }).filter(Boolean);

    finalFormData.append("photosMetadata", JSON.stringify(photosMetadata));

    submit(finalFormData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Editar</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Editar anuncio</h1>
        <p className="text-sm text-slate-500">Actualiza la información de tu producto</p>
      </div>

      <Form
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        noValidate
      >
        <InputText
          id="title"
          name="title"
          label="Título"
          defaultValue={loaderData.title}
        />

        <InputTextarea
          id="description"
          name="description"
          label="Descripción"
          defaultValue={loaderData.description}
          rows={4}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputText
            id="price"
            name="price"
            type="number"
            label="Precio (€)"
            defaultValue={String(loaderData.price)}
          />

          <InputSelect
            id="category"
            name="category"
            label="Categoría"
            disabled={isLoadingCategories || Boolean(categoriesError)}
            value={selectedCategoryId}
            onChange={(event) => {
              setSelectedCategoryId(event.target.value);
              setSelectedSubcategoryId("");
              setSelectedThirdLevelCategoryId("");
            }}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </InputSelect>
        </div>

        {selectedCategoryId && hasSubcategories ? (
          <InputSelect
            id="subcategory"
            name="subcategory"
            label="Subcategoría (opcional)"
            value={selectedSubcategoryId}
            onChange={(event) => {
              setSelectedSubcategoryId(event.target.value);
              setSelectedThirdLevelCategoryId("");
            }}
          >
            <option value="">Sin subcategoría</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </InputSelect>
        ) : null}

        {selectedSubcategoryId && hasThirdLevelCategories ? (
          <InputSelect
            id="thirdLevelCategory"
            name="thirdLevelCategory"
            label="Sub-subcategoría (opcional)"
            value={selectedThirdLevelCategoryId}
            onChange={(event) => {
              setSelectedThirdLevelCategoryId(event.target.value);
            }}
          >
            <option value="">Sin sub-subcategoría</option>
            {availableThirdLevelCategories.map((thirdLevelCategory) => (
              <option key={thirdLevelCategory.id} value={thirdLevelCategory.id}>
                {thirdLevelCategory.name}
              </option>
            ))}
          </InputSelect>
        ) : null}

        <input type="hidden" name="idCategory" value={finalCategoryId} />
        <input type="hidden" name="latitude" value={String(loaderData.latitude)} />
        <input type="hidden" name="longitude" value={String(loaderData.longitude)} />

        <ImageUploadManager 
          initialExistingImages={loaderData.existingPhotos}
          onImagesChange={handleImagesChange}
        />

        <ButtonPrimary
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </ButtonPrimary>
      </Form>
    </div>
  );
};
