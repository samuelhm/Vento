import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import axios from "axios";
import httpClient from "../../utils/httpClient";

type ProductActionError = {
  status: "error";
  message: string;
  code: number;
};

const createProductActionError = (message: string, code: number): ProductActionError => ({
  status: "error",
  message,
  code,
});

export const createProductAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return createProductActionError("No se pudo obtener tu ubicación", 400);
  }

  const photos: Array<{ path: string; position: number }> = [];

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

      const uploadedFiles: string[] = mediaResponse.data?.data?.files ?? [];
      uploadedFiles.forEach((path, index) => {
        photos.push({ path, position: index + 1 });
      });
    } catch (error: unknown) {
      const backendMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      const statusCode = axios.isAxiosError(error)
        ? (error.response?.status ?? 500)
        : 500;
      return createProductActionError(
        backendMessage ?? "No se pudieron subir las imágenes",
        statusCode
      );
    }
  }

  try {
    await httpClient.post("/catalog/listings", {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      latitude,
      longitude,
      idCategory: Number(formData.get("idCategory") ?? 0),
      photos,
    });

    return redirect("/my-products?created=true");
  } catch (error: unknown) {
    const backendMessage = axios.isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    const statusCode = axios.isAxiosError(error)
      ? (error.response?.status ?? 500)
      : 500;

    return createProductActionError(
      backendMessage ?? "No se pudo crear el producto",
      statusCode
    );
  }
};
