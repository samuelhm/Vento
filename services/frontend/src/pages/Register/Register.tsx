import { useEffect, useState } from 'react';
import { Form, Link, useActionData, useLocation } from 'react-router';
import type { AuthActionError } from '../../utils/authActionErrors';
import { ButtonPrimary as Button } from '../../components/ButtonPrimary';
import { useRegisterForm } from './hooks/useRegisterForm';
import { getFieldErrorMessage } from './utils/validateForm';
import NameInput from './components/NameInput/NameInput';
import PasswordInput from './components/PasswordInput/PasswordInput';
import EmailInput from './components/EmailInput/EmailInput';
import LastNamesInput from './components/LastNamesInput/LastNamesInput';
import { usePendingAction } from '../../hooks/usePendingAction';

export const Register = () => {
  const actionData = useActionData() as AuthActionError | undefined;
  const location = useLocation();
  const { getPendingAction, setPendingAction } = usePendingAction();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const from = location.state?.from;
    if (from) {
      const currentAction = getPendingAction();
      setPendingAction({
        ...(currentAction || { type: 'REDIRECT_ONLY' }),
        redirectTo: from,
      });
    }
  }, [location.state, getPendingAction, setPendingAction]);
  const {
    coordinates,
    geoStatus,
    geoError,
    formErrors,
    avatarError,
    handleOnChange,
    handleOnBlur,
    handleAvatarChange,
    handleSubmit,
  } = useRegisterForm();
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vento</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Crear cuenta</h1>
        <p className="text-sm text-slate-500">Completa tus datos para empezar</p>
      </div>
      {geoStatus === 'loading' ? (
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Obteniendo tu ubicación...
        </p>
      ) : null}
      {geoStatus === 'error' ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {geoError}
        </p>
      ) : null}
      {geoStatus === 'success' ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ✓ Ubicación obtenida
        </p>
      ) : null}
      <Form
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <NameInput
          error={getFieldErrorMessage(formErrors, 'name')}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
        <LastNamesInput
          error={getFieldErrorMessage(formErrors, 'lastNames')}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
        <EmailInput
          error={getFieldErrorMessage(formErrors, 'email')}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
        <PasswordInput
          error={getFieldErrorMessage(formErrors, 'password')}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
        <div className="space-y-2">
          <label htmlFor="avatar" className="text-sm font-medium text-slate-700">
            Avatar (opcional)
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            aria-invalid={Boolean(avatarError)}
            className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
          />
          <p className={`text-xs ${avatarError ? 'text-red-600' : 'text-slate-400'}`}>
            {avatarError || 'Formatos: JPG, PNG, WEBP (Máx. 2MB)'}
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          <span>
            Acepto los{' '}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
            >
              términos y condiciones
            </Link>
            .
          </span>
        </label>

        {coordinates ? <input type="hidden" name="lat" value={coordinates.lat} /> : null}
        {coordinates ? <input type="hidden" name="lng" value={coordinates.lng} /> : null}

        {geoStatus !== 'success' ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            Debes permitir el acceso a tu ubicación para continuar
          </p>
        ) : null}

        {!acceptedTerms ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            Debes aceptar los términos y condiciones para continuar
          </p>
        ) : null}

        {actionData?.status === 'error' ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {actionData.message}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={!coordinates || !acceptedTerms || Boolean(avatarError)}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Crear cuenta
        </Button>
      </Form>
    </div>
  );
};
