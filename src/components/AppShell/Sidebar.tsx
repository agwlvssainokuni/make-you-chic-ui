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
import { Icon, type IconName } from '../Icon'
import { useAppShell } from './AppShellContext'

export interface AppShellNavItem {
  label: string
  icon?: IconName
  href: string
  /**
   * SPA router integration (e.g. react-router): when provided, called on
   * click alongside the native `href` navigation. Call
   * `event.preventDefault()` inside to take over navigation yourself.
   */
  onClick?: (event: React.MouseEvent) => void
}

export interface SidebarProps {
  navItems: AppShellNavItem[]
}

/**
 * Internal to AppShell — not part of the public API (requirements.md FR1:
 * Sidebar/Topbar are not standalone components).
 */
export function Sidebar({ navItems }: SidebarProps): React.JSX.Element {
  const { collapsed } = useAppShell()

  return (
    <nav
      className={collapsed ? 'mycui-sidebar collapsed' : 'mycui-sidebar'}
      aria-label="メインナビゲーション"
    >
      <ul className="mycui-sidebar-nav-list">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={item.onClick}
              className="mycui-sidebar-nav-link"
              aria-label={item.label}
              data-testid={`sidebar-nav-${item.href}`}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              {!collapsed && <span className="mycui-sidebar-nav-label">{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
