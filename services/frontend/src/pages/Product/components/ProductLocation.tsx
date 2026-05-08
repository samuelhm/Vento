import { Map } from "../../../components/Map";
import type { ProductLocationProps } from "../types";

export const ProductLocation = ({ latitude, longitude, hasExactLocation }: ProductLocationProps) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-lg font-bold text-gray-900">
      {hasExactLocation ? "Ubicación del producto" : "Ubicación aproximada"}
    </h3>
    <Map latitude={latitude} longitude={longitude} className="border border-gray-200" />
  </div>
);
