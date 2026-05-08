import { Form, useActionData, useNavigation } from "react-router";
import { Link } from "react-router";
import type { ForgotPasswordActionError, ForgotPasswordActionSuccess } from "../../types/authTypes";
import { ButtonPrimary as Button } from "../../components/ButtonPrimary";
import { InputText } from "../../components/InputText";

export const ForgotPassword = () => {
  const actionData = useActionData() as ForgotPasswordActionError | ForgotPasswordActionSuccess | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const isSuccess = actionData?.status === "success";
  const isError = actionData?.status === "error";

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vento</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-slate-500">
          Introduce tu email y te enviaremos un enlace para restablecerla
        </p>
      </div>

      {isSuccess ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm text-green-800">{actionData.message}</p>
          <p className="mt-2 text-xs text-green-600">
            Revisa tu bandeja de entrada y carpetas de spam
          </p>
        </div>
      ) : (
        <Form method="post" className="space-y-4">
          <InputText
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="tu@email.com"
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar enlace"}
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
