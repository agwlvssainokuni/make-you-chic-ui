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
import './Dropdown.css';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { computeFloatingPosition } from '../../utils/computeFloatingPosition';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface DropdownProps {
  /** A single element that receives click/keyboard handlers and aria-haspopup/aria-expanded. */
  trigger: ReactElement;
  items: MenuItem[];
  /** @default 'bottom-start' */
  placement?: 'bottom-start' | 'bottom-end';
}

/**
 * Data-driven menu (Application Design Question 1 = B) with click-to-toggle
 * opening and full WAI-ARIA menu keyboard support (Functional Design
 * Question 2 = A, Question 3 = A).
 */
export function Dropdown({ trigger, items, placement = 'bottom-start' }: DropdownProps): React.JSX.Element {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function close(returnFocus: boolean): void {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function openMenu(): void {
    setActiveIndex(0);
    setOpen(true);
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    setPosition(computeFloatingPosition(triggerRect, menuRect, placement));
    itemRefs.current[0]?.focus();
  }, [open, placement]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function handleDocumentMouseDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close(false);
    }
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleMenuKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (activeIndex + 1) % items.length;
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = (activeIndex - 1 + items.length) % items.length;
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      itemRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(items.length - 1);
      itemRefs.current[items.length - 1]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
  }

  if (!isValidElement(trigger)) return trigger as React.JSX.Element;

  const clonedTrigger = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
    onClick: () => (open ? close(false) : openMenu()),
    'aria-haspopup': 'true',
    'aria-expanded': open,
    'data-testid': 'dropdown-trigger',
  });

  return (
    <>
      {clonedTrigger}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            id={id}
            tabIndex={-1}
            className="wds-dropdown-menu"
            style={{ top: position.top, left: position.left }}
            onKeyDown={handleMenuKeyDown}
            data-testid="dropdown-menu"
          >
            {items.map((item, index) => (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="wds-dropdown-item"
                onClick={() => {
                  item.onClick();
                  close(true);
                }}
                data-testid={`dropdown-item-${index}`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
