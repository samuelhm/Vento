import { Form, useActionData, useNavigation, useSearchParams } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import type { ResetPasswordActionError, ResetPasswordActionSuccess } from "../../types/authTypes";
import { ButtonPrimary as Button } from "../../components/ButtonPrimary";

export const ResetPassword = () => {
  const actionData = useActionData() as ResetPasswordActionError | ResetPasswordActionSuccess | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [showPassword, setShowPassword] = useState(false);
  
  const isSubmitting = navigation.state === "submitting";
  const isSuccess = actionData?.status === "success";
  const isError = actionData?.status === "error";

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vento</p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Enlace no válido</h1>
        </div>
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-800">
            El enlace de recuperación no es válido o ha expirado.
          </p>
        </div>

        <div className="text-center text-sm">
          <Link to="/forgot-password" className="font-semibold text-slate-900 hover:underline">
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vento</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Nueva contraseña</h1>
        <p className="text-sm text-slate-500">Introduce tu nueva contraseña</p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm text-green-800">{actionData.message}</p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <Form method="post" className="space-y-4">
          <input type="hidden" name="token" value={token} />
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
              Nueva contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="showPassword" className="text-sm text-slate-600">
              Mostrar contraseña
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </Form>
      )}

      <div className="text-center text-sm">
        <span className="text-slate-500">¿Recordaste tu contraseña? </span>
        <Link to="/login" className="font-semibold text-slate-900 hover:underline">
          Inicia sesión
        </Link>
      </div>

      {isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionData.message}
        </p>
      ) : null}
    </div>
  );
};
