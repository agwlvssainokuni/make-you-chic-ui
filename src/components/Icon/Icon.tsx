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
import './Icon.css';
import { iconRegistry, type IconName } from './registry';

export interface IconProps {
  /** Name of a bundled icon (see `iconRegistry`). */
  name: IconName;
  /** Pixel size applied to both width and height. @default 20 */
  size?: number;
  /**
   * Accessible label. When provided, the icon is exposed to assistive
   * technology as an image with this name. When omitted, the icon is
   * treated as decorative (`aria-hidden`).
   */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a bundled SVG icon by name. Unknown names render nothing and log
 * a dev-only warning (fail-soft, see Functional Design Question 3 = A).
 */
export function Icon({
  name,
  size = 20,
  label,
  className,
  style,
}: IconProps): React.JSX.Element | null {
  const SvgComponent = iconRegistry[name];

  if (!SvgComponent) {
    if (import.meta.env?.DEV) {
      console.warn(`[web-design-system-sample] Unknown icon name: "${name}"`);
    }
    return null;
  }

  const a11yProps = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };

  return (
    <SvgComponent
      width={size}
      height={size}
      className={className ? `wds-icon ${className}` : 'wds-icon'}
      style={style}
      data-testid={`icon-${name}`}
      {...a11yProps}
    />
  );
}
