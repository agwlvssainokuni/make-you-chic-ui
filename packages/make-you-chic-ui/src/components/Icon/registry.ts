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
import type { SVGProps } from 'react'
import { MenuIconSvg } from './icons/menu'
import { ChevronDownIconSvg } from './icons/chevron-down'
import { ChevronUpIconSvg } from './icons/chevron-up'
import { CloseIconSvg } from './icons/close'
import { CheckIconSvg } from './icons/check'
import { BellIconSvg } from './icons/bell'
import { UserIconSvg } from './icons/user'
import { SearchIconSvg } from './icons/search'
import { EditIconSvg } from './icons/edit'
import { TrashIconSvg } from './icons/trash'
import { DownloadIconSvg } from './icons/download'
import { SettingsIconSvg } from './icons/settings'
import { HomeIconSvg } from './icons/home'
import { ListIconSvg } from './icons/list'
import { InfoIconSvg } from './icons/info'
import { SuccessIconSvg } from './icons/success'
import { WarningIconSvg } from './icons/warning'
import { DangerIconSvg } from './icons/danger'

/**
 * Name → SVG component registry (Application Design Question 2 = B).
 * Add new entries here as later units require additional icons
 * (business-rules.md: kebab-case naming).
 */
export const iconRegistry = {
  menu: MenuIconSvg,
  'chevron-down': ChevronDownIconSvg,
  'chevron-up': ChevronUpIconSvg,
  close: CloseIconSvg,
  check: CheckIconSvg,
  bell: BellIconSvg,
  user: UserIconSvg,
  search: SearchIconSvg,
  edit: EditIconSvg,
  trash: TrashIconSvg,
  download: DownloadIconSvg,
  settings: SettingsIconSvg,
  home: HomeIconSvg,
  list: ListIconSvg,
  info: InfoIconSvg,
  success: SuccessIconSvg,
  warning: WarningIconSvg,
  danger: DangerIconSvg,
} satisfies Record<string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element>

export type IconName = keyof typeof iconRegistry
