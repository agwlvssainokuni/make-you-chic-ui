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
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router'
import { AppShell, type AppShellNavItem } from 'make-you-chic-ui'
import { LoginPage } from './pages/LoginPage'
import { CatalogPage } from './pages/CatalogPage'
import { UserListPage } from './pages/UserListPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { ThemeSettingsPage } from './pages/ThemeSettingsPage'

/**
 * Layout route (react-router "pathless route" pattern): wraps its nested
 * child routes in AppShell via <Outlet/>. Routes outside this route (e.g.
 * /login) render without AppShell's Sidebar/Topbar, since useNavigate() is
 * only callable from inside <Routes>, the navItems/go() logic that used to
 * live in App() lives here instead.
 */
function AppShellLayout(): React.JSX.Element {
  const navigate = useNavigate()

  function go(path: string): (event: React.MouseEvent) => void {
    return (event) => {
      event.preventDefault()
      navigate(path)
    }
  }

  const navItems: AppShellNavItem[] = [
    { label: 'カタログ', icon: 'list', href: '/catalog', onClick: go('/catalog') },
    { label: 'ユーザー管理', icon: 'user', href: '/users', onClick: go('/users') },
    { label: 'テーマ設定', icon: 'settings', href: '/theme', onClick: go('/theme') },
  ]

  return (
    <AppShell
      navItems={navItems}
      user={{ name: 'サンプル太郎' }}
      userMenuItems={[{ label: 'ログアウト', onClick: () => navigate('/login') }]}
    >
      <Outlet />
    </AppShell>
  )
}

/**
 * Sample application root (Unit 9, FR9): demonstrates the design system
 * wired into a real, running app — AppShell as the layout, react-router for
 * SPA navigation between the component catalog, the users list/detail
 * screen-pattern flow, and the theme settings panel. /login sits outside
 * AppShellLayout, demonstrating a route with its own, independent layout.
 */
export function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/theme" element={<ThemeSettingsPage />} />
      </Route>
    </Routes>
  )
}
