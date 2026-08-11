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
import { createContext } from 'react';

export interface FormFieldContextValue {
  /** id to apply to the wrapped input element. */
  fieldId: string;
  /** id of the error message element, referenced via aria-describedby. */
  errorId: string | undefined;
  /** id of the helper text element, referenced via aria-describedby. */
  helperTextId: string | undefined;
  /** Whether the field currently has an error (drives aria-invalid). */
  hasError: boolean;
}

/**
 * Provided by <FormField>; consumed by TextInput/Textarea/Select/Checkbox/
 * Switch/RadioGroup so they can automatically wire id/aria-describedby/
 * aria-invalid. Components used outside of <FormField> see `null` here and
 * fall back to generating their own id (fail-soft, see Functional Design
 * Question 1 = A).
 */
export const FormFieldContext = createContext<FormFieldContextValue | null>(null);
