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
import { Navigate, useNavigate, useParams } from 'react-router'
import { DetailView } from '../screen-patterns/DetailView/DetailView'
import { initialSampleUsers } from '../screen-patterns/data/sampleUsers'

/**
 * Looks up the routed :id against the static sample dataset and renders
 * DetailView (Unit 9). Edits made in UserListPage's local state are not
 * reflected here — both pages independently read the same static sample
 * data, which is an accepted limitation for a reference/demo app.
 */
export function UserDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = initialSampleUsers.find((u) => u.id === id)

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return <DetailView user={user} onDelete={() => navigate('/users')} />
}
