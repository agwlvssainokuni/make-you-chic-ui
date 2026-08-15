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
import { FormField, RadioGroup, useTheme } from 'make-you-chic-ui'

/** Live theme-axis switcher panel, demonstrating useTheme() (Unit 9). */
export function ThemeSettingsPage(): React.JSX.Element {
  const { theme, brand, fontFamily, fontSize, setTheme, setBrand, setFontFamily, setFontSize } =
    useTheme()

  return (
    <div>
      <h1>テーマ設定</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
        <FormField label="テーマ">
          <RadioGroup
            name="theme-settings-theme"
            value={theme}
            onChange={(v) => setTheme(v as typeof theme)}
            options={[
              { label: 'ライト', value: 'light' },
              { label: 'ダーク', value: 'dark' },
            ]}
          />
        </FormField>
        <FormField label="ブランドカラー">
          <RadioGroup
            name="theme-settings-brand"
            value={brand}
            onChange={(v) => setBrand(v as typeof brand)}
            options={[
              { label: 'ブルー', value: 'blue' },
              { label: 'グリーン', value: 'green' },
              { label: 'パープル', value: 'purple' },
              { label: 'オレンジ', value: 'orange' },
            ]}
          />
        </FormField>
        <FormField label="フォント">
          <RadioGroup
            name="theme-settings-font-family"
            value={fontFamily}
            onChange={(v) => setFontFamily(v as typeof fontFamily)}
            options={[
              { label: 'ゴシック', value: 'sans' },
              { label: '明朝', value: 'serif' },
            ]}
          />
        </FormField>
        <FormField label="文字サイズ">
          <RadioGroup
            name="theme-settings-font-size"
            value={fontSize}
            onChange={(v) => setFontSize(v as typeof fontSize)}
            options={[
              { label: '小', value: 'sm' },
              { label: '中', value: 'md' },
              { label: '大', value: 'lg' },
            ]}
          />
        </FormField>
      </div>
    </div>
  )
}
