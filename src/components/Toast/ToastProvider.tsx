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
import './Toast.css';
import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon, type IconName } from '../Icon';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ShowToastOptions {
  message: string;
  /** @default 'info' */
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. @default 4000 */
  duration?: number;
}

export interface ToastContextValue {
  show: (options: ShowToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  info: 'bell',
  success: 'check',
  warning: 'bell',
  danger: 'close',
};

let idCounter = 0;

/** Manages the Toast queue and renders it via a portal (business-logic-model.md). */
export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, { remaining: number; startedAt: number; timeoutId: number }>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer.timeoutId);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const scheduleTimeout = useCallback(
    (id: string, ms: number) => {
      const timeoutId = window.setTimeout(() => dismiss(id), ms);
      timers.current.set(id, { remaining: ms, startedAt: Date.now(), timeoutId });
    },
    [dismiss],
  );

  const show = useCallback(
    ({ message, variant = 'info', duration = DEFAULT_DURATION }: ShowToastOptions): string => {
      idCounter += 1;
      const id = `toast-${idCounter}`;
      setItems((prev) => [{ id, message, variant, duration }, ...prev]);
      scheduleTimeout(id, duration);
      return id;
    },
    [scheduleTimeout],
  );

  const pause = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (!timer) return;
    window.clearTimeout(timer.timeoutId);
    const elapsed = Date.now() - timer.startedAt;
    timers.current.set(id, { ...timer, remaining: Math.max(timer.remaining - elapsed, 0) });
  }, []);

  const resume = useCallback(
    (id: string) => {
      const timer = timers.current.get(id);
      if (!timer) return;
      scheduleTimeout(id, timer.remaining);
    },
    [scheduleTimeout],
  );

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="wds-toast-container" role="status" aria-live="polite" data-testid="toast-container">
          {items.map((item) => (
            <div
              key={item.id}
              className={`wds-toast variant-${item.variant}`}
              onMouseEnter={() => pause(item.id)}
              onMouseLeave={() => resume(item.id)}
              data-testid={`toast-${item.id}`}
            >
              <Icon name={VARIANT_ICON[item.variant]} size={16} />
              <span className="wds-toast-message">{item.message}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
