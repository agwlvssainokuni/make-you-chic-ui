/*
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
import './Checkbox.css'
import { forwardRef } from 'react'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'
import { Icon } from '../Icon'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'defaultChecked' | 'onChange'
> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  /** Optional inline label, for lightweight use outside of <FormField>. */
  label?: string
}

/** Boolean input styled as a checkbox with a custom check glyph. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked = false, onChange, label, className, disabled, ...rest },
  ref,
) {
  const fieldProps = useFieldProps()
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  })

  const input = (
    <span className="mycui-checkbox-box" data-testid="checkbox-box">
      <input
        ref={ref}
        type="checkbox"
        className={className ? `mycui-checkbox-input ${className}` : 'mycui-checkbox-input'}
        checked={isChecked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
        data-testid="checkbox"
        {...fieldProps}
        {...rest}
      />
      {isChecked && <Icon name="check" size={14} />}
    </span>
  )

  if (!label) {
    return input
  }

  return (
    <label className="mycui-checkbox-label">
      {input}
      {label}
    </label>
  )
})
