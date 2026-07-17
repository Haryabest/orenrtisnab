import { Button, Card, Col, Flex, Form, Image, Input, Row, Select, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useRef } from 'react'

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  span?: number
  type?: string
}

export function Field({ label, value, onChange, multiline, span = 1, type = 'text' }: FieldProps) {
  const colSpan = span === 2 ? 24 : 12

  return (
    <Col xs={24} md={colSpan}>
      <Form.Item label={label} style={{ marginBottom: 0 }}>
        {multiline ? (
          <Input.TextArea value={value} onChange={(e) => onChange(e.target.value)} rows={3} autoSize={{ minRows: 3 }} />
        ) : (
          <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </Form.Item>
    </Col>
  )
}

type ImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onUpload: (file: File) => Promise<void>
}

export function ImageField({ label, value, onChange, onUpload }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Col span={24}>
      <Form.Item label={label} style={{ marginBottom: 0 }}>
        <Flex gap={12} wrap="wrap" align="flex-end">
          <Input value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <Button onClick={() => inputRef.current?.click()}>Загрузить</Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void onUpload(file)
              e.target.value = ''
            }}
          />
        </Flex>
        {value && (
          <div style={{ marginTop: 12 }}>
            <Image src={value} alt="" style={{ maxHeight: 120, objectFit: 'contain' }} />
          </div>
        )}
      </Form.Item>
    </Col>
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card title={<Typography.Text strong style={{ color: '#102d50' }}>{title}</Typography.Text>} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>{children}</Row>
    </Card>
  )
}

export function IconSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <Col xs={24} md={12}>
      <Form.Item label={label} style={{ marginBottom: 0 }}>
        <Select
          value={value}
          options={options.map((o) => ({ value: o, label: o }))}
          onChange={onChange}
          showSearch
        />
      </Form.Item>
    </Col>
  )
}

export function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Col span={24}>
      <Card
        size="small"
        style={{ background: '#f8fafc' }}
        title={
          <Typography.Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
            {title}
          </Typography.Text>
        }
      >
        <Row gutter={[16, 16]}>{children}</Row>
      </Card>
    </Col>
  )
}
