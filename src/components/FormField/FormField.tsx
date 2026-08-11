/**
 * Copyright 2026 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import './FormField.css';
import { useId, type ReactNode } from 'react';
import { FormFieldContext, type FormFieldContextValue } from './FormFieldContext';

export interface FormFieldProps {
  /** Field label text. */
  label: string;
  /** Error message. When present, the field is shown in an error state. */
  error?: string;
  /** Helper text shown when there is no error. */
  helperText?: string;
  /** Marks the field as required (adds a visual indicator only; no validation is performed). */
  required?: boolean;
  /** The input component (TextInput, Select, etc.) this field wraps. */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wraps a single form input with a label, helper text, and error message,
 * automatically wiring id/aria-describedby/aria-invalid onto the wrapped
 * input via FormFieldContext (see Functional Design: business-logic-model.md).
 */
export function FormField({
  label,
  error,
  helperText,
  required,
  children,
  className,
  style,
}: FormFieldProps): React.JSX.Element {
  const fieldId = useId();
  const errorId = error ? `${fieldId}-error` : undefined;
  const helperTextId = !error && helperText ? `${fieldId}-helper` : undefined;

  const contextValue: FormFieldContextValue = {
    fieldId,
    errorId,
    helperTextId,
    hasError: Boolean(error),
  };

  return (
    <div className={className ? `wds-form-field ${className}` : 'wds-form-field'} style={style}>
      <label className="wds-form-field-label" htmlFor={fieldId}>
        {label}
        {required && (
          <span className="wds-form-field-required-mark" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <FormFieldContext.Provider value={contextValue}>{children}</FormFieldContext.Provider>
      {error && (
        <span className="wds-form-field-error-text" id={errorId} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="wds-form-field-helper-text" id={helperTextId}>
          {helperText}
        </span>
      )}
    </div>
  );
}
