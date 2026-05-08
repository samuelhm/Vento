import type { ProductDescriptionProps } from "../types";

export const ProductDescription = ({ description }: ProductDescriptionProps) => (
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
    <h3 className="text-lg font-bold text-gray-900 mb-2">Descripción del producto</h3>
    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
  </div>
);
