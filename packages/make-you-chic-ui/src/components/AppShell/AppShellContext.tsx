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
import { createContext, useContext } from 'react'

export const APPSHELL_COLLAPSED_STORAGE_KEY = 'design-system-appshell-collapsed'

export interface AppShellContextValue {
  collapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
}

export const AppShellContext = createContext<AppShellContextValue | null>(null)

const fallback: AppShellContextValue = {
  collapsed: false,
  toggleCollapsed: () => {},
  setCollapsed: () => {},
}

/**
 * Consumed by Sidebar/Topbar (internal) and by consuming apps that need to
 * read/control the collapse state from custom UI. Only meaningful inside
 * <AppShell>; falls back to inert defaults outside of it (fail-soft,
 * consistent with useTheme/useToast).
 */
export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext)
  return ctx ?? fallback
}
