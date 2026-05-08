import { useEffect, useMemo, useState } from "react";

interface OfferModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  buyerName: string;
  onClose: () => void;
  onSubmit: (payload: { price: number; message: string }) => void;
}

const formatOfferValue = (priceInput: string) => {
  if (!priceInput.trim()) return "XXX";

  const parsed = Number(priceInput);
  if (!Number.isFinite(parsed) || parsed <= 0) return "XXX";

  const rounded = Number(parsed.toFixed(2));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};

export const OfferModal = ({
  isOpen,
  isSubmitting,
  buyerName,
  onClose,
  onSubmit,
}: OfferModalProps) => {
  const [priceInput, setPriceInput] = useState("");
  const [message, setMessage] = useState("");
  const [isCustomMessage, setIsCustomMessage] = useState(false);

  const defaultMessage = useMemo(() => {
    const formattedValue = formatOfferValue(priceInput);
    return `Hola, soy "${buyerName}" y me gustaria ofrecer "${formattedValue}€" por tu articulo.`;
  }, [buyerName, priceInput]);

  useEffect(() => {
    if (!isOpen) return;

    setPriceInput("");
    setMessage(`Hola, soy "${buyerName}" y me gustaria ofrecer "XXX€" por tu articulo.`);
    setIsCustomMessage(false);
  }, [isOpen, buyerName]);

  useEffect(() => {
    if (!isOpen || isCustomMessage) return;
    setMessage(defaultMessage);
  }, [defaultMessage, isCustomMessage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedPrice = Number(priceInput);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return;

    if (!message.trim()) return;

    onSubmit({
      price: parsedPrice,
      message: message.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800">Enviar oferta</h3>
          <p className="mt-1 text-sm text-slate-500">
            Introduce tu precio y, si quieres, personaliza el mensaje para el vendedor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label htmlFor="offer-price" className="mb-1 block text-sm font-semibold text-slate-700">
              Precio ofertado (EUR)
            </label>
            <input
              id="offer-price"
              type="number"
              min="0"
              step="0.01"
              value={priceInput}
              onChange={(event) => setPriceInput(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Ejemplo: 120"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="offer-message" className="mb-1 block text-sm font-semibold text-slate-700">
              Mensaje al vendedor
            </label>
            <textarea
              id="offer-message"
              rows={4}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setIsCustomMessage(true);
              }}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => {
                setMessage(defaultMessage);
                setIsCustomMessage(false);
              }}
              className="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-700"
              disabled={isSubmitting}
            >
              Restaurar mensaje sugerido
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !priceInput.trim() ||
                Number(priceInput) <= 0 ||
                !message.trim()
              }
              className="rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-600 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar oferta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
