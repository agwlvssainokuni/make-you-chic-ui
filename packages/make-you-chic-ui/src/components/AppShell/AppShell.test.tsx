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

  it('renders topbarStart left-aligned and topbarEnd right-aligned, before the user menu', () => {
    render(
      <AppShell
        navItems={navItems}
        user={{ name: '山田 太郎' }}
        topbarStart={<span data-testid="topbar-start">検索</span>}
        topbarEnd={<span data-testid="topbar-end">お知らせ</span>}
      >
        <p>本文</p>
      </AppShell>,
    )
    const topbar = screen.getByTestId('sidebar-toggle').closest('header')
    const children = Array.from(topbar?.children ?? [])
    const indexOf = (el: Element | null) => (el ? children.indexOf(el) : -1)
    expect(indexOf(screen.getByTestId('sidebar-toggle'))).toBeLessThan(
      indexOf(screen.getByTestId('topbar-start')),
    )
    expect(indexOf(screen.getByTestId('topbar-start'))).toBeLessThan(
      indexOf(screen.getByTestId('topbar-end')),
    )
    expect(indexOf(screen.getByTestId('topbar-end'))).toBeLessThan(
      indexOf(screen.getByRole('img', { name: '山田 太郎' })),
    )
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <AppShell navItems={navItems} user={{ name: '山田 太郎' }}>
        <p>本文</p>
      </AppShell>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('navSections (N-level menu)', () => {
    const sections = [
      {
        id: 'business',
        heading: '業務',
        items: [
          {
            id: 'users',
            label: '利用者',
            children: [
              { id: 'users-list', label: '一覧', href: '/users' },
              { id: 'users-roles', label: 'ロール', href: '/users/roles', current: true },
            ],
          },
        ],
      },
      {
        id: 'admin',
        heading: '管理',
        items: [{ id: 'admin-dsl', label: 'DSL', href: '/admin/dsl' }],
      },
    ]

    it('takes priority over navItems when both are provided', () => {
      render(
        <AppShell navItems={navItems} navSections={sections} navExpandedIds={new Set(['users'])}>
          <p>本文</p>
        </AppShell>,
      )
      expect(screen.queryByTestId('sidebar-nav-/dashboard')).not.toBeInTheDocument()
      expect(screen.getByTestId('sidebar-nav-users-list')).toBeInTheDocument()
    })

    it('renders section headings, labelling each section list', () => {
      render(
        <AppShell navSections={sections}>
          <p>本文</p>
        </AppShell>,
      )
      const businessHeading = screen.getByRole('heading', { name: '業務' })
      const businessList = businessHeading.nextElementSibling
      expect(businessList?.tagName).toBe('UL')
      expect(businessList).toHaveAccessibleName('業務')
    })

    it('does not render a group with no items', () => {
      render(
        <AppShell navSections={[{ id: 'empty', heading: '空', items: [] }, ...sections]}>
          <p>本文</p>
        </AppShell>,
      )
      expect(screen.queryByRole('heading', { name: '空' })).not.toBeInTheDocument()
    })

    it('shows a group toggle with aria-expanded, and reveals children only when expanded', async () => {
      render(
        <AppShell navSections={sections}>
          <p>本文</p>
        </AppShell>,
      )
      expect(screen.queryByTestId('sidebar-nav-users-list')).not.toBeInTheDocument()
      const toggle = screen.getByTestId('sidebar-toggle-users')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(toggle).toHaveAccessibleName('利用者を開く')

      await userEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAccessibleName('利用者を閉じる')
      expect(screen.getByTestId('sidebar-nav-users-list')).toBeInTheDocument()
    })

    it('reaches a deeply nested item by keyboard alone (Tab between links and toggle buttons)', async () => {
      render(
        <AppShell navSections={sections} navExpandedIds={new Set(['users'])}>
          <p>本文</p>
        </AppShell>,
      )
      // "users" has no href of its own (group-only), so its toggle button
      // is the first focusable element in the Sidebar (which precedes the
      // Topbar's collapse button in DOM order).
      await userEvent.tab()
      expect(screen.getByTestId('sidebar-toggle-users')).toHaveFocus()
      await userEvent.tab() // users-list link (already expanded)
      expect(screen.getByTestId('sidebar-nav-users-list')).toHaveFocus()
      await userEvent.tab() // users-roles link
      expect(screen.getByTestId('sidebar-nav-users-roles')).toHaveFocus()
    })

    it('marks the current item with aria-current="page"', () => {
      render(
        <AppShell navSections={sections} navExpandedIds={new Set(['users'])}>
          <p>本文</p>
        </AppShell>,
      )
      expect(screen.getByTestId('sidebar-nav-users-roles')).toHaveAttribute('aria-current', 'page')
      expect(screen.getByTestId('sidebar-nav-users-list')).not.toHaveAttribute('aria-current')
    })

    it('renders an href-less group item as static (non-interactive) text', () => {
      render(
        <AppShell
          navSections={[
            {
              id: 'business',
              items: [
                {
                  id: 'group-only',
                  label: '移れないまとまり',
                  children: [{ id: 'leaf', label: '項目', href: '/leaf' }],
                },
              ],
            },
          ]}
        >
          <p>本文</p>
        </AppShell>,
      )
      const label = screen.getByTestId('sidebar-nav-group-only')
      expect(label.tagName).toBe('SPAN')
    })

    it('supports English labels via navLabels, for the navigation region and group toggles', () => {
      render(
        <AppShell
          navSections={sections}
          navLabels={{
            navigationLabel: 'Main navigation',
            expandGroup: (label) => `Expand ${label}`,
            collapseGroup: (label) => `Collapse ${label}`,
          }}
        >
          <p>本文</p>
        </AppShell>,
      )
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
      expect(screen.getByTestId('sidebar-toggle-users')).toHaveAccessibleName('Expand 利用者')
    })

    it('calls onNavExpandedChange with the updated set instead of managing state when controlled', async () => {
      let lastIds: Set<string> | null = null
      render(
        <AppShell
          navSections={sections}
          navExpandedIds={new Set()}
          onNavExpandedChange={(ids) => (lastIds = ids)}
        >
          <p>本文</p>
        </AppShell>,
      )
      await userEvent.click(screen.getByTestId('sidebar-toggle-users'))
      expect(lastIds).toEqual(new Set(['users']))
      // Controlled: without the app re-rendering with the new ids, the child stays hidden.
      expect(screen.queryByTestId('sidebar-nav-users-list')).not.toBeInTheDocument()
    })

    it('has no detectable accessibility violations with nested sections, a current item, and a group-only item', async () => {
      const { container } = render(
        <AppShell navSections={sections} navExpandedIds={new Set(['users'])} user={{ name: '山田 太郎' }}>
          <p>本文</p>
        </AppShell>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('collapses to top-level icons only, and selecting a group opens the sidebar and expands it', async () => {
      render(
        <AppShell navSections={sections}>
          <p>本文</p>
        </AppShell>,
      )
      await userEvent.click(screen.getByTestId('sidebar-toggle'))
      expect(screen.getByTestId('app-shell')).toHaveClass('collapsed')
      expect(screen.queryByTestId('sidebar-toggle-users')).not.toBeInTheDocument()

      const usersButton = screen.getByTestId('sidebar-nav-users')
      expect(usersButton.tagName).toBe('BUTTON')
      await userEvent.click(usersButton)
      expect(screen.getByTestId('app-shell')).not.toHaveClass('collapsed')
      expect(screen.getByTestId('sidebar-nav-users-list')).toBeInTheDocument()
    })
  })
})
