import { createBaseInput } from '../InputBase';
import type { BaseTextareaProps } from '../InputBase';

const BaseTextarea = createBaseInput('textarea');

export const InputTextarea = (props: BaseTextareaProps) => <BaseTextarea {...props} />;
