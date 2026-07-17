import { Alert, Button, Card, Col, Flex, Row, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { LeadRecord, VisitRecord } from '../../../shared/analytics-types'
import { useLeadAlerts } from '../context/LeadAlertsContext'

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <Card>
      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
        {label}
      </Typography.Text>
      <Typography.Title level={2} style={{ margin: '4px 0 0', color: accent ?? '#102d50' }}>
        {value}
      </Typography.Title>
    </Card>
  )
}

function deviceLabel(device: string) {
  const map: Record<string, string> = {
    mobile: 'Мобильный',
    tablet: 'Планшет',
    desktop: 'Компьютер',
    unknown: 'Другое',
  }
  return map[device] ?? device
}

function referrerHost(referrer: string) {
  if (!referrer) return 'Прямой'
  try {
    return new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    return 'Прямой'
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function RankList({ title, items, empty }: { title: string; items: { label: string; count: number }[]; empty?: string }) {
  return (
    <Card title={title} style={{ height: '100%' }}>
      {items.length === 0 ? (
        <Typography.Text type="secondary">{empty ?? 'Нет данных'}</Typography.Text>
      ) : (
        <Flex vertical gap={8}>
          {items.map((item) => (
            <Flex key={item.label} justify="space-between" gap={12}>
              <Typography.Text type="secondary" ellipsis style={{ flex: 1 }}>
                {item.label}
              </Typography.Text>
              <Typography.Text strong>{item.count}</Typography.Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Card>
  )
}

export function Dashboard() {
  const { data, loading, error, refresh, markLeadRead } = useLeadAlerts()

  if (loading && !data) {
    return <Typography.Text type="secondary">Загрузка дашборда…</Typography.Text>
  }

  if (error && !data) {
    return (
      <Alert
        type="error"
        message={error}
        action={
          <Button size="small" onClick={() => void refresh()}>
            Повторить
          </Button>
        }
        showIcon
      />
    )
  }

  if (!data) return null

  const { stats, recentVisits, recentLeads, meta } = data

  const leadColumns: ColumnsType<LeadRecord> = [
    { title: 'Дата', dataIndex: 'at', render: (v) => formatDate(v), width: 140 },
    { title: 'Имя', dataIndex: 'name', render: (v) => <Typography.Text strong>{v}</Typography.Text> },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      render: (v) => (
        <a href={`tel:${String(v).replace(/\D/g, '')}`} style={{ color: '#0875e1' }}>
          {v}
        </a>
      ),
    },
    { title: 'Email', dataIndex: 'email', render: (v) => v || '—' },
    {
      title: 'Устройство',
      key: 'device',
      render: (_, lead) => (
        <>
          {deviceLabel(lead.device)}
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {lead.browser} · {lead.os}
          </Typography.Text>
        </>
      ),
    },
    {
      title: 'Источник',
      dataIndex: 'referrer',
      ellipsis: true,
      render: (v) => referrerHost(String(v)),
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, lead) =>
        lead.status === 'new' ? (
          <Button
            type="primary"
            size="small"
            ghost
            onClick={() => {
              void markLeadRead(lead).catch(() => undefined)
            }}
          >
            Новая
          </Button>
        ) : (
          <Tag>Прочитана</Tag>
        ),
    },
  ]

  const visitColumns: ColumnsType<VisitRecord> = [
    { title: 'Дата', dataIndex: 'at', render: (v) => formatDate(v), width: 140 },
    { title: 'IP', dataIndex: 'ip', render: (v) => <Typography.Text code>{v}</Typography.Text> },
    { title: 'Откуда', dataIndex: 'referrerHost' },
    { title: 'Устройство', dataIndex: 'device', render: (v) => deviceLabel(v) },
    { title: 'Браузер', dataIndex: 'browser' },
    { title: 'ОС', dataIndex: 'os' },
    { title: 'Язык', dataIndex: 'language', render: (v) => v || '—' },
  ]

  return (
    <Flex vertical gap={24}>
      {meta?.storage === 'json' && (
        <Alert
          type="warning"
          showIcon
          message="PostgreSQL недоступна"
          description="Статистика сохраняется во временные JSON-файлы. Проверьте docker compose и DATABASE_URL в .env."
        />
      )}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Typography.Text type="secondary">Заявки обновляются каждые 5 секунд</Typography.Text>
        <Button onClick={() => void refresh()} loading={loading}>
          Обновить
        </Button>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Визиты сегодня" value={stats.visitsToday} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Визиты за неделю" value={stats.visitsWeek} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Заявки сегодня" value={stats.leadsToday} accent="#0875e1" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard label="Новые заявки" value={stats.leadsNew} accent="#0d9488" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <RankList
            title="Устройства"
            items={Object.entries(stats.devices).map(([device, count]) => ({
              label: deviceLabel(device),
              count,
            }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <RankList
            title="Источники"
            items={stats.topReferrers.map((item) => ({ label: item.source, count: item.count }))}
          />
        </Col>
        <Col xs={24} md={8}>
          <RankList
            title="Браузеры"
            items={stats.topBrowsers.map((item) => ({ label: item.name, count: item.count }))}
          />
        </Col>
      </Row>

      <Card
        title="Заявки"
        extra={<Typography.Text type="secondary">Всего: {stats.leadsTotal}</Typography.Text>}
      >
        <Table
          rowKey="id"
          size="small"
          columns={leadColumns}
          dataSource={recentLeads}
          pagination={false}
          scroll={{ x: 720 }}
          locale={{ emptyText: 'Заявок пока нет' }}
          rowClassName={(record) => (record.status === 'new' ? 'admin-row-new' : '')}
        />
      </Card>

      <Card
        title="Последние визиты"
        extra={<Typography.Text type="secondary">Всего: {stats.visitsTotal}</Typography.Text>}
      >
        <Table
          rowKey="id"
          size="small"
          columns={visitColumns}
          dataSource={recentVisits}
          pagination={false}
          scroll={{ x: 800 }}
          locale={{ emptyText: 'Визитов пока нет' }}
        />
      </Card>
    </Flex>
  )
}
