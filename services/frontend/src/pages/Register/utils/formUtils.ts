import type { RegisterField } from '../constants';

export type RegisterFormValues = Record<RegisterField, string>;

export const getFormValues = (form: HTMLFormElement): RegisterFormValues => {
  const formData = new FormData(form);

  return {
    name: (formData.get('name') as string | null) ?? '',
    lastNames: (formData.get('lastNames') as string | null) ?? '',
    email: (formData.get('email') as string | null) ?? '',
    password: (formData.get('password') as string | null) ?? '',
  };
};
