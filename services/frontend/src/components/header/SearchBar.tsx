import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeywords(params.get('keywords') || '');
  }, [location.search]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedKeywords = keywords.trim();

    if (trimmedKeywords) {
      params.set('keywords', trimmedKeywords);
    }
    params.set('page', '0');

    navigate(`/search?${params.toString()}`);
  };

 return (
    <form 
      onSubmit={handleSearchSubmit} 
      className="relative flex ml-4 mr-1 md:mx-4 w-full items-center"
    >
      <input
        type="search"
        value={keywords}
        onChange={(event) => setKeywords(event.target.value)}
        placeholder="Buscar productos"
        aria-label="Buscar productos"
        className="w-full h-10 rounded-full border border-slate-300 bg-white pl-4 pr-12 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-600"
      />
      <button
        type="submit"
        className="absolute right-2 p-2 text-slate-400 hover:text-[var(--color-primary)] cursor-pointer transition-colors"
        aria-label="Ejecutar búsqueda"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2.5" 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  );
};