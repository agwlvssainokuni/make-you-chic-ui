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
import { TextInput } from '../TextInput';

export interface CellEditComponentProps<V> {
  value: V;
  onCommit: (value: V) => void;
  onCancel: () => void;
}

/**
 * Default inline editor used when a column is `editable` but does not
 * specify a custom `editComponent` (business-rules.md: text-only, caller
 * converts on commit).
 */
export function DefaultCellEditor({
  value,
  onCommit,
  onCancel,
}: CellEditComponentProps<unknown>): React.JSX.Element {
  const [draft, setDraft] = useState(value == null ? '' : String(value));

  return (
    <TextInput
      autoFocus
      value={draft}
      onChange={setDraft}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onCommit(draft);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={() => onCommit(draft)}
      data-testid="table-cell-editor"
    />
  );
}
