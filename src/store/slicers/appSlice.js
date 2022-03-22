import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  collapsed: false,
  theme: 'dark'
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
    }
  }
})

export const { setCollapsed, setTheme } = appSlice.actions

export const selectTheme = (state) => state.app.theme
export const selectCollapsed = (state) => state.app.collapsed

export default appSlice.reducer
