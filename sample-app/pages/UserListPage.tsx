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
import { useNavigate } from 'react-router'
import { ListView } from '../screen-patterns/ListView/ListView'

/** Wraps ListView with router-based navigation to the detail page (Unit 9). */
export function UserListPage(): React.JSX.Element {
  const navigate = useNavigate()
  return (
    <div>
      <h1>ユーザー管理</h1>
      <ListView onViewUser={(user) => navigate(`/users/${user.id}`)} />
    </div>
  )
}
