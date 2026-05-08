import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { ProductCard } from '../../components/ProductCard';
import { CategorySelector } from '../../components/CategorySelector';
import { MAX_RADIUS_KM, MIN_RADIUS_KM, SPANISH_CAPITALS } from './constants';
import type { SearchLoaderData } from './types';
import { useSearchLogic } from './useSearchLogic';

export const Search = () => {
  const initialData = useLoaderData() as SearchLoaderData;
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const {
    allProducts,
    totalItems,
    isLoading,
    hasMore,
    observerTarget,
    localFilters,
    priceError,
    userHasCoordinates,
    currentRadius,
    currentRadiusStep,
    handleFilterChange,
    handleRadiusPreviewChange,
    commitRadiusFilter,
    clearFilters,
  } = useSearchLogic(initialData);

  const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);

  return (
    <div className="min-h-screen bg-gray-50 w-full relative">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Buscar productos
            </h1>
            <p className="text-slate-600">
              {totalItems} {totalItems === 1 ? 'resultado' : 'resultados'} encontrados
            </p>
          </div>
          
          {/* Mobile Filter Trigger */}
          <button 
            onClick={toggleFilters}
            className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl shadow-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h7.5" />
            </svg>
            Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Backdrop for mobile */}
          {isFiltersOpen && (
            <div 
              className="fixed inset-0 bg-black/40 z-[998] lg:hidden backdrop-blur-sm"
              onClick={toggleFilters}
            />
          )}

          {/* Filters Aside */}
          <aside className={`
            fixed inset-y-0 left-0 z-[999] w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out px-6 py-8 overflow-y-auto
            lg:relative lg:translate-x-0 lg:z-0 lg:w-auto lg:max-w-none lg:shadow-none lg:p-0 lg:bg-transparent lg:inset-auto
            ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="lg:bg-white lg:rounded-xl lg:shadow-sm lg:p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h2 className="text-xl lg:text-lg font-bold lg:font-semibold text-gray-900">Filtros</h2>
                <button 
                  onClick={toggleFilters}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 lg:space-y-0">
                <CategorySelector
                  selectedCategoryId={localFilters.categoryId}
                  onCategoryChange={(categoryId) => handleFilterChange('categoryId', categoryId)}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio mínimo (€)
                  </label>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio máximo (€)
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    min="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="999999"
                  />
                  {priceError && (
                    <p className="mt-2 text-sm text-red-600">{priceError}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de publicación
                  </label>
                  <select
                    value={localFilters.timeFilter}
                    onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="">Todas las fechas</option>
                    <option value="today">Hoy</option>
                    <option value="lastWeek">Última semana</option>
                    <option value="lastMonth">Último mes</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={localFilters.orderBy}
                    onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price_low_to_high">Precio: menor a mayor</option>
                    <option value="price_high_to_low">Precio: mayor a menor</option>
                    <option value="closest">Más cercanos</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital de referencia
                  </label>
                  <select
                    value={userHasCoordinates && localFilters.originType === 'my_location' ? 'my_location' : localFilters.capitalId}
                    onChange={(e) => handleFilterChange('capitalId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {userHasCoordinates && (
                      <option value="my_location">Mi ubicación</option>
                    )}
                    {SPANISH_CAPITALS.map((capital) => (
                      <option key={capital.id} value={capital.id}>
                        {capital.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radio de búsqueda
                  </label>
                  <input
                    type="range"
                    min={MIN_RADIUS_KM}
                    max={MAX_RADIUS_KM}
                    step={currentRadiusStep}
                    value={currentRadius}
                    onChange={(event) => handleRadiusPreviewChange(event.target.value)}
                    onMouseUp={commitRadiusFilter}
                    onTouchEnd={commitRadiusFilter}
                    onKeyUp={commitRadiusFilter}
                    list="distance-marks"
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <datalist id="distance-marks">
                    <option value="1" label="1" />
                    <option value="20" label="20" />
                    <option value="50" label="50" />
                    <option value="100" label="100" />
                    <option value="300" label="300" />
                    <option value="500" label="500" />
                    <option value="750" label="750" />
                    <option value="1000" label="1000" />
                  </datalist>
                  <p className="mt-2 text-sm text-gray-600">Radio: {localFilters.radius} km</p>
                </div>

                <div className="space-y-2 pt-4 lg:pt-0">
                  <button
                    onClick={() => {
                      clearFilters();
                      if (window.innerWidth < 1024) toggleFilters();
                    }}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 lg:py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="lg:hidden w-full bg-[var(--color-primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer"
                  >
                    Ver resultados
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {allProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mb-4 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gray-100">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {isLoading && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}

                {hasMore && <div ref={observerTarget} className="mt-8 h-10" />}

              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
