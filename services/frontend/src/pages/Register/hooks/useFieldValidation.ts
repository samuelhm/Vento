import { validateField, isRegisterField } from '../utils/validateForm';
import { fieldErrorKeys } from '../constants';
import type { FieldErrorKey } from '../errorDefinitions';

export const useFieldValidation = (
  setFormErrors: React.Dispatch<React.SetStateAction<FieldErrorKey[]>>
) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (!isRegisterField(name)) return;
    setFormErrors((prev) => prev.filter((err) => !fieldErrorKeys[name].includes(err)));
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isRegisterField(name)) return;

    const error = validateField(name, value);

    if (error) {
      setFormErrors((prev) => {
        if (!prev.includes(error)) {
          return [...prev.filter((err) => !fieldErrorKeys[name].includes(err)), error];
        }
        return prev;
      });
      return;
    }

    setFormErrors((prev) => prev.filter((err) => !fieldErrorKeys[name].includes(err)));
  };

  return { handleOnChange, handleOnBlur };
};
