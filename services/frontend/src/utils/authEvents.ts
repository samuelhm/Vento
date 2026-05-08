export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";

export const notifyAuthStateChanged = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
};
