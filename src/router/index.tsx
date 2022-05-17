import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { routes } from "@/router/configure";

import { map } from 'ramda'

import { ConfigProvider } from 'antd'

import zhCN from 'antd/es/locale/zh_CN'

import { SuspenseLoading } from '@/components/Loading'

// 创建 同步路由文件
export const SyncRouter = (): JSX.Element => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <SuspenseLoading>
          <Routes>
            {map(
              (route) => (
                <Route path={route.path} key={route.name} element={<route.component route={route} />} />
              ),
              routes
            )}
          </Routes>
        </SuspenseLoading>
      </BrowserRouter>
    </ConfigProvider>
  )
}
