import httpClient from "../../utils/httpClient";
import type { ActionFunctionArgs } from "react-router";
import type { 
  ForgotPasswordActionError, 
  ForgotPasswordActionSuccess 
} from "../../types/authTypes";

export type { ForgotPasswordActionError, ForgotPasswordActionSuccess };

export async function forgotPasswordAction({
  request,
}: ActionFunctionArgs): Promise<ForgotPasswordActionError | ForgotPasswordActionSuccess> {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      status: "error",
      message: "Por favor, introduce un email válido",
    };
  }

  try {
    const response = await httpClient.post("/auth/forgot-password", { email });

    return {
      status: "success",
      message: response.data.message || "Si el email está registrado, recibirás un enlace de recuperación",
    };
  } catch {
    return {
      status: "error",
      message: "Error al procesar la solicitud. Inténtalo más tarde.",
    };
  }
}
