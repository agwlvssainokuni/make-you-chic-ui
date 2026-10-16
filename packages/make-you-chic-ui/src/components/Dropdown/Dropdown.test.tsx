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
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Dropdown } from './Dropdown'

const items = [
  { label: 'プロフィール', onClick: vi.fn() },
  { label: 'ログアウト', onClick: vi.fn() },
]

describe('Dropdown', () => {
  it('is closed by default', () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on trigger click and focuses the first item', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-item-0')).toHaveFocus()
  })

  it('closes when the trigger is clicked again (toggle)', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    render(
      <div>
        <Dropdown trigger={<button>メニュー</button>} items={items} />
        <button data-testid="outside">外側</button>
      </div>,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('navigates items with ArrowDown/ArrowUp, wrapping at the edges', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('dropdown-item-1')).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('dropdown-item-0')).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByTestId('dropdown-item-1')).toHaveFocus()
  })

  it('closes and returns focus to the trigger on Escape', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('calls the item onClick and closes when an item is selected', async () => {
    const onClick = vi.fn()
    render(<Dropdown trigger={<button>メニュー</button>} items={[{ label: '削除', onClick }]} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('dropdown-item-0'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('sets aria-haspopup and aria-expanded on the trigger', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    const trigger = screen.getByTestId('dropdown-trigger')
    expect(trigger).toHaveAttribute('aria-haspopup', 'true')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders an item with href as a real anchor, and still calls onClick and closes on selection', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: 'プロフィール', href: '/profile', onClick }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const item = screen.getByTestId('dropdown-item-0')
    expect(item.tagName).toBe('A')
    expect(item).toHaveAttribute('href', '/profile')

    await userEvent.click(item)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('activates an href item with the Space key', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: 'プロフィール', href: '/profile', onClick }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('merges menuClassName and menuStyle onto the menu element', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={items}
        menuClassName="custom-menu"
        menuStyle={{ maxWidth: 240 }}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const menu = screen.getByTestId('dropdown-menu')
    expect(menu).toHaveClass('mycui-dropdown-menu')
    expect(menu).toHaveClass('custom-menu')
    expect(menu).toHaveStyle({ maxWidth: '240px' })
  })

  it('has no detectable accessibility violations while open', async () => {
    render(<Dropdown trigger={<button>メニュー</button>} items={items} />)
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    // The menu portals to document.body outside of any page landmark; the
    // "region" rule checks whole-page landmark coverage, which isn't
    // meaningful when testing an isolated component fragment.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('does not call onClick or close when a disabled item is clicked', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '削除', disabled: true, onClick }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const item = screen.getByTestId('dropdown-item-0')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(item)
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('does not call onClick when a disabled item is activated with Enter or Space', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '削除', disabled: true, onClick }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('omits href and does not navigate for a disabled href item', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: 'プロフィール', href: '/profile', disabled: true, onClick }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const item = screen.getByTestId('dropdown-item-0')
    expect(item).not.toHaveAttribute('href')
    await userEvent.click(item)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('moves focus to a disabled item with ArrowDown', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: 'プロフィール', onClick: vi.fn() }, { label: '削除', disabled: true, onClick: vi.fn() }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByTestId('dropdown-item-1')).toHaveFocus()
  })

  it('links an item to its description via aria-describedby', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '削除', disabled: true, description: '自分自身は削除できません' }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const item = screen.getByTestId('dropdown-item-0')
    const describedBy = item.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent('自分自身は削除できません')
  })

  it('exposes the label alone as the accessible name, not the label plus description', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '削除', disabled: true, description: '自分自身は削除できません' }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    expect(screen.getByRole('menuitem', { name: '削除' })).toBe(screen.getByTestId('dropdown-item-0'))
  })

  it('has no detectable accessibility violations with disabled items and descriptions', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[
          { label: '削除', disabled: true, description: '自分自身は削除できません' },
          { label: '編集', onClick: vi.fn(), description: '内容を編集します' },
        ]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('renders the description outside the menuitem control (sibling, not descendant)', async () => {
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '削除', disabled: true, description: '自分自身は削除できません' }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    const item = screen.getByTestId('dropdown-item-0')
    expect(item).not.toHaveTextContent('自分自身は削除できません')
    const describedBy = item.getAttribute('aria-describedby')
    const description = document.getElementById(describedBy ?? '')
    expect(description).not.toBeNull()
    expect(item.contains(description)).toBe(false)
  })

  it('still activates on selection when an item with a description is clicked', async () => {
    const onClick = vi.fn()
    render(
      <Dropdown
        trigger={<button>メニュー</button>}
        items={[{ label: '編集', onClick, description: '内容を編集します' }]}
      />,
    )
    await userEvent.click(screen.getByTestId('dropdown-trigger'))
    await userEvent.click(screen.getByTestId('dropdown-item-0'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // axe-core's label-content-name-mismatch check (WCAG 2.5.3) is
  // experimental in the installed axe-core version and becomes default-on
  // from axe-core 4.14. It can't be meaningfully unit-tested here: its
  // evaluate function calls HTMLCanvasElement.getContext() (to detect icon
  // ligatures), which jsdom doesn't implement, so it always reports
  // "incomplete" rather than a real pass/fail in this environment (verified
  // directly: forcing the rule to run via runOnly reports status
  // "incomplete" with a canvas TypeError, for both the old and new
  // structure — never a real pass/fail either way). The structural test
  // above (description is a sibling, not a descendant, of the menuitem) is
  // what actually guards this regression; the rule itself was verified
  // against a real browser instead.
})
