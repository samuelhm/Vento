import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import axios from "axios";
import httpClient from "../../utils/httpClient";

type EditProductActionError = {
  status: "error";
  message: string;
  code: number;
};

const createEditProductActionError = (message: string, code: number): EditProductActionError => ({
  status: "error",
  message,
  code,
});

export const editProductAction = async ({ request, params }: ActionFunctionArgs) => {
  const listingId = params.id;

  if (!listingId) {
    return createEditProductActionError("No se encontró el anuncio a editar", 400);
  }

  const formData = await request.formData();

  try {
    const listingResponse = await httpClient.get(`/catalog/listings/${listingId}`);
    const listingState = String(listingResponse.data?.data?.state ?? "").toLowerCase();

    if (listingState === "sold") {
      return createEditProductActionError("No puedes editar un anuncio vendido", 403);
    }
  } catch {
    return createEditProductActionError("No se pudo validar el estado del anuncio", 400);
  }

  const photosMetadataRaw = String(formData.get("photosMetadata") ?? "");
  const photosMetadata: Array<{ type: "existing" | "new"; value: string }> = photosMetadataRaw
    ? JSON.parse(photosMetadataRaw)
    : [];

  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  let uploadedFiles: string[] = [];
  if (imageFiles.length > 0) {
    try {
      const mediaFormData = new FormData();

      imageFiles.forEach((imageFile, index) => {
        const generatedName = `product_${crypto.randomUUID()}_${index + 1}.webp`;
        mediaFormData.append("names", generatedName);
        mediaFormData.append("images", imageFile);
      });

      const mediaResponse = await httpClient.post("/media/upload", mediaFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      uploadedFiles = mediaResponse.data?.data?.files ?? [];
    } catch (error: unknown) {
      const backendMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      const statusCode = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;

      return createEditProductActionError(
        backendMessage ?? "No se pudieron subir las imágenes",
        statusCode
      );
    }
  }

  const photos: Array<{ path: string; position: number }> = [];

  if (photosMetadata.length > 0) {
    let newImageIndex = 0;
    photosMetadata.forEach((meta, index) => {
      if (meta.type === "existing") {
        photos.push({ path: meta.value, position: index + 1 });
      } else if (meta.type === "new") {
        const path = uploadedFiles[newImageIndex];
        if (path) {
          photos.push({ path, position: index + 1 });
          newImageIndex++;
        }
      }
    });
  } else {
    const existingPhotoPaths = formData
      .getAll("existingPhotoPaths")
      .map((entry) => String(entry))
      .filter(Boolean);

    existingPhotoPaths.forEach((path, index) => {
      photos.push({ path, position: index + 1 });
    });

    uploadedFiles.forEach((path, index) => {
      photos.push({ path, position: existingPhotoPaths.length + index + 1 });
    });
  }


  const latitude = Number(formData.get("latitude") ?? 0);
  const longitude = Number(formData.get("longitude") ?? 0);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return createEditProductActionError("No se pudo validar la ubicación del anuncio", 400);
  }

  try {
    await httpClient.put(`/catalog/listings/${listingId}`, {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      latitude,
      longitude,
      idCategory: Number(formData.get("idCategory") ?? 0),
      photos,
    });

    return redirect(`/product/${listingId}?updated=true`);
  } catch (error: unknown) {
    const backendMessage = axios.isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    const statusCode = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;

    return createEditProductActionError(backendMessage ?? "No se pudo actualizar el anuncio", statusCode);
  }
};
