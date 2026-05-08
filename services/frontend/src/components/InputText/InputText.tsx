import { createBaseInput } from '../InputBase';
import type { BaseInputProps } from '../InputBase';

const BaseInput = createBaseInput();

export const InputText = (props: BaseInputProps) => <BaseInput {...props} />;
