import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Vos reducers ici
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
