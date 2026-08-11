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
import './Tabs.css';
import { useId, useRef, type ReactNode } from 'react';
import { useControllableState } from '../../utils/useControllableState';

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  'aria-label'?: string;
}

/**
 * Data-driven tabs (Application Design Question 1 = B) with automatic
 * activation on arrow-key navigation and roving tabindex (Functional
 * Design Question 1 = A).
 */
export function Tabs({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onChange,
  'aria-label': ariaLabel,
}: TabsProps): React.JSX.Element {
  const baseId = useId();
  const [current, setCurrent] = useControllableState({
    value: activeIndex,
    defaultValue: defaultActiveIndex,
    onChange,
  });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusAndSelect(index: number): void {
    setCurrent(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAndSelect((index + 1) % items.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAndSelect((index - 1 + items.length) % items.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelect(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusAndSelect(items.length - 1);
    }
  }

  return (
    <div data-testid="tabs">
      <div className="wds-tabs-list" role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const selected = index === current;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          return (
            <button
              key={tabId}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId}
              className={selected ? 'wds-tab active' : 'wds-tab'}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-testid={`tab-${index}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        className="wds-tab-panel"
        role="tabpanel"
        id={`${baseId}-panel-${current}`}
        aria-labelledby={`${baseId}-tab-${current}`}
        tabIndex={0}
        data-testid="tab-panel"
      >
        {items[current]?.content}
      </div>
    </div>
  );
}
