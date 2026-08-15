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
import { useContext, useId } from 'react'
import { FormFieldContext } from './FormFieldContext'

export interface FieldA11yProps {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': boolean | undefined
}

/**
 * Shared by TextInput/Textarea/Select/Checkbox/Switch/RadioGroup: returns
 * id/aria-describedby/aria-invalid, either sourced from the enclosing
 * <FormField> (Context) or, when used standalone, generated locally via
 * useId() with no aria-describedby/aria-invalid (Functional Design
 * Question 1 = A).
 */
export function useFieldProps(): FieldA11yProps {
  const ctx = useContext(FormFieldContext)
  const standaloneId = useId()

  if (ctx === null) {
    return { id: standaloneId, 'aria-describedby': undefined, 'aria-invalid': undefined }
  }

  const describedBy = [ctx.errorId, ctx.helperTextId].filter(Boolean).join(' ') || undefined

  return {
    id: ctx.fieldId,
    'aria-describedby': describedBy,
    'aria-invalid': ctx.hasError || undefined,
  }
}
