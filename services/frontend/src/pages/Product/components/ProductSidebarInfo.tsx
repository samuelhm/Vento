import type { ProductSidebarInfoProps } from "../types";

export const ProductSidebarInfo = ({ title, priceFormatted, categoryName, state }: ProductSidebarInfoProps) => {
  const stateBadge =
    state === "reserved"
      ? { label: "Reservado", className: "bg-amber-50 text-amber-700 ring-amber-600/20" }
      : state === "sold"
        ? { label: "Vendido", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" }
        : null;

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {categoryName && (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
            {categoryName}
          </span>
        )}

        {stateBadge && (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${stateBadge.className}`}>
            {stateBadge.label}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-4xl font-extrabold text-blue-600 mb-6">{priceFormatted}</p>
      <hr className="border-gray-100 mb-6" />
    </div>
  );
};
