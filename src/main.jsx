import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'

import './index.css'
import App from './App'

import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

import '@/utils'

ReactDOM.render(
  <ReduxProvider>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
)
