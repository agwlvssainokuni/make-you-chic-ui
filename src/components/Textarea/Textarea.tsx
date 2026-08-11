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
import './Textarea.css'
import { forwardRef } from 'react'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** @default 3 */
  rows?: number
}

/** Multi-line text input with vertical resize enabled. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { value, defaultValue = '', onChange, rows = 3, className, ...rest },
  ref,
) {
  const fieldProps = useFieldProps()
  const [currentValue, setValue] = useControllableState({ value, defaultValue, onChange })

  return (
    <textarea
      ref={ref}
      className={className ? `wds-textarea ${className}` : 'wds-textarea'}
      rows={rows}
      value={currentValue}
      onChange={(e) => setValue(e.target.value)}
      data-testid="textarea"
      {...fieldProps}
      {...rest}
    />
  )
})
