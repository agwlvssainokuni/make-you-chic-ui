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
import './Card.css'
import { forwardRef } from 'react'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

/** Simple bordered/padded container for grouping related content (Functional Design Question 4 = A). */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={className ? `mycui-card ${className}` : 'mycui-card'}
      data-testid="card"
      {...rest}
    >
      {children}
    </div>
  )
})
