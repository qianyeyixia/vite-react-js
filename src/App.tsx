import React, { StrictMode, FC } from "react";

import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import BackLayout from "@/layout";


import { store, persistor } from "@/store";
import '@/assets/css/public.less';

import { SyncRouter } from '@/router'

const App:FC = () => {
  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SyncRouter/>
        </PersistGate>
        </ReduxProvider>
    </StrictMode>
  );
};

export default App;
