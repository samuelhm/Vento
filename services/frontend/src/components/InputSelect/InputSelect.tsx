import { createBaseInput } from '../InputBase';
import type { BaseSelectProps } from '../InputBase';

const BaseSelect = createBaseInput('select');

export const InputSelect = (props: BaseSelectProps) => <BaseSelect {...props} />;
