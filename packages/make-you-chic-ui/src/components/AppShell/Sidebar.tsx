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
import { useId } from 'react'
import { useControllableState } from '../../utils/useControllableState'
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

export interface SidebarNavItem {
  /** Stable identity for expandedIds/React keys; `href` alone isn't unique (href-less group items are allowed). */
  id: string
  label: string
  icon?: IconName
  /** Omit for a group-only item that cannot itself be navigated to (rendered as static text; only its toggle button is interactive). */
  href?: string
  onClick?: (event: React.MouseEvent) => void
  /** Marks this item as the current page: adds aria-current="page" and a non-color visual indicator. Set by the consuming app. */
  current?: boolean
  /** Nested items, to any depth. No depth limit is enforced here — the consuming app is responsible for its own limit. */
  children?: SidebarNavItem[]
}

export interface SidebarNavSection {
  id: string
  /** Omit for an unlabeled group of items (no heading rendered). */
  heading?: string
  items: SidebarNavItem[]
}

export interface SidebarLabels {
  navigationLabel: string
  expandGroup: (label: string) => string
  collapseGroup: (label: string) => string
}

const DEFAULT_SIDEBAR_LABELS: SidebarLabels = {
  navigationLabel: 'メインナビゲーション',
  expandGroup: (label) => `${label}を開く`,
  collapseGroup: (label) => `${label}を閉じる`,
}

export interface SidebarProps {
  /** Flat nav list (legacy shape, kept working as-is). Ignored when navSections is provided. */
  navItems?: AppShellNavItem[]
  /** Nested nav list grouped into headed sections (Sidebar N-level menu). Takes priority over navItems when provided. */
  navSections?: SidebarNavSection[]
  /** Controlled set of expanded group ids. Omit for internally-managed (uncontrolled) expand state. */
  expandedIds?: Set<string>
  onExpandedChange?: (ids: Set<string>) => void
  /** Overrides for user-facing strings, e.g. for localization. */
  labels?: Partial<SidebarLabels>
}

function hasChildren(item: SidebarNavItem): boolean {
  return Boolean(item.children && item.children.length > 0)
}

/**
 * Internal to AppShell — not part of the public API (requirements.md FR1:
 * Sidebar/Topbar are not standalone components).
 */
export function Sidebar({
  navItems = [],
  navSections,
  expandedIds,
  onExpandedChange,
  labels,
}: SidebarProps): React.JSX.Element {
  const { collapsed, setCollapsed } = useAppShell()
  const sidebarId = useId()
  const resolvedLabels: SidebarLabels = { ...DEFAULT_SIDEBAR_LABELS, ...labels }

  const [expandedIdsState, setExpandedIdsState] = useControllableState<Set<string>>({
    value: expandedIds,
    defaultValue: new Set(),
    onChange: onExpandedChange,
  })

  function setExpanded(id: string, expand: boolean): void {
    const next = new Set(expandedIdsState)
    if (expand) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setExpandedIdsState(next)
  }

  function renderItem(item: SidebarNavItem, depth: number): React.JSX.Element {
    const itemHasChildren = hasChildren(item)
    const isExpanded = expandedIdsState.has(item.id)
    const groupId = `${sidebarId}-group-${item.id}`
    const rowStyle = { '--sidebar-item-depth': depth } as React.CSSProperties
    const linkClassName = item.current
      ? 'mycui-sidebar-nav-link current'
      : 'mycui-sidebar-nav-link'

    return (
      <li key={item.id}>
        <div className="mycui-sidebar-nav-row" style={rowStyle}>
          {item.href !== undefined ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className={linkClassName}
              aria-label={item.label}
              aria-current={item.current ? 'page' : undefined}
              title={item.label}
              data-testid={`sidebar-nav-${item.id}`}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              <span className="mycui-sidebar-nav-label">{item.label}</span>
            </a>
          ) : (
            <span
              className="mycui-sidebar-nav-label-static"
              title={item.label}
              data-testid={`sidebar-nav-${item.id}`}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              <span className="mycui-sidebar-nav-label">{item.label}</span>
            </span>
          )}
          {itemHasChildren && (
            <button
              type="button"
              className="mycui-sidebar-nav-toggle"
              aria-expanded={isExpanded}
              aria-controls={groupId}
              aria-label={
                isExpanded
                  ? resolvedLabels.collapseGroup(item.label)
                  : resolvedLabels.expandGroup(item.label)
              }
              onClick={() => setExpanded(item.id, !isExpanded)}
              data-testid={`sidebar-toggle-${item.id}`}
            >
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} />
            </button>
          )}
        </div>
        {itemHasChildren && isExpanded && (
          <ul id={groupId} className="mycui-sidebar-nav-list mycui-sidebar-nav-list-nested">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  function renderCollapsedItem(item: SidebarNavItem): React.JSX.Element {
    const itemHasChildren = hasChildren(item)

    if (!itemHasChildren && item.href !== undefined) {
      return (
        <li key={item.id}>
          <a
            href={item.href}
            onClick={item.onClick}
            className="mycui-sidebar-nav-link"
            aria-label={item.label}
            aria-current={item.current ? 'page' : undefined}
            title={item.label}
            data-testid={`sidebar-nav-${item.id}`}
          >
            {item.icon && <Icon name={item.icon} size={18} />}
          </a>
        </li>
      )
    }

    // A collapsed top-level group (with or without its own href): selecting
    // it opens the sidebar and expands the group, rather than navigating
    // away, so its children become reachable (requirements.md 3.8).
    return (
      <li key={item.id}>
        <button
          type="button"
          className="mycui-sidebar-nav-link"
          aria-label={item.label}
          title={item.label}
          onClick={() => {
            setCollapsed(false)
            if (itemHasChildren) setExpanded(item.id, true)
          }}
          data-testid={`sidebar-nav-${item.id}`}
        >
          {item.icon && <Icon name={item.icon} size={18} />}
        </button>
      </li>
    )
  }

  const sections = navSections?.filter((section) => section.items.length > 0)

  return (
    <nav
      className={collapsed ? 'mycui-sidebar collapsed' : 'mycui-sidebar'}
      aria-label={resolvedLabels.navigationLabel}
    >
      {sections ? (
        <ul className="mycui-sidebar-nav-list">
          {sections.map((section) => {
            const headingId = section.heading ? `${sidebarId}-heading-${section.id}` : undefined
            return (
              <li key={section.id} className="mycui-sidebar-section">
                {!collapsed && section.heading && (
                  <h2 id={headingId} className="mycui-sidebar-section-heading">
                    {section.heading}
                  </h2>
                )}
                <ul className="mycui-sidebar-nav-list" aria-labelledby={headingId}>
                  {section.items.map((item) =>
                    collapsed ? renderCollapsedItem(item) : renderItem(item, 0),
                  )}
                </ul>
              </li>
            )
          })}
        </ul>
      ) : (
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
      )}
    </nav>
  )
}
