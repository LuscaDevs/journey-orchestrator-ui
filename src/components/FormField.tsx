import { useState } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  helperText?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  type = 'text',
  helperText,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    setTouched(true);
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  const hasError = error && touched;
  const fieldId = `field-${name}`;

  return (
    <div className={`form-field ${hasError ? 'error' : ''} ${focused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}>
      <label
        htmlFor={fieldId}
        className="form-field-label"
      >
        {label}
        {required && <span className="required-indicator" aria-label="required">*</span>}
      </label>

      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="form-field-input"
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
      />

      {hasError && (
        <div
          id={`${fieldId}-error`}
          className="form-field-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {helperText && !hasError && (
        <div
          id={`${fieldId}-helper`}
          className="form-field-helper"
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
