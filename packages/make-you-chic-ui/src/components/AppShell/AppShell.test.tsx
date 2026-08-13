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
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { AppShell } from './AppShell'
import { APPSHELL_COLLAPSED_STORAGE_KEY } from './AppShellContext'

const navItems = [
  { label: 'ダッシュボード', icon: 'menu' as const, href: '/dashboard' },
  { label: 'ユーザー', icon: 'user' as const, href: '/users' },
]

describe('AppShell', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('renders nav items and main content', () => {
    render(
      <AppShell navItems={navItems}>
        <p>本文</p>
      </AppShell>,
    )
    expect(screen.getByTestId('sidebar-nav-/dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-nav-/users')).toBeInTheDocument()
    expect(screen.getByText('本文')).toBeInTheDocument()
  })

  it('starts expanded by default', () => {
    render(
      <AppShell navItems={navItems}>
        <p>本文</p>
      </AppShell>,
    )
    expect(screen.getByTestId('app-shell')).not.toHaveClass('collapsed')
  })

  it('toggles collapsed state when the sidebar toggle button is clicked, and persists it', async () => {
    render(
      <AppShell navItems={navItems}>
        <p>本文</p>
      </AppShell>,
    )
    await userEvent.click(screen.getByTestId('sidebar-toggle'))
    expect(screen.getByTestId('app-shell')).toHaveClass('collapsed')
    expect(window.localStorage.getItem(APPSHELL_COLLAPSED_STORAGE_KEY)).toBe('true')
  })

  it('restores the collapsed state from localStorage on mount', () => {
    window.localStorage.setItem(APPSHELL_COLLAPSED_STORAGE_KEY, 'true')
    render(
      <AppShell navItems={navItems}>
        <p>本文</p>
      </AppShell>,
    )
    expect(screen.getByTestId('app-shell')).toHaveClass('collapsed')
  })

  it('renders a display-only avatar when user is provided without userMenuItems', () => {
    render(
      <AppShell navItems={navItems} user={{ name: '山田 太郎' }}>
        <p>本文</p>
      </AppShell>,
    )
    expect(screen.getByRole('img', { name: '山田 太郎' })).toBeInTheDocument()
    expect(screen.queryByTestId('dropdown-trigger')).not.toBeInTheDocument()
  })

  it('renders a user menu Dropdown when userMenuItems is provided, and invokes the selected action', async () => {
    let loggedOut = false
    render(
      <AppShell
        navItems={navItems}
        user={{ name: '山田 太郎' }}
        userMenuItems={[{ label: 'ログアウト', onClick: () => (loggedOut = true) }]}
      >
        <p>本文</p>
      </AppShell>,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('dropdown-item-0'))
    expect(loggedOut).toBe(true)
  })

  it('calls onClick on a nav item when clicked (SPA router integration)', async () => {
    let clicked = false
    render(
      <AppShell
        navItems={[
          ...navItems,
          {
            label: 'カタログ',
            href: '/catalog',
            onClick: (e) => {
              e.preventDefault()
              clicked = true
            },
          },
        ]}
      >
        <p>本文</p>
      </AppShell>,
    )
    await userEvent.click(screen.getByTestId('sidebar-nav-/catalog'))
    expect(clicked).toBe(true)
  })

  it('does not render a notification icon (discontinued feature)', () => {
    render(
      <AppShell navItems={navItems}>
        <p>本文</p>
      </AppShell>,
    )
    expect(screen.queryByTestId('icon-bell')).not.toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <AppShell navItems={navItems} user={{ name: '山田 太郎' }}>
        <p>本文</p>
      </AppShell>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
