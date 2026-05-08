import { useState } from 'react';
import httpClient from '../utils/httpClient';
import { notify } from '../utils/notifications';

interface ChatModalProps {
  seller: { id: string | number; name: string; memberSince?: string };
  productId: string | number;
  conversationId: string | number;
  onClose: () => void;
}

export const ChatModal = ({ seller, productId, conversationId, onClose }: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true); // Activate loading state
    
    try {
      await httpClient.post(`/chats/${conversationId}/messages`, {
        receiverId: seller.id,
        productId: productId,
        conversationId: conversationId,
        content: message,
      });
      onClose(); // Close modal on success
    } catch {
      notify('error', 'Chat', 'No se pudo enviar el mensaje.');
    } finally {
      setIsSubmitting(false); // Deactivate loading state regardless of success or failure
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden flex" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shrink-0">
              {seller.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Mensaje para {seller.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Input form section */}
        <form onSubmit={handleSendMessage} className="flex flex-col gap-5 p-6 bg-white shrink-0">
          <textarea
            className="w-full resize-none rounded-xl border border-teal-400 bg-white p-4 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all min-h-[140px]"
            placeholder="Hola, me interesa este artículo..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            autoFocus
            disabled={isSubmitting}
          />

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="rounded-full bg-[#9ADBC5] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#88CDB5] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};