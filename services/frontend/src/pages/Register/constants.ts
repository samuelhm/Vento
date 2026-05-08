import type { FieldErrorKey } from './errorDefinitions';

export type RegisterField = 'name' | 'lastNames' | 'email' | 'password';

export const NAME_REQUIRED_ERROR: FieldErrorKey = 'error.name.required';
export const NAME_MIN_LENGTH_ERROR: FieldErrorKey = 'error.name.minLength';
export const LASTNAMES_REQUIRED_ERROR: FieldErrorKey = 'error.lastNames.required';
export const LASTNAMES_MIN_LENGTH_ERROR: FieldErrorKey = 'error.lastNames.minLength';
export const EMAIL_REQUIRED_ERROR: FieldErrorKey = 'error.email.required';
export const EMAIL_INVALID_ERROR: FieldErrorKey = 'error.email.invalid';
export const PASSWORD_REQUIRED_ERROR: FieldErrorKey = 'error.password.required';
export const PASSWORD_MIN_LENGTH_ERROR: FieldErrorKey = 'error.password.minLength';

export const fieldErrorKeys: Record<RegisterField, FieldErrorKey[]> = {
  name: [NAME_REQUIRED_ERROR, NAME_MIN_LENGTH_ERROR],
  lastNames: [LASTNAMES_REQUIRED_ERROR, LASTNAMES_MIN_LENGTH_ERROR],
  email: [EMAIL_REQUIRED_ERROR, EMAIL_INVALID_ERROR],
  password: [PASSWORD_REQUIRED_ERROR, PASSWORD_MIN_LENGTH_ERROR],
};
