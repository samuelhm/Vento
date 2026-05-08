import { useState } from 'react';
import { getFormValues } from '../utils/formUtils';
import type { RegisterFormValues } from '../utils/formUtils';
import { validateForm } from '../utils/validateForm';
import type { FieldErrorKey } from '../errorDefinitions';
import { useFieldValidation } from './useFieldValidation';
import { useGeolocation } from '../../../hooks/useGeolocation';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const AVATAR_TOO_LARGE_MESSAGE = 'La imagen no puede superar 2MB';

export const useRegisterForm = () => {
  const [formErrors, setFormErrors] = useState<FieldErrorKey[]>([]);
  const [avatarError, setAvatarError] = useState('');
  const { handleOnChange, handleOnBlur } = useFieldValidation(setFormErrors);
  const { coordinates, geoStatus, geoError } = useGeolocation();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;

    if (!file) {
      setAvatarError('');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError(AVATAR_TOO_LARGE_MESSAGE);
      event.currentTarget.value = '';
      return;
    }

    setAvatarError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const values: RegisterFormValues = getFormValues(form);
    const avatarInput = form.elements.namedItem('avatar');
    const avatarFile = avatarInput instanceof HTMLInputElement ? avatarInput.files?.[0] ?? null : null;

    if (avatarFile && avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
      setAvatarError(AVATAR_TOO_LARGE_MESSAGE);
      e.preventDefault();
      return;
    }

    const errors = validateForm(values);
    setFormErrors(errors);

    if (errors.length > 0) {
      e.preventDefault();
      return;
    }

    setAvatarError('');
  };

  return {
    coordinates,
    geoStatus,
    geoError,
    formErrors,
    avatarError,
    handleOnChange,
    handleOnBlur,
    handleAvatarChange,
    handleSubmit,
  };
};
