import { InputText } from '../../../../components/InputText';

interface NameInputProps {
  error: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const NameInput = ({ error, onChange, onBlur }: NameInputProps) => (
  <InputText
    id="name"
    name="name"
    label="Nombre"
    onChange={onChange}
    onBlur={onBlur}
    helperText={error}
    status={error ? 'error' : 'default'}
  />
);

export default NameInput;
