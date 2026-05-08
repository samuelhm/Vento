import httpClient from "../../utils/httpClient";
import { redirect, type ActionFunctionArgs } from "react-router";
import { createAuthActionError, mapAuthActionError } from "../../utils/authActionErrors";
import { notifyAuthStateChanged } from "../../utils/authEvents";
import { setAuthHint } from "../../utils/authHint";

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const acceptedTerms = formData.get("acceptTerms") === "on";

  if (!acceptedTerms) {
    return createAuthActionError("Debes aceptar términos y condiciones para registrarte", 400);
  }
  
  let redirectTo = "/";
  let pendingAction: { type?: string; redirectTo?: string } | null = null;
  const pendingActionData = sessionStorage.getItem('vento_pending_action');
  if (pendingActionData) {
    try {
      pendingAction = JSON.parse(pendingActionData) as { type?: string; redirectTo?: string };
      redirectTo = pendingAction.redirectTo || "/";
    } catch {
    }
  }

  const avatar = formData.get("avatar");

  let uploadedAvatar: string | null = null;

  if (avatar instanceof File && avatar.size > 0) {
    try {
      const avatarFilename = `img_${crypto.randomUUID()}.webp`;
      const mediaFormData = new FormData();
      mediaFormData.append("names", avatarFilename);
      mediaFormData.append("avatar", avatar);

      const mediaResponse = await httpClient.post("/media/upload", mediaFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      uploadedAvatar = mediaResponse.data?.data?.files?.[0] ?? avatarFilename;
    } catch (error) {
      return mapAuthActionError("register", error);
    }
  }

  try {

    await httpClient.post("/auth/signup", {
      name: String(formData.get("name") ?? ""),
      lastNames: String(formData.get("lastNames") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      avatarUrl: uploadedAvatar,
      lat: Number(formData.get("lat")),
      lng: Number(formData.get("lng")),
    });
    setAuthHint(true);

    notifyAuthStateChanged();

    if (pendingAction?.type === 'REDIRECT_ONLY') {
      sessionStorage.removeItem('vento_pending_action');
    }

    return redirect(redirectTo);
  } catch (error) {
    return mapAuthActionError("register", error);
  }
};
