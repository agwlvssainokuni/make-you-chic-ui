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
import './Badge.css';
import type { ReactNode } from 'react';

export interface BadgeProps {
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Numeric count to display. Rounds to `${maxCount}+` when it exceeds maxCount. */
  count?: number;
  /** @default 99 */
  maxCount?: number;
  /** Arbitrary content, used when `count` is not provided (e.g. a short label). */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Small status/count indicator, typically overlaid on another element. */
export function Badge({
  variant = 'primary',
  count,
  maxCount = 99,
  children,
  className,
  style,
}: BadgeProps): React.JSX.Element {
  const content = count !== undefined ? (count > maxCount ? `${maxCount}+` : String(count)) : children;
  const isEmpty = content === undefined || content === null || content === '';

  const classes = ['wds-badge', `variant-${variant}`, isEmpty && 'wds-badge-empty', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} style={style} data-testid="badge">
      {!isEmpty && content}
    </span>
  );
}
