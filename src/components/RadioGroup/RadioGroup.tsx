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
import './RadioGroup.css'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'
import { Radio } from './Radio'

export interface RadioGroupOption {
  label: string
  value: string
}

export interface RadioGroupProps {
  name: string
  options: RadioGroupOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Data-driven radio group (Application Design Question 1 = B): consumers
 * pass an `options` array rather than composing individual <Radio>
 * children. Internally renders one <Radio> per option, grouped by `name`
 * (native browser arrow-key navigation applies automatically).
 */
export function RadioGroup({
  name,
  options,
  value,
  defaultValue = '',
  onChange,
  disabled,
  className,
  style,
}: RadioGroupProps): React.JSX.Element {
  const fieldProps = useFieldProps()
  const [currentValue, setValue] = useControllableState({ value, defaultValue, onChange })

  return (
    <div
      role="radiogroup"
      id={fieldProps.id}
      className={className ? `wds-radio-group ${className}` : 'wds-radio-group'}
      style={style}
      aria-describedby={fieldProps['aria-describedby']}
      aria-invalid={fieldProps['aria-invalid']}
      data-testid="radio-group"
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={currentValue === option.value}
          onChange={(checked) => {
            if (checked) setValue(option.value)
          }}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
