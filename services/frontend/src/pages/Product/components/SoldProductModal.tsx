import type { SaleCandidate } from "../types";

interface SoldProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidates: SaleCandidate[];
  selectedBuyerId: string;
  onSelectBuyer: (buyerId: string) => void;
  isLoading?: boolean;
}

export const SoldProductModal = ({
  isOpen,
  onClose,
  onConfirm,
  candidates,
  selectedBuyerId,
  onSelectBuyer,
  isLoading = false,
}: SoldProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden p-6 gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-800">Marcar como vendido</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Selecciona el comprador entre los usuarios con los que ya has chateado sobre este producto.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="buyer-select" className="text-sm font-medium text-slate-700">
            Comprador
          </label>
          <select
            id="buyer-select"
            value={selectedBuyerId}
            onChange={(e) => onSelectBuyer(e.target.value)}
            disabled={isLoading || candidates.length === 0}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">Selecciona un usuario</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-full px-5 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !selectedBuyerId}
            className="flex-1 rounded-full px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Confirmar venta"}
          </button>
        </div>
      </div>
    </div>
  );
};
