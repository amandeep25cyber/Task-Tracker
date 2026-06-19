import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./features/authSlice.js"
import organisationSlice from "./features/orgSlice.js"

export const store = configureStore({
  reducer: {
    auth:authSlice,
    organisation:organisationSlice
  },
})