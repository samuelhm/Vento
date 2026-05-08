import httpClient from "../../utils/httpClient";
import { redirect, type ActionFunctionArgs } from "react-router";
import { mapAuthActionError } from "../../utils/authActionErrors";
import { notifyAuthStateChanged } from "../../utils/authEvents";
import { setAuthHint } from "../../utils/authHint";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  let redirectTo = "/";
  let pendingAction = null;
  const pendingActionData = sessionStorage.getItem('vento_pending_action');
  
  if (pendingActionData) {
    try {
      pendingAction = JSON.parse(pendingActionData);
      redirectTo = pendingAction.redirectTo || "/";
    } catch {
      // Invalid pending action data, ignore and use default redirect
    }
  }

  try {
    await httpClient.post("/auth/signin", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    const userRes = await httpClient.get("/auth/me");
    const user = userRes.data.data;
    setAuthHint(true);

    notifyAuthStateChanged();

    const isOwnProfile = user && (
      redirectTo === `/user/${user.id}` || 
      redirectTo.startsWith(`/user/${user.id}?`) ||
      redirectTo.startsWith(`/user/${user.id}/`)
    );

    if (isOwnProfile) {
      if (pendingAction) {
        pendingAction.redirectTo = "/my-products";
        sessionStorage.setItem('vento_pending_action', JSON.stringify(pendingAction));
      }
      redirectTo = "/my-products";
    }

    if (pendingAction?.type === 'REDIRECT_ONLY') {
      sessionStorage.removeItem('vento_pending_action');
    }

    return redirect(redirectTo);
  } catch (error) {
    return mapAuthActionError("login", error);
  }
};
