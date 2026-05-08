import { useEffect, useMemo, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../utils/httpClient';
import { useGeolocation } from '../hooks/useGeolocation';
import { Map } from '../components/Map';
import { InputText } from '../components/InputText';
import { handleAction } from '../utils/notifications';

export const Profile = () => {
  const { user, isLoading, refreshSession } = useAuth();

  const [name, setName] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { coordinates, geoStatus, geoError } = useGeolocation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, ''), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePreviewUrl = (nextUrl: string | null) => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl && currentUrl.startsWith('blob:') && currentUrl !== nextUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return nextUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setLastNames(user.lastNames ?? '');
    }
  }, [user]);

  const currentAvatarUrl = user?.avatarUrl ? `${apiBaseUrl}/media/${user.avatarUrl}` : null;
  const savedCoordinates = user?.coordinates;
  const mapCoordinates =
    coordinates ??
    (savedCoordinates && savedCoordinates.lat !== null && savedCoordinates.lng !== null
      ? { lat: savedCoordinates.lat, lng: savedCoordinates.lng }
      : null);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setUploadedAvatarUrl(null);
      updatePreviewUrl(null);
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    updatePreviewUrl(localPreviewUrl);
    setStatusMessage(null);
    setIsUploadingAvatar(true);

    try {
      const avatarFilename = `img_${crypto.randomUUID()}.webp`;
      const mediaFormData = new FormData();
      mediaFormData.append('names', avatarFilename);
      mediaFormData.append('avatar', file);

      const mediaResponse = await httpClient.post('/media/upload', mediaFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarPath = mediaResponse.data?.data?.files?.[0] ?? avatarFilename;
      setUploadedAvatarUrl(avatarPath);
      updatePreviewUrl(`${apiBaseUrl}/media/${avatarPath}`);
    } catch {
      setUploadedAvatarUrl(null);
      handleAction('error', 'Error', 'No se pudo subir el avatar. Inténtalo de nuevo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const scrollY = window.scrollY;

    const photoChanged = Boolean(uploadedAvatarUrl && uploadedAvatarUrl !== user.avatarUrl);
    const nameChanged = name !== (user.name ?? '');
    const lastNamesChanged = lastNames !== (user.lastNames ?? '');
    const anyChangeMade = photoChanged || nameChanged || lastNamesChanged;

    if (!anyChangeMade) {
      handleAction("warning", "Sin cambios", "No has modificado ningún dato de tu perfil.");
      return;
    }

    if (name.trim().length < 2) {
      handleAction("warning", "Nombre demasiado corto", "Tu nombre debe tener al menos 2 caracteres.");
      return;
    }

    if (lastNames.trim().length < 2) {
      handleAction("warning", "Apellidos demasiado cortos", "Tus apellidos deben tener al menos 2 caracteres.");
      return;
    }

    if (!coordinates) {
      setStatusMessage('La geolocalización es obligatoria para actualizar el perfil');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: {
        name: string;
        lastNames: string;
        lat: number;
        lng: number;
        avatarUrl?: string;
      } = {
        name,
        lastNames,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };

      if (photoChanged && uploadedAvatarUrl) {
        payload.avatarUrl = uploadedAvatarUrl;
      }

      await httpClient.put(`/auth/user/${user.id}`, payload);
      await refreshSession();

      setUploadedAvatarUrl(null);
      updatePreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (photoChanged) {
        handleAction("success", "Enhorabuena!", "Has cambiado tu foto de perfil.");
      } else {
        handleAction("success", "Perfil actualizado", "Tus datos han sido guardados correctamente.");
      }

      setStatusMessage('Perfil actualizado correctamente');
    } catch {
      handleAction("error", "Error", "Ocurrió un problema al guardar los cambios.");
    } finally {
      setIsSaving(false);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
  };

  if (isLoading && !user) {
    return <p className="text-sm text-slate-500 p-6">Cargando perfil...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Cuenta</p>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)] sm:text-3xl">Perfil</h1>
        <p className="text-sm text-slate-500">Actualiza tus datos y ubicación</p>
      </div>

      {geoStatus === 'loading' && (
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">Obteniendo tu ubicación...</p>
      )}
      {geoStatus === 'error' && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{geoError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <p className="text-sm font-medium text-slate-700">Avatar</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative h-20 w-20">
              {previewUrl || currentAvatarUrl ? (
                <img
                  src={previewUrl ?? currentAvatarUrl ?? ''}
                  alt="Vista previa"
                  className={`h-20 w-20 rounded-full object-contain ring-2 ${previewUrl ? 'ring-[var(--color-primary)]' : 'ring-transparent'} transition-all`}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Vento
                </div>
              )}
              {previewUrl && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white shadow-sm">
                  ★
                </span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="avatar" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {previewUrl ? 'Cambiar selección' : 'Actualizar foto'}
              </label>
              <input
                ref={fileInputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  void handleAvatarChange(event);
                }}
                className="w-full cursor-pointer rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 focus:outline-none"
              />
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedAvatarUrl(null);
                    updatePreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-[10px] font-bold uppercase text-red-500 hover:underline cursor-pointer"
                >
                  Deshacer cambios
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputText id="name" name="name" label="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
          <InputText id="lastNames" name="lastNames" label="Apellidos" required value={lastNames} onChange={(e) => setLastNames(e.target.value)} />
        </div>

        <InputText id="email" name="email" type="email" label="Email" value={user?.email} disabled />
        
        {geoStatus === 'success' && (
          <div className='flex justify-start'>
            <p className="rounded-lg border border-slate-100 px-3 py-2 text-sm text-[var(--color-primary)]">Ubicación obtenida ✓</p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <p className="text-sm font-medium text-slate-700">Tu ubicación</p>
          <div className="mt-3 overflow-hidden rounded-lg">
            {mapCoordinates ? (
              <Map latitude={mapCoordinates.lat} longitude={mapCoordinates.lng} height={260} className="border border-slate-200" />
            ) : (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 italic">No hay ubicación disponible.</p>
            )}
          </div>
        </div>

        {geoStatus !== 'success' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Debes permitir el acceso a tu ubicación</p>
        )}

        <button
          type="submit"
          disabled={isSaving || isUploadingAvatar || !coordinates}
          className="cursor-pointer w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isUploadingAvatar ? 'Subiendo avatar...' : isSaving ? 'Guardando...' : 'Actualizar perfil'}
        </button>
      </form>

      {statusMessage && (
        <p className={`rounded-lg border px-3 py-2 text-sm font-medium text-center ${statusMessage.includes('correctamente') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};