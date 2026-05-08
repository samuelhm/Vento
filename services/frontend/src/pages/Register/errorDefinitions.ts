export type FieldErrorKey =
  | "error.name.required"
  | "error.name.minLength"
  | "error.lastNames.required"
  | "error.lastNames.minLength"
  | "error.email.required"
  | "error.email.invalid"
  | "error.password.required"
  | "error.password.minLength";

const errorMessages: Record<FieldErrorKey, string> = {
  "error.name.required": "El nombre es obligatorio",
  "error.name.minLength": "El nombre debe tener al menos 2 caracteres",
  "error.lastNames.required": "Los apellidos son obligatorios",
  "error.lastNames.minLength": "Los apellidos deben tener al menos 2 caracteres",
  "error.email.required": "El email es obligatorio",
  "error.email.invalid": "El email no tiene un formato válido",
  "error.password.required": "La contraseña es obligatoria",
  "error.password.minLength": "La contraseña debe tener al menos 8 caracteres",
};

export const getErrorMessage = (key: FieldErrorKey): string => errorMessages[key];