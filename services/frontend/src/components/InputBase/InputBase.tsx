import React from 'react';
import AlertIcon from '../Icons/AlertIcon';
import Helper from './components/Helper';

export type InputStatus = 'error' | 'default';
type LabelMode = 'floating' | 'external';

const STATUS_STYLES: Record<InputStatus, { textColor: string; icon?: React.ComponentType }> = {
  error: { textColor: 'text-red-500', icon: AlertIcon },
  default: { textColor: 'text-gray-500', icon: undefined },
};

const PLACEHOLDER_CLASSES: Record<LabelMode, string> = {
  floating: 'placeholder-transparent',
  external: 'focus:placeholder-transparent',
};

const fieldClass = (status: InputStatus, labelMode: LabelMode = 'floating') =>
  `peer w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none transition ${PLACEHOLDER_CLASSES[labelMode]} focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 ${status === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200'}`;

const labelClass =
  'pointer-events-none absolute left-0 top-0 translate-x-3 cursor-default select-none transition-all -translate-y-2.5 bg-white px-1 text-xs font-medium text-slate-700 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-slate-400 peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-700';

const selectLabelClass =
  'pointer-events-none absolute left-0 top-0 -translate-y-2.5 translate-x-3 cursor-default select-none bg-white px-1 text-xs font-medium text-slate-700';

const labelClassWithPlaceholder =
  'pointer-events-none absolute left-0 top-0 -translate-y-2.5 translate-x-3 cursor-default select-none bg-white px-1 text-xs font-medium text-slate-700 transition-opacity peer-placeholder-shown:opacity-0 peer-focus:!opacity-100';

export interface BaseInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  label?: string;
  helperText?: string;
  status?: InputStatus;
  type?: string;
  endIcon?: React.ReactNode;
}

export interface BaseTextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  helperText?: string;
  status?: InputStatus;
}

export interface BaseSelectProps extends React.ComponentPropsWithoutRef<'select'> {
  label?: string;
  helperText?: string;
  status?: InputStatus;
}

type BasePropsMap = {
  input: BaseInputProps;
  textarea: BaseTextareaProps;
  select: BaseSelectProps;
};

export function createBaseInput<T extends keyof BasePropsMap = 'input'>(
  as?: T
): React.FC<BasePropsMap[T]> {
  if (as === 'textarea') {
    return function BaseTextarea({
      label,
      helperText,
      status = 'default',
      ...textareaProps
    }: BaseTextareaProps) {
      const { textColor, icon: StatusIcon } = STATUS_STYLES[status];
      return (
        <div>
          <div className="relative w-full">
            <textarea
              {...textareaProps}
              placeholder={label}
              className={`${fieldClass(status)} resize-none`}
            />
            {label && <span className={labelClass}>{label}</span>}
          </div>
          {helperText && (
            <Helper color={textColor} status={status} text={helperText} icon={StatusIcon} />
          )}
        </div>
      );
    } as unknown as React.FC<BasePropsMap[T]>;
  }

  if (as === 'select') {
    return function BaseSelect({
      label,
      helperText,
      status = 'default',
      children,
      ...selectProps
    }: BaseSelectProps) {
      const { textColor, icon: StatusIcon } = STATUS_STYLES[status];
      return (
        <div>
          <div className="relative w-full">
            <select {...selectProps} className={`${fieldClass(status)} bg-white appearance-none cursor-pointer`}>
              {children}
            </select>
            {label && <span className={selectLabelClass}>{label}</span>}
          </div>
          {helperText && (
            <Helper color={textColor} status={status} text={helperText} icon={StatusIcon} />
          )}
        </div>
      );
    } as unknown as React.FC<BasePropsMap[T]>;
  }

  return function BaseInput({
    label,
    helperText,
    status = 'default',
    endIcon,
    placeholder,
    ...inputProps
  }: BaseInputProps) {
    const { textColor, icon: StatusIcon } = STATUS_STYLES[status];
    const hasExternalPlaceholder = placeholder !== undefined;
    return (
      <div>
        <div className="relative w-full">
          <input
            {...inputProps}
            placeholder={hasExternalPlaceholder ? placeholder : label}
            className={fieldClass(status, hasExternalPlaceholder ? 'external' : 'floating')}
          />
          {label && (
            <span className={hasExternalPlaceholder ? labelClassWithPlaceholder : labelClass}>{label}</span>
          )}
          {endIcon && <div className="absolute inset-y-0 right-3 flex items-center">{endIcon}</div>}
        </div>
        {helperText && (
          <Helper color={textColor} status={status} text={helperText} icon={StatusIcon} />
        )}
      </div>
    );
  } as unknown as React.FC<BasePropsMap[T]>;
}
