import React, { StrictMode, FC } from "react";
import { BrowserRouter } from "react-router-dom"
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ConfigProvider } from 'antd'

import zhCN from 'antd/es/locale/zh_CN'
import { store, persistor } from "@/store";
import '@/assets/css/public.less';

import { SyncRouter } from '@/router'

const App: FC = () => {
  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider locale={zhCN}>
            <BrowserRouter>
              <SyncRouter />
            </BrowserRouter>
          </ConfigProvider>
        </PersistGate>
      </ReduxProvider>
    </StrictMode>
  );
};

export default App;
