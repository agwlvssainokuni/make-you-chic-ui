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
import { useContext } from 'react'
import { ToastContext, type ToastContextValue } from './ToastProvider'

const noop: ToastContextValue = {
  show: () => {
    if (import.meta.env?.DEV) {
      console.warn('[make-you-chic-ui] useToast() was called outside of <ToastProvider>.')
    }
    return ''
  },
  dismiss: () => {},
}

/** Returns `{ show, dismiss }`. Outside of <ToastProvider>, falls back to a dev-warning no-op. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  return ctx ?? noop
}
