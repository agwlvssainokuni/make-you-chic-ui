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
import './Avatar.css'
import { forwardRef, useEffect, useState } from 'react'

export interface AvatarProps {
  /** Image URL. When omitted or failing to load, initials derived from `name` are shown. */
  src?: string
  /** Person's name; source for initials and the image's alt text. */
  name: string
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

/** Computes up to 2 uppercase initials from the first two words of `name` (business-rules.md). */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/** Circular avatar: shows an image, falling back to initials on missing/broken `src`. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', className, style },
  ref,
) {
  const [imageError, setImageError] = useState(false)

  // Reset the error flag whenever the caller provides a new src.
  useEffect(() => {
    setImageError(false)
  }, [src])

  const classes = ['wds-avatar', `size-${size}`, className].filter(Boolean).join(' ')
  const showImage = Boolean(src) && !imageError

  return (
    <div
      ref={ref}
      className={classes}
      style={style}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : name}
      data-testid="avatar"
    >
      {showImage ? (
        <img
          className="wds-avatar-image"
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          data-testid="avatar-image"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  )
})
