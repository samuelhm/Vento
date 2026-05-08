export type EditProductLoaderData = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  latitude: number;
  longitude: number;
  existingPhotos: string[];
};

export type EditProductActionResult =
  | {
      status: "error";
      message: string;
      code: number;
    }
  | {
      status: "success";
    }
  | undefined;
