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
 *
 * Single barrel export (Application Design Question 9 = A). New components
 * generated in later units are added here as they are built.
 */

// Theme
export { ThemeProvider } from './theme/ThemeProvider';
export { useTheme } from './theme/useTheme';
export type { ThemeContextValue, ThemeProviderProps } from './theme/ThemeProvider';
export type {
  ThemeState,
  ThemeMode,
  ThemeBrand,
  ThemeFontFamily,
  ThemeFontSize,
} from './theme/types';

// Icon
export { Icon } from './components/Icon';
export type { IconProps, IconName } from './components/Icon';

// Global stylesheets — consuming apps must import these once at the root
// (see docs/integration-guide.md, produced by Unit 8).
import './theme/tokens.css';
import './theme/semantic.css';
import './theme/fonts.css';
