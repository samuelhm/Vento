export type ProductActionResult =
  | {
      status: "error";
      message: string;
      code: number;
    }
  | {
      status: "success";
    }
  | undefined;

export type CategoryNode = {
  id: number;
  name: string;
  subcategories?: CategoryNode[];
};
