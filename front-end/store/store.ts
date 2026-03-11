import { configureStore } from "@reduxjs/toolkit"
import permissionsReducer from "./permissionsSlice"

export const store = configureStore({
  reducer: {
    permissions: permissionsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch