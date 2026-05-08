import { useLoaderData, useNavigate } from 'react-router';
import type { Product } from '../../../types/searchTypes';

export const useMySales = () => {
  const products = useLoaderData() as Product[];
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate('/my-products/new');
  };

  return {
    products,
    handleStartSelling,
  };
};
