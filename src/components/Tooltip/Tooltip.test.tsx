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
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is not visible initially', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows after the delay following mouseenter', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('削除します');
  });

  it('cancels the pending show if mouseleave happens before the delay elapses', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(150);
    });
    fireEvent.mouseLeave(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides immediately on mouseleave once shown', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on focus and hides on Escape', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('sets aria-describedby on the trigger pointing at the tooltip id', () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    const trigger = screen.getByRole('button');
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('has no detectable accessibility violations while visible', async () => {
    render(
      <Tooltip content="削除します">
        <button>削除</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
