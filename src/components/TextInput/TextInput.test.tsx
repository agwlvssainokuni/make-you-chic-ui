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
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TextInput } from './TextInput';
import { FormField } from '../FormField/FormField';

describe('TextInput', () => {
  it('behaves as an uncontrolled input when value is not provided', async () => {
    render(<TextInput defaultValue="初期値" />);
    const input = screen.getByTestId('text-input') as HTMLInputElement;
    expect(input.value).toBe('初期値');
    await userEvent.type(input, '追加');
    expect(input.value).toBe('初期値追加');
  });

  it('behaves as a controlled input when value is provided', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<TextInput value="A" onChange={onChange} />);
    const input = screen.getByTestId('text-input') as HTMLInputElement;
    expect(input.value).toBe('A');

    await userEvent.type(input, 'B');
    expect(onChange).toHaveBeenCalledWith('AB');
    // Controlled: the DOM value does not change until the `value` prop does.
    expect(input.value).toBe('A');

    rerender(<TextInput value="AB" onChange={onChange} />);
    expect(input.value).toBe('AB');
  });

  it('wires id/aria-describedby/aria-invalid when used inside FormField', () => {
    render(
      <FormField label="メールアドレス" error="形式が正しくありません">
        <TextInput />
      </FormField>,
    );
    const input = screen.getByTestId('text-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('works standalone outside of FormField', () => {
    render(<TextInput defaultValue="" />);
    const input = screen.getByTestId('text-input');
    expect(input.id).toBeTruthy();
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('forwards the ref to the underlying <input> element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<TextInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <FormField label="名前">
        <TextInput />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
