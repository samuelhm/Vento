import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { Product } from '../../../types/searchTypes';
import httpClient from '../../../utils/httpClient';
import { notify } from '../../../utils/notifications';

interface ReviewSellerModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmitted: (listingId: string) => void;
}

const STARS = [1, 2, 3, 4, 5] as const;

export const ReviewSellerModal = ({
  isOpen,
  product,
  onClose,
  onSubmitted,
}: ReviewSellerModalProps) => {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewLength = useMemo(() => review.trim().length, [review]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStars(0);
    setReview('');
  }, [isOpen, product?.id]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const trimmedReview = review.trim();

    if (stars === 0) {
      notify('error', 'Selecciona una puntuacion antes de enviar');
      return;
    }

    if (trimmedReview.length === 0) {
      notify('error', 'Escribe una valoracion para continuar');
      return;
    }

    try {
      setIsSubmitting(true);

      await httpClient.post('/catalog/reviews', {
        listingId: product.id,
        stars,
        review: trimmedReview,
      });

      onSubmitted(product.id);
      notify('success', 'Valoracion enviada correctamente');
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        onSubmitted(product.id);
        notify('info', 'Ya habias valorado esta compra');
        onClose();
        return;
      }

      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || 'No se pudo enviar la valoracion'
        : 'No se pudo enviar la valoracion';

      notify('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Valoraciones
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Evaluar vendedor</h2>
        <p className="mt-1 text-sm text-slate-500">
          Comparte tu experiencia con el producto {product.title}.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Puntuacion</label>
          <div className="flex items-center gap-2">
            {STARS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStars(value)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-lg transition ${
                  value <= stars
                    ? 'bg-amber-100 text-amber-500'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
                aria-label={`Puntuar con ${value} estrella${value > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="review-text">
            Comentario
          </label>
          <textarea
            id="review-text"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            maxLength={700}
            rows={4}
            placeholder="Describe como fue tu experiencia con el vendedor"
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-right text-xs text-slate-400">{reviewLength}/700</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar valoracion'}
          </button>
        </div>
      </div>
    </div>
  );
};
