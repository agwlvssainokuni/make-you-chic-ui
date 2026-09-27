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
import './RadioGroup.css'
import type { ReactNode } from 'react'
import { useFieldProps } from '../FormField/useFieldProps'
import { useControllableState } from '../../utils/useControllableState'
import { Radio } from './Radio'

export interface RadioGroupOption {
  label: ReactNode
  value: string
  /** BCP 47 language tag for this option's label, e.g. when it differs from the surrounding page language. */
  lang?: string
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
  /** Group name, rendered as a <legend>. When omitted, renders a plain role="radiogroup" div (e.g. for use inside <FormField>). */
  legend?: ReactNode
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
  legend,
}: RadioGroupProps): React.JSX.Element {
  const fieldProps = useFieldProps()
  const [currentValue, setValue] = useControllableState({ value, defaultValue, onChange })

  const radios = options.map((option) => (
    <Radio
      key={option.value}
      name={name}
      value={option.value}
      label={option.label}
      lang={option.lang}
      checked={currentValue === option.value}
      onChange={(checked) => {
        if (checked) setValue(option.value)
      }}
      disabled={disabled}
    />
  ))

  // With a legend, the group owns its own accessible name via native
  // fieldset/legend semantics and does not need role="radiogroup" (the
  // radios are real <input type="radio"> elements, already correctly
  // grouped by `name` without any ARIA). Without one (e.g. nested inside
  // <FormField>), keep the previous role="radiogroup" div as-is.
  if (legend !== undefined) {
    return (
      <fieldset
        id={fieldProps.id}
        className={className ? `mycui-radio-group ${className}` : 'mycui-radio-group'}
        style={style}
        aria-describedby={fieldProps['aria-describedby']}
        aria-invalid={fieldProps['aria-invalid']}
        data-testid="radio-group"
      >
        <legend className="mycui-radio-group-legend">{legend}</legend>
        {radios}
      </fieldset>
    )
  }

  return (
    <div
      role="radiogroup"
      id={fieldProps.id}
      className={className ? `mycui-radio-group ${className}` : 'mycui-radio-group'}
      style={style}
      aria-describedby={fieldProps['aria-describedby']}
      aria-invalid={fieldProps['aria-invalid']}
      data-testid="radio-group"
    >
      {radios}
    </div>
  )
}
