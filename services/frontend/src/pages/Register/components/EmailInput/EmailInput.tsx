import { InputText } from '../../../../components/InputText';

interface EmailInputProps {
  error: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

const EmailInput = ({ error, onChange, onBlur }: EmailInputProps) => (
  <InputText
    type="email"
    id="email"
    name="email"
    label="Email"
    onChange={onChange}
    onBlur={onBlur}
    helperText={error}
    status={error ? 'error' : 'default'}
  />
);

export default EmailInput;
