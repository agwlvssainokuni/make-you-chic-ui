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
import './TextInput.css'
import { forwardRef } from 'react'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

/** Single-line text input. Wire it inside <FormField> for automatic label/error linkage. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { value, defaultValue = '', onChange, className, ...rest },
  ref,
) {
  const fieldProps = useFieldProps()
  const [currentValue, setValue] = useControllableState({ value, defaultValue, onChange })

  return (
    <input
      ref={ref}
      type="text"
      className={className ? `wds-text-input ${className}` : 'wds-text-input'}
      value={currentValue}
      onChange={(e) => setValue(e.target.value)}
      data-testid="text-input"
      {...fieldProps}
      {...rest}
    />
  )
})
