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
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, FormField, TextInput, Button } from 'make-you-chic-ui'
import './LoginPage.css'

/**
 * Standalone login screen, deliberately outside AppShell's layout — see
 * App.tsx's AppShellLayout for the react-router "layout route" pattern that
 * keeps this route unwrapped. No real authentication: any non-empty
 * email/password navigates to /catalog (Unit 9 follow-up).
 */
export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isValid = email.trim() !== '' && password.trim() !== ''

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault()
    if (!isValid) return
    navigate('/catalog')
  }

  return (
    <div className="sample-login-page">
      <Card className="sample-login-page__card">
        <h1>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <FormField label="メールアドレス" required>
            <TextInput type="email" value={email} onChange={setEmail} data-testid="login-email" />
          </FormField>
          <FormField label="パスワード" required>
            <TextInput
              type="password"
              value={password}
              onChange={setPassword}
              data-testid="login-password"
            />
          </FormField>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
            className="sample-login-page__submit"
            data-testid="login-submit"
          >
            ログイン
          </Button>
        </form>
      </Card>
    </div>
  )
}
