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

export interface TablePermission {
  tableName: string
  permission: '読み取り' | '読み取り/書き込み'
}

export interface SampleUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  avatarSrc?: string
  tablePermissions: TablePermission[]
}

/** Mock data for sample-app/screen-patterns/ only — not part of the published package (Question 2 = A). */
export const initialSampleUsers: SampleUser[] = [
  {
    id: '1',
    name: '山田 太郎',
    email: 'yamada@example.com',
    role: 'admin',
    tablePermissions: [
      { tableName: 'users', permission: '読み取り/書き込み' },
      { tableName: 'orders', permission: '読み取り/書き込み' },
    ],
  },
  {
    id: '2',
    name: '鈴木 花子',
    email: 'suzuki@example.com',
    role: 'member',
    tablePermissions: [{ tableName: 'orders', permission: '読み取り' }],
  },
  {
    id: '3',
    name: '佐藤 次郎',
    email: 'sato@example.com',
    role: 'member',
    tablePermissions: [{ tableName: 'users', permission: '読み取り/書き込み' }],
  },
  {
    id: '4',
    name: '田中 美咲',
    email: 'tanaka@example.com',
    role: 'member',
    tablePermissions: [],
  },
  {
    id: '5',
    name: '高橋 健',
    email: 'takahashi@example.com',
    role: 'admin',
    tablePermissions: [{ tableName: 'orders', permission: '読み取り/書き込み' }],
  },
]
