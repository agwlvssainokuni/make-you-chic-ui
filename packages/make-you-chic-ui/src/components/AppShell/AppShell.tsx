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
import './AppShell.css'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { safeLocalStorageGet, safeLocalStorageSet } from '../../theme/storage'
import {
  AppShellContext,
  APPSHELL_COLLAPSED_STORAGE_KEY,
  type AppShellContextValue,
} from './AppShellContext'
import { Sidebar, type AppShellNavItem, type SidebarNavSection, type SidebarLabels } from './Sidebar'
import { Topbar, type AppShellUser } from './Topbar'
import type { MenuItem } from '../Dropdown'

export type { AppShellNavItem, SidebarNavItem, SidebarNavSection, SidebarLabels } from './Sidebar'
export type { AppShellUser } from './Topbar'

export interface AppShellProps {
  /** Flat nav list (legacy shape, kept working as-is). Ignored when navSections is provided. */
  navItems?: AppShellNavItem[]
  /** Nested nav list grouped into headed sections (Sidebar N-level menu). Takes priority over navItems when provided. */
  navSections?: SidebarNavSection[]
  /** Controlled set of expanded group ids (navSections only). Omit for internally-managed (uncontrolled) expand state. */
  navExpandedIds?: Set<string>
  onNavExpandedChange?: (ids: Set<string>) => void
  /** Overrides for the Sidebar's user-facing strings, e.g. for localization. */
  navLabels?: Partial<SidebarLabels>
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
  navSections,
  navExpandedIds,
  onNavExpandedChange,
  navLabels,
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
        <Sidebar
          navItems={navItems}
          navSections={navSections}
          expandedIds={navExpandedIds}
          onExpandedChange={onNavExpandedChange}
          labels={navLabels}
        />
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
