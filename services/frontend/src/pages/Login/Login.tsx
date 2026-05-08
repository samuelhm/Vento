import { useEffect } from 'react';
import { Form, useActionData, Link, useLocation } from 'react-router';
import type { AuthActionError } from '../../utils/authActionErrors';
import { ButtonPrimary as Button } from '../../components/ButtonPrimary';
import { InputText } from '../../components/InputText';
import { InputPassword } from '../../components/InputPassword';
import { usePendingAction } from '../../hooks/usePendingAction';

export const Login = () => {
  const actionData = useActionData() as AuthActionError | undefined;
  const location = useLocation();
  const { getPendingAction, setPendingAction } = usePendingAction();

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

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vento</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Te damos la bienvenida
        </h1>
        <p className="text-sm text-slate-500">Accede a tu cuenta para continuar</p>
      </div>
      <Form method="post" className="space-y-4 flex flex-col gap-4">
        <div className="space-y-4">
          <InputText type="email" id="email" name="email" label="Email" required />
          <InputPassword id="password" name="password" label="Contraseña" required />
        </div>
        <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800">
          Iniciar sesión
        </Button>
      </Form>
      <div className="text-center text-sm flex flex-col gap-2">
        <Link to="/forgot-password" className="font-semibold text-slate-900 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <div>
          <span className="text-slate-500">¿No tienes una cuenta? </span>
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>

      {actionData?.status === 'error' ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionData.message}
        </p>
      ) : null}
    </div>
  );
};
