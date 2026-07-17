import 'antd/dist/reset.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import App from './App'
import { adminTheme } from './theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={adminTheme} locale={ruRU}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
