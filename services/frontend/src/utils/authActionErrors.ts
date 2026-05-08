import { isAxiosError } from "axios";

export type AuthActionError = {
  status: "error";
  message: string;
  code: number;
};

type AuthFlow = "login" | "register";

export const createAuthActionError = (message: string, code: number): AuthActionError => ({
  status: "error",
  message,
  code,
});

const getLoginErrorByStatus = (statusCode: number): AuthActionError | null => {
  switch (statusCode) {
    case 401:
      return createAuthActionError("Credenciales inválidas", 401);
    case 400:
      return createAuthActionError("Datos inválidos. Revisa el formulario", 400);
    case 500:
      return createAuthActionError("Error interno del servidor", 500);
    default:
      return null;
  }
};

const getRegisterErrorByStatus = (statusCode: number): AuthActionError | null => {
  switch (statusCode) {
    case 409:
      return createAuthActionError("Este email ya está registrado", 409);
    case 413:
      return createAuthActionError("La imagen supera el tamaño máximo permitido (2MB)", 413);
    case 400:
      return createAuthActionError("Datos inválidos o formato de imagen no permitido", 400);
    case 500:
      return createAuthActionError("Error interno del servidor", 500);
    default:
      return null;
  }
};

export const mapAuthActionError = (flow: AuthFlow, error: unknown): AuthActionError => {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const backendMessage = error.response?.data?.message;

    if (statusCode) {
      const mappedError =
        flow === "login" ? getLoginErrorByStatus(statusCode) : getRegisterErrorByStatus(statusCode);

      if (mappedError) {
        // Si el backend envía un mensaje específico, úsalo
        if (backendMessage) {
          return createAuthActionError(backendMessage, statusCode);
        }
        return mappedError;
      }
    }
  }

  if (flow === "login") {
    return createAuthActionError("No se pudo iniciar sesión. Inténtalo de nuevo", 0);
  }

  return createAuthActionError("No se pudo completar el registro", 0);
};
