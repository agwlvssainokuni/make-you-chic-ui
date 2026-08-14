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
import './AppShell.css'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { safeLocalStorageGet, safeLocalStorageSet } from '../../theme/storage'
import {
  AppShellContext,
  APPSHELL_COLLAPSED_STORAGE_KEY,
  type AppShellContextValue,
} from './AppShellContext'
import { Sidebar, type AppShellNavItem } from './Sidebar'
import { Topbar, type AppShellUser } from './Topbar'
import type { MenuItem } from '../Dropdown'

export type { AppShellNavItem, AppShellUser }

export interface AppShellProps {
  navItems: AppShellNavItem[]
  user?: AppShellUser
  /** Menu shown when the user avatar is clicked. Omit for a display-only avatar. */
  userMenuItems?: MenuItem[]
  /** Rendered in the topbar, left-aligned, after the sidebar collapse button. */
  topbarStart?: ReactNode
  /** Rendered in the topbar, right-aligned, before the user menu. */
  topbarEnd?: ReactNode
  /** Main content, rendered in the content area. */
  children: ReactNode
}

function readInitialCollapsed(): boolean {
  return safeLocalStorageGet(APPSHELL_COLLAPSED_STORAGE_KEY) === 'true'
}

/**
 * Top-level layout shell (Sidebar + Topbar + Content) that every screen in
 * a consuming app renders inside of. Owns the Sidebar collapse state,
 * exposed via useAppShell() (see Unit 1 services.md, Unit 5 Functional
 * Design). Sidebar/Topbar are internal-only, not exported (requirements.md
 * FR1). No notification icon (Question 5 = X: discontinued).
 */
export function AppShell({
  navItems,
  user,
  userMenuItems,
  topbarStart,
  topbarEnd,
  children,
}: AppShellProps): React.JSX.Element {
  const [collapsed, setCollapsedState] = useState<boolean>(readInitialCollapsed)

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    safeLocalStorageSet(APPSHELL_COLLAPSED_STORAGE_KEY, String(value))
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev
      safeLocalStorageSet(APPSHELL_COLLAPSED_STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const contextValue = useMemo<AppShellContextValue>(
    () => ({ collapsed, toggleCollapsed, setCollapsed }),
    [collapsed, toggleCollapsed, setCollapsed],
  )

  return (
    <AppShellContext.Provider value={contextValue}>
      <div
        className={collapsed ? 'mycui-app-shell collapsed' : 'mycui-app-shell'}
        data-testid="app-shell"
      >
        <Sidebar navItems={navItems} />
        <Topbar
          user={user}
          userMenuItems={userMenuItems}
          topbarStart={topbarStart}
          topbarEnd={topbarEnd}
        />
        <main className="mycui-app-shell-content" data-testid="app-shell-content">
          {children}
        </main>
      </div>
    </AppShellContext.Provider>
  )
}
