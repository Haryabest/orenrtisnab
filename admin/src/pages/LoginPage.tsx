import { Alert, Button, Card, Flex, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { api } from '../api'

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.login(username, password)
      onSuccess()
    } catch {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: 16, background: '#f1f5f9' }}>
      <Card style={{ width: '100%', maxWidth: 400, borderRadius: 16 }} styles={{ body: { padding: 32 } }}>
        <Typography.Title level={3} style={{ marginTop: 0, color: '#102d50' }}>
          Админ-панель
        </Typography.Title>
        <Typography.Text type="secondary">ОРЕНРТИСНАБ</Typography.Text>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <Flex vertical gap={16}>
            <Form.Item label="Логин" style={{ marginBottom: 0 }}>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} size="large" />
            </Form.Item>
            <Form.Item label="Пароль" style={{ marginBottom: 0 }}>
              <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} size="large" />
            </Form.Item>
            {error && <Alert type="error" message={error} showIcon />}
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Войти
            </Button>
          </Flex>
        </form>
      </Card>
    </Flex>
  )
}
