import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { reducers } from './slices'

export const store = configureStore({ reducer: reducers })

// Persist the slices that should survive a refresh.
store.subscribe(() => {
  try {
    const s = store.getState()
    localStorage.setItem('lms_user', JSON.stringify(s.auth.user))
    localStorage.setItem('lms_token_state', JSON.stringify(s.auth.token))
    if (s.auth.token) localStorage.setItem('lms_token', s.auth.token)
    else localStorage.removeItem('lms_token')
    localStorage.setItem('lms_learning', JSON.stringify(s.learning))
    localStorage.setItem('lms_notifications', JSON.stringify(s.notifications))
    localStorage.setItem('lms_users', JSON.stringify(s.users))
  } catch {
    /* storage unavailable */
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
