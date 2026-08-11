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
import './Tooltip.css';
import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  /** A single element that receives hover/focus handlers and aria-describedby. */
  children: ReactElement;
  /** @default 'top' */
  placement?: TooltipPlacement;
}

const SHOW_DELAY_MS = 300;
const OFFSET_PX = 8;

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function computePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
): { top: number; left: number } {
  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - tooltipRect.height - OFFSET_PX,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + OFFSET_PX,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - OFFSET_PX,
      };
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + OFFSET_PX,
      };
  }
}

/** Returns true if the computed box would overflow the viewport. */
function overflowsViewport(top: number, left: number, rect: DOMRect): boolean {
  return top < 0 || left < 0 || top + rect.height > window.innerHeight || left + rect.width > window.innerWidth;
}

/**
 * Wraps a single trigger element with hover/focus-activated tooltip
 * content, positioned via manual viewport-relative calculation with a
 * one-step collision flip (Functional Design Question 5 = B).
 */
export function Tooltip({ content, children, placement = 'top' }: TooltipProps): React.JSX.Element {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | undefined>(undefined);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let next = computePosition(triggerRect, tooltipRect, placement);
    if (overflowsViewport(next.top, next.left, tooltipRect)) {
      next = computePosition(triggerRect, tooltipRect, OPPOSITE[placement]);
    }
    setPosition(next);
  }, [visible, placement]);

  function scheduleShow(): void {
    window.clearTimeout(showTimeoutRef.current);
    showTimeoutRef.current = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
  }

  function hide(): void {
    window.clearTimeout(showTimeoutRef.current);
    setVisible(false);
  }

  if (!isValidElement(children)) return children as React.JSX.Element;

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
    onMouseEnter: scheduleShow,
    onMouseLeave: hide,
    onFocus: scheduleShow,
    onBlur: hide,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    },
    'aria-describedby': id,
  });

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            id={id}
            className="wds-tooltip"
            style={{ top: position.top, left: position.left }}
            data-testid="tooltip"
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
