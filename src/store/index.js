import {combineReducers} from "redux"
import { configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import promiseMiddleware from 'redux-promise'
import storage from 'redux-persist/lib/storage'

import tabReducer from '@/store/slicers/tabSlice'
import userReducer from '@/store/slicers/userSlice'
import appReducer from '@/store/slicers/appSlice'



const reducers = combineReducers({
  tab: tabReducer,
  user: userReducer,
  app: appReducer
})

const persistConfig = {
  key: 'root',
  storage
  // 以下是性能优化
  // whitelist = ['navigation']
  // blacklist = ['navigation']
}
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat([promiseMiddleware])
})

export const persistor = persistStore(store)
