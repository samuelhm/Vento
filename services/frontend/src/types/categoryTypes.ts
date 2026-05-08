export type Category = {
  id: number;
  name: string;
  count: number;
  altText: string;
  imageUrl: string;
};

export type CategoryUI = Category & {
  url: string;
};
