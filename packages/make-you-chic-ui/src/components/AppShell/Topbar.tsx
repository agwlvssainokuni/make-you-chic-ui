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
import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { Avatar } from '../Avatar'
import { Dropdown, type MenuItem } from '../Dropdown'
import { useAppShell } from './AppShellContext'

export interface AppShellUser {
  name: string
  avatarSrc?: string
}

export interface TopbarProps {
  user?: AppShellUser
  userMenuItems?: MenuItem[]
  /** Rendered left-aligned, after the sidebar collapse button. */
  topbarStart?: ReactNode
  /** Rendered right-aligned, before the user menu. */
  topbarEnd?: ReactNode
}

/**
 * Internal to AppShell — not part of the public API (requirements.md FR1:
 * Sidebar/Topbar are not standalone components). No breadcrumbs, per FR1.
 */
export function Topbar({
  user,
  userMenuItems,
  topbarStart,
  topbarEnd,
}: TopbarProps): React.JSX.Element {
  const { toggleCollapsed, collapsed } = useAppShell()

  return (
    <header className="mycui-topbar">
      <button
        type="button"
        className="mycui-topbar-collapse-button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'サイドバーを開く' : 'サイドバーを折り畳む'}
        data-testid="sidebar-toggle"
      >
        <Icon name="menu" size={20} />
      </button>
      {topbarStart}
      <div className="mycui-topbar-spacer" />
      {topbarEnd}
      {user &&
        (userMenuItems && userMenuItems.length > 0 ? (
          <Dropdown
            trigger={
              <button
                type="button"
                className="mycui-topbar-user-trigger"
                aria-label={`${user.name}のメニュー`}
              >
                <Avatar name={user.name} src={user.avatarSrc} size="md" />
              </button>
            }
            items={userMenuItems}
            placement="bottom-end"
          />
        ) : (
          <Avatar name={user.name} src={user.avatarSrc} size="md" />
        ))}
    </header>
  )
}
