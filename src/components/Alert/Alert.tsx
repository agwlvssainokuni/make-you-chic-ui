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
import './Alert.css';
import { forwardRef, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_ICON: Record<AlertVariant, IconName> = {
  info: 'bell',
  success: 'check',
  warning: 'bell',
  danger: 'close',
};

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  action?: AlertAction;
  className?: string;
  style?: React.CSSProperties;
}

/** Persistent, non-modal notification (unlike Toast, does not auto-dismiss). */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant, title, children, onDismiss, action, className, style },
  ref,
) {
  const classes = ['wds-alert', `variant-${variant}`, className].filter(Boolean).join(' ');
  const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div ref={ref} className={classes} style={style} role={role} data-testid="alert">
      <Icon name={VARIANT_ICON[variant]} size={18} />
      <div className="wds-alert-body">
        {title && <p className="wds-alert-title">{title}</p>}
        <div>{children}</div>
        {action && (
          <button type="button" className="wds-alert-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="wds-alert-dismiss-button"
          onClick={onDismiss}
          aria-label="閉じる"
          data-testid="alert-dismiss-button"
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
});
