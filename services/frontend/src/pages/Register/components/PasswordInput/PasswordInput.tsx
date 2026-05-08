import { InputPassword } from '../../../../components/InputPassword';

interface PasswordInputProps {
  error: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const PasswordInput = ({ error, onChange, onBlur }: PasswordInputProps) => (
  <InputPassword
    id="password"
    name="password"
    label="Contraseña"
    onChange={onChange}
    onBlur={onBlur}
    helperText={error}
    status={error ? 'error' : 'default'}
  />
);

export default PasswordInput;
