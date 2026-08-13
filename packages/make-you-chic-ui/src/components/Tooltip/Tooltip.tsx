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
import './Tooltip.css'
import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
  computeFloatingPosition,
  type FloatingPlacement,
} from '../../utils/computeFloatingPosition'

export type TooltipPlacement = Extract<FloatingPlacement, 'top' | 'bottom' | 'left' | 'right'>

export interface TooltipProps {
  content: ReactNode
  /** A single element that receives hover/focus handlers and aria-describedby. */
  children: ReactElement
  /** @default 'top' */
  placement?: TooltipPlacement
}

const SHOW_DELAY_MS = 300

/**
 * Wraps a single trigger element with hover/focus-activated tooltip
 * content, positioned via manual viewport-relative calculation with a
 * one-step collision flip (Functional Design Question 5 = B).
 */
export function Tooltip({ content, children, placement = 'top' }: TooltipProps): React.JSX.Element {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const showTimeoutRef = useRef<number | undefined>(undefined)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    setPosition(computeFloatingPosition(triggerRect, tooltipRect, placement))
  }, [visible, placement])

  function scheduleShow(): void {
    window.clearTimeout(showTimeoutRef.current)
    showTimeoutRef.current = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS)
  }

  function hide(): void {
    window.clearTimeout(showTimeoutRef.current)
    setVisible(false)
  }

  if (!isValidElement(children)) return children as React.JSX.Element

  // The ref callback below runs during commit (when React attaches/detaches
  // the DOM node), not during render, so writing to the ref here is safe;
  // react-hooks/refs cannot statically verify that through cloneElement.
  // eslint-disable-next-line react-hooks/refs
  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node
    },
    onMouseEnter: scheduleShow,
    onMouseLeave: hide,
    onFocus: scheduleShow,
    onBlur: hide,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') hide()
    },
    'aria-describedby': id,
  })

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            id={id}
            className="mycui-tooltip"
            style={{ top: position.top, left: position.left }}
            data-testid="tooltip"
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
