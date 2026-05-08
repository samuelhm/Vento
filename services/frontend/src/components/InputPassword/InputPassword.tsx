import { useState } from 'react';
import { createBaseInput } from '../InputBase';
import type { BaseInputProps } from '../InputBase';
import EyeOffIcon from '../Icons/EyeOffIcon';
import EyeIcon from '../Icons/EyeIcon';

const BaseInput = createBaseInput();

type InputPasswordProps = Omit<BaseInputProps, 'type' | 'endIcon'>;

export const InputPassword = (props: InputPasswordProps) => {
  const [show, setShow] = useState(false);

  return (
    <BaseInput
      {...props}
      type={show ? 'text' : 'password'}
      endIcon={
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          onMouseDown={(e) => e.preventDefault()}
          className="flex items-center text-slate-400 hover:text-slate-600"
          tabIndex={-1}
        >
          {show ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
        </button>
      }
    />
  );
};
