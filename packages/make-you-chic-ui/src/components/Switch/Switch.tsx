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
import './Switch.css'
import { forwardRef } from 'react'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role' | 'checked' | 'defaultChecked' | 'onChange'
> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  /** Optional inline label, for lightweight use outside of <FormField>. */
  label?: string
}

/** Boolean input styled as a track/thumb toggle switch (role="switch"). */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onChange, label, className, disabled, ...rest },
  ref,
) {
  const fieldProps = useFieldProps()
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  })

  const trackClass = isChecked ? 'mycui-switch-track checked' : 'mycui-switch-track'

  const input = (
    <span
      className={className ? `${trackClass} ${className}` : trackClass}
      data-testid="switch-track"
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        aria-checked={isChecked}
        className="mycui-switch-input"
        checked={isChecked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
        data-testid="switch"
        {...fieldProps}
        {...rest}
      />
      <span className="mycui-switch-thumb" />
    </span>
  )

  if (!label) {
    return input
  }

  return (
    <label className="mycui-switch-label">
      {input}
      {label}
    </label>
  )
})
