import React, { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";

import { ConfigProvider } from "antd";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import BackLayout from "@/layout";

import zhCN from "antd/es/locale/zh_CN";

import { store, persistor } from "@/store";
import '@/assets/css/public.less'

const App = () => {
  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider locale={zhCN}>
            <BrowserRouter>
              <BackLayout />
            </BrowserRouter>
          </ConfigProvider>
        </PersistGate>
      </ReduxProvider>
    </StrictMode>
  );
};

export default App;
