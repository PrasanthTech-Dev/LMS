import axios from 'axios'

/**
 * Central Axios instance — API integration ready.
 * Set VITE_API_BASE_URL and VITE_USE_MOCK=false to switch from dummy data to a real backend.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('lms_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    /* storage unavailable */
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem('lms_token')
      } catch {
        /* ignore */
      }
    }
    return Promise.reject(err)
  },
)

export const getErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) return (e.response?.data as { message?: string } | undefined)?.message ?? e.message
  if (e instanceof Error) return e.message
  return 'Something went wrong. Please try again.'
}
