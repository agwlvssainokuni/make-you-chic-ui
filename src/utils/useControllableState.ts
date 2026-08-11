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
import { useEffect, useRef, useState } from 'react'

export interface UseControllableStateOptions<T> {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

/**
 * Shared Controlled/Uncontrolled implementation for TextInput, Textarea,
 * Select, Checkbox, Switch, and RadioGroup (Application Design Question 2
 * = B; see Unit 2 Functional Design: business-logic-model.md).
 *
 * - `value` provided (not undefined) -> Controlled: the returned value
 *   always mirrors `value`; `setValue` only calls `onChange`.
 * - `value` omitted -> Uncontrolled: internal state initialized from
 *   `defaultValue`; `setValue` updates it and calls `onChange`.
 * - Switching between the two modes across renders is a misuse warning in
 *   development (mirrors React's own <input> behavior).
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<T>(defaultValue)
  const wasControlled = useRef(isControlled)

  useEffect(() => {
    if (import.meta.env?.DEV && wasControlled.current !== isControlled) {
      console.warn(
        '[web-design-system-sample] A component switched between controlled and uncontrolled. Decide between using a controlled or uncontrolled value for the lifetime of the component.',
      )
    }
    wasControlled.current = isControlled
  }, [isControlled])

  const currentValue = isControlled ? (value as T) : internalValue

  function setValue(next: T): void {
    if (!isControlled) {
      setInternalValue(next)
    }
    onChange?.(next)
  }

  return [currentValue, setValue]
}
