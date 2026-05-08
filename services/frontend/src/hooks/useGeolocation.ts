import { useEffect, useState } from 'react';

export type GeoStatus = 'loading' | 'success' | 'error';

type Coordinates = {
  lat: number;
  lng: number;
};

export const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('loading');
  const [geoError, setGeoError] = useState<string>('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoError('Tu navegador no soporta geolocalización');
      return;
    }

    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGeoStatus('success');
        setGeoError('');
      },
      (error) => {
        setGeoStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Debes permitir la geolocalización para registrarte');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError('Tu ubicación no está disponible');
        } else {
          setGeoError('Error al obtener tu ubicación');
        }
      }
    );
  }, []);

  return { coordinates, geoStatus, geoError };
};
