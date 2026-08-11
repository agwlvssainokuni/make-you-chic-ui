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
import './Select.css';
import { forwardRef } from 'react';
import { useFieldProps } from '../FormField/useFieldProps';
import { useControllableState } from '../../utils/useControllableState';
import { Icon } from '../Icon';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'value' | 'defaultValue' | 'onChange'
  > {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Native <select>-based dropdown (Functional Design Question 2 = A). A
 * custom chevron icon is overlaid; the browser's own dropdown list and
 * keyboard/touch handling are used as-is.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, value, defaultValue = '', onChange, className, ...rest },
  ref,
) {
  const fieldProps = useFieldProps();
  const [currentValue, setValue] = useControllableState({ value, defaultValue, onChange });

  return (
    <span className="wds-select-wrapper">
      <select
        ref={ref}
        className={className ? `wds-select ${className}` : 'wds-select'}
        value={currentValue}
        onChange={(e) => setValue(e.target.value)}
        data-testid="select"
        {...fieldProps}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="wds-select-chevron">
        <Icon name="chevron-down" size={16} />
      </span>
    </span>
  );
});
