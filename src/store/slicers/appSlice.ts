import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import {TagsViewDto} from "@/layout/tagsView/common";
export interface AppState {
  theme: "light" | "dark"
  collapsed: boolean // 菜单收纳状态, 用于垂直布局
  menuMode: 'horizontal' | 'vertical' // 菜单模式, 用于水平布局
  width: number,
  keepAliveList: TagsViewDto[]
}

const initialState:AppState = {
  collapsed: false,
  theme: 'dark',
  menuMode: 'horizontal',
  width: 200,
  keepAliveList: []
}

export const appSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
    },
    setCollapsed(state, action) {
      state.collapsed = action.payload
    },
    setMenuMode(state, action) {
      state.menuMode = action.payload
    },
    setWidth(state, action) {
      state.width = action.payload
    },
    setKeepAliveList(state, action) {
      state.keepAliveList = action.payload
    }
  }
})

export const { setCollapsed, setTheme, setMenuMode, setWidth, setKeepAliveList} = appSlice.actions

export const selectTheme = (state: RootState) => state.app.theme
export const selectCollapsed = (state: RootState) => state.app.collapsed
export const selectMenuMode = (state: RootState) => state.app.menuMode
export const selectKeepAliveList = (state: RootState) => state.app.keepAliveList

export default appSlice.reducer
