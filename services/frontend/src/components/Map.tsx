import { useEffect, useMemo, useRef, useState } from "react";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-javascript-api";
const GOOGLE_MAPS_CALLBACK_NAME = "__ventoGoogleMapsInit";

let googleMapsScriptPromise: Promise<void> | null = null;

type GoogleMapsWindow = Window & {
  [GOOGLE_MAPS_CALLBACK_NAME]?: () => void;
  google?: {
    maps?: {
      Map: new (element: HTMLElement, options: Record<string, unknown>) => {
        setCenter: (position: { lat: number; lng: number }) => void;
        setZoom: (zoom: number) => void;
      };
      Marker: new (options: Record<string, unknown>) => {
        setPosition: (position: { lat: number; lng: number }) => void;
      };
    };
  };
};

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  const mapsWindow = window as GoogleMapsWindow;

  if (mapsWindow.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

    const onReady = () => {
      resolve();
      try {
        delete mapsWindow[GOOGLE_MAPS_CALLBACK_NAME];
      } catch {
        mapsWindow[GOOGLE_MAPS_CALLBACK_NAME] = undefined;
      }
    };

    mapsWindow[GOOGLE_MAPS_CALLBACK_NAME] = onReady;

    if (existingScript) {
      if (mapsWindow.google?.maps) {
        onReady();
        return;
      }

      existingScript.addEventListener("load", () => {
        if (mapsWindow.google?.maps) {
          onReady();
        }
      }, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps script failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&callback=${GOOGLE_MAPS_CALLBACK_NAME}`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      googleMapsScriptPromise = null;
      reject(new Error("Google Maps script failed to load."));
    };

    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
};

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: number | string;
  className?: string;
}

export const Map = ({
  latitude,
  longitude,
  zoom = 16,
  height = 320,
  className = "",
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<{ setCenter: (position: { lat: number; lng: number }) => void; setZoom: (zoom: number) => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  const wrapperStyle = useMemo(
    () => ({ height: typeof height === "number" ? `${height}px` : height }),
    [height],
  );

  useEffect(() => {
    let isCancelled = false;

    const renderMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setError("Missing VITE_GOOGLE_MAPS_API_KEY.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await loadGoogleMapsScript(apiKey);

        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const mapsWindow = window as GoogleMapsWindow;
        const mapsApi = mapsWindow.google?.maps;

        if (!mapsApi) {
          setError("Google Maps API is not available.");
          setIsLoading(false);
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new mapsApi.Map(mapContainerRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        } else {
          mapRef.current.setCenter(center);
          mapRef.current.setZoom(zoom);
        }

        setError(null);
      } catch {
        setError("No se pudo cargar Google Maps.");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    renderMap();

    return () => {
      isCancelled = true;
    };
  }, [center, zoom]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden bg-gray-100 ${className}`.trim()} style={wrapperStyle}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[220px]" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 bg-gray-100/70">
          Cargando mapa...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-red-600 px-4 text-center bg-gray-100/90">
          {error}
        </div>
      )}
    </div>
  );
};
