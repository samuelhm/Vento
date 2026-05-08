import { useState, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Form, useActionData, useSubmit, useNavigation } from 'react-router';
import { toast } from 'sonner';
import { ButtonPrimary } from '../../components/ButtonPrimary';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCategories } from './hooks/useCategories';
import type { ProductActionResult } from './types';
import { InputText } from '../../components/InputText';
import { InputTextarea } from '../../components/InputTextarea/InputTextarea';
import { InputSelect } from '../../components/InputSelect/InputSelect';
import { ImageUploadManager, type UploadedImage } from '../../components/ImageUploadManager';

export const CreateProduct = () => {
  const actionData = useActionData() as ProductActionResult;
  const navigation = useNavigation();
  const { categories, isLoadingCategories, categoriesError } = useCategories();
  const { coordinates, geoStatus, geoError } = useGeolocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [selectedThirdLevelCategoryId, setSelectedThirdLevelCategoryId] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const submit = useSubmit();

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.status === 'error') {
      toast.error(actionData.message || 'Error al crear el producto');
    }
  }, [actionData]);

  const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
    setImages(newImages);
  }, []);

  const selectedCategory =
    categories.find((category) => String(category.id) === selectedCategoryId) ?? null;
  const availableSubcategories = selectedCategory?.subcategories ?? [];
  const selectedSubcategory =
    availableSubcategories.find(
      (subcategory) => String(subcategory.id) === selectedSubcategoryId
    ) ?? null;
  const availableThirdLevelCategories = selectedSubcategory?.subcategories ?? [];
  const hasSubcategories = availableSubcategories.length > 0;
  const hasThirdLevelCategories = availableThirdLevelCategories.length > 0;
  const finalCategoryId =
    selectedThirdLevelCategoryId || selectedSubcategoryId || selectedCategoryId;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const priceStr = String(formData.get('price') ?? '').trim();
    const price = Number(priceStr);

    if (!title) {
      toast.warning('El título es obligatorio');
      return;
    }
    if (title.length < 5) {
      toast.warning('El título debe tener al menos 5 caracteres');
      return;
    }

    if (!description) {
      toast.warning('La descripción es obligatoria');
      return;
    }
    if (description.length > 700) {
      toast.warning('La descripción no puede superar los 700 caracteres');
      return;
    }

    if (!priceStr) {
      toast.warning('El precio es obligatorio');
      return;
    }
    if (isNaN(price) || price < 0) {
      toast.warning('El precio no puede ser negativo');
      return;
    }

    if (!selectedCategoryId) {
      toast.warning('Debes seleccionar una categoría para publicar');
      return;
    }

    if (geoStatus !== 'success') {
      toast.error(geoError || 'Debes permitir el acceso a tu ubicación para publicar');
      return;
    }

    const finalFormData = new FormData(event.currentTarget);
    finalFormData.delete('images');

    images.forEach((img) => {
      if (img.file) {
        finalFormData.append('images', img.file);
      }
    });

    submit(finalFormData, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Publicar</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Nuevo producto</h1>
        <p className="text-sm text-slate-500">Completa los datos para crear tu anuncio</p>
      </div>

      <Form
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        noValidate // Desactiva validaciones nativas del navegador
      >
        <InputText id="title" name="title" label="Título" />

        <InputTextarea id="description" name="description" label="Descripción" rows={4} />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputText
            id="price"
            name="price"
            type="number"
            label="Precio (€)"
          />

          <InputSelect
            id="category"
            name="category"
            label="Categoría"
            disabled={isLoadingCategories || Boolean(categoriesError)}
            value={selectedCategoryId}
            onChange={(event) => {
              setSelectedCategoryId(event.target.value);
              setSelectedSubcategoryId('');
              setSelectedThirdLevelCategoryId('');
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
              setSelectedThirdLevelCategoryId('');
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

        <ImageUploadManager onImagesChange={handleImagesChange} />

        {coordinates ? (
          <>
            <input type="hidden" name="latitude" value={coordinates.lat} />
            <input type="hidden" name="longitude" value={coordinates.lng} />
          </>
        ) : null}

        <ButtonPrimary
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar producto'}
        </ButtonPrimary>
      </Form>
    </div>
  );
};
