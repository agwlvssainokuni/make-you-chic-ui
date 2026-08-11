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
import { useState } from 'react';
import { Modal, FormField, TextInput, Select, Button } from '../../src';
import type { SampleUser } from '../data/sampleUsers';

export interface EditUserFormValues {
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface EditUserModalProps {
  mode: 'create' | 'edit';
  user?: SampleUser;
  open: boolean;
  onClose: () => void;
  onSave: (values: EditUserFormValues) => void;
}

const ROLE_OPTIONS = [
  { label: '管理者', value: 'admin' },
  { label: '一般ユーザー', value: 'member' },
];

function resolveInitialValues(mode: 'create' | 'edit', user?: SampleUser): EditUserFormValues {
  if (mode === 'edit' && user) {
    return { name: user.name, email: user.email, role: user.role };
  }
  return { name: '', email: '', role: 'member' };
}

/** New-user / edit-user form, sharing one Modal (Functional Design: business-rules.md). */
export function EditUserModal({ mode, user, open, onClose, onSave }: EditUserModalProps): React.JSX.Element {
  const [values, setValues] = useState<EditUserFormValues>(() => resolveInitialValues(mode, user));

  const isValid = values.name.trim() !== '' && values.email.trim() !== '';

  function handleSave(): void {
    if (!isValid) return;
    onSave(values);
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'create' ? 'ユーザーを新規作成' : 'ユーザーを編集'}>
      <FormField label="名前" required>
        <TextInput
          value={values.name}
          onChange={(name) => setValues((prev) => ({ ...prev, name }))}
          data-testid="edit-user-name"
        />
      </FormField>
      <FormField label="メールアドレス" required>
        <TextInput
          value={values.email}
          onChange={(email) => setValues((prev) => ({ ...prev, email }))}
          data-testid="edit-user-email"
        />
      </FormField>
      <FormField label="役割">
        <Select
          options={ROLE_OPTIONS}
          value={values.role}
          onChange={(role) => setValues((prev) => ({ ...prev, role: role as 'admin' | 'member' }))}
          data-testid="edit-user-role"
        />
      </FormField>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isValid} data-testid="edit-user-save">
          保存
        </Button>
      </div>
    </Modal>
  );
}
