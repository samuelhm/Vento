import { type FieldErrorKey, getErrorMessage } from '../errorDefinitions';
import {
  type RegisterField,
  fieldErrorKeys,
  NAME_REQUIRED_ERROR,
  NAME_MIN_LENGTH_ERROR,
  LASTNAMES_REQUIRED_ERROR,
  LASTNAMES_MIN_LENGTH_ERROR,
  EMAIL_REQUIRED_ERROR,
  EMAIL_INVALID_ERROR,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_MIN_LENGTH_ERROR,
} from '../constants';

const EMAIL_REGEX = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;

const fieldValidators: Record<RegisterField, (value: string) => FieldErrorKey | null> = {
  name: (value) => {
    if (value.length === 0) return NAME_REQUIRED_ERROR;
    if (value.length < 2) return NAME_MIN_LENGTH_ERROR;
    return null;
  },
  lastNames: (value) => {
    if (value.length === 0) return LASTNAMES_REQUIRED_ERROR;
    if (value.length < 2) return LASTNAMES_MIN_LENGTH_ERROR;
    return null;
  },
  email: (value) => {
    if (value.length === 0) return EMAIL_REQUIRED_ERROR;
    if (!EMAIL_REGEX.test(value)) return EMAIL_INVALID_ERROR;
    return null;
  },
  password: (value) => {
    if (value.length === 0) return PASSWORD_REQUIRED_ERROR;
    if (value.length < 8) return PASSWORD_MIN_LENGTH_ERROR;
    return null;
  },
};

export const isRegisterField = (name: string): name is RegisterField => name in fieldValidators;

export const validateField = (name: RegisterField, value: string): FieldErrorKey | null =>
  fieldValidators[name](value.trim());

export const validateForm = (values: Record<RegisterField, string>): FieldErrorKey[] =>
  (Object.keys(fieldValidators) as RegisterField[])
    .map((field) => validateField(field, values[field] ?? ''))
    .filter((key): key is FieldErrorKey => key !== null);

export const getFieldErrorMessage = (errors: FieldErrorKey[], field: RegisterField): string => {
  const errorKey = errors.find((error) => fieldErrorKeys[field].includes(error));
  return errorKey ? getErrorMessage(errorKey) : '';
};
