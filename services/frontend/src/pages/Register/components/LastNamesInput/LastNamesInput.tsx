import { InputText } from '../../../../components/InputText';

interface LastNamesInputProps {
  error: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const LastNamesInput = ({ error, onChange, onBlur }: LastNamesInputProps) => (
  <InputText
    type="text"
    id="lastNames"
    name="lastNames"
    label="Apellidos"
    onChange={onChange}
    onBlur={onBlur}
    helperText={error}
    status={error ? 'error' : 'default'}
  />
);

export default LastNamesInput;
