import { CompactReviewItem } from '../../components/CompactReviewItem';
import { useLoaderData } from 'react-router';
import { ReviewsSummary } from '../../components/ReviewsSummary';
import type { MyReviewsLoaderData } from './loader';

export const MyReviews = () => {
  const { reviews, stats } = useLoaderData() as MyReviewsLoaderData;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Valoraciones
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Mis valoraciones
          </h1>
          <p className="text-sm text-slate-500">
            Estas son las reseñas que has recibido de otros usuarios
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
        <ReviewsSummary stats={stats} className="w-fit bg-transparent border-0 p-0 rounded-none" />
      </div>

      {reviews.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
            <span className="text-4xl">⭐</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Aún no tienes valoraciones
          </h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Las valoraciones de tus compradores y vendedores aparecerán aquí una vez que completes transacciones.
          </p>
        </div>
      ) : (
        <div className="flex flex-col pb-10">
          {reviews.map((review) => (
            <CompactReviewItem 
              key={review.id} 
              review={review} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
