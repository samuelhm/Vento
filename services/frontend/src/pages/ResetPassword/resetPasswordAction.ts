import httpClient from "../../utils/httpClient";
import type { ActionFunctionArgs } from "react-router";
import type { 
  ResetPasswordActionError, 
  ResetPasswordActionSuccess,
  AxiosErrorResponse 
} from "../../types/authTypes";

export type { ResetPasswordActionError, ResetPasswordActionSuccess };

export async function resetPasswordAction({
  request,
}: ActionFunctionArgs): Promise<ResetPasswordActionError | ResetPasswordActionSuccess> {
  const formData = await request.formData();
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    return {
      status: "error",
      message: "Token no válido. Solicita un nuevo enlace de recuperación.",
    };
  }

  if (!newPassword || newPassword.length < 8) {
    return {
      status: "error",
      message: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      status: "error",
      message: "Las contraseñas no coinciden",
    };
  }

  try {
    const response = await httpClient.post("/auth/reset-password", {
      token,
      newPassword,
    });

    return {
      status: "success",
      message: response.data.message || "Contraseña actualizada exitosamente",
    };
  } catch (error) {
    const axiosError = error as AxiosErrorResponse;
    const errorMessage = axiosError.response?.data?.message || "Error al restablecer la contraseña. Inténtalo más tarde.";
    
    return {
      status: "error",
      message: errorMessage,
    };
  }
}
