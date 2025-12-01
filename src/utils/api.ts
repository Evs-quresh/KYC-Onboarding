import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 6000,
})

api.interceptors.request.use((config) => {
  // Attach auth token placeholder
  config.headers.Authorization = 'Bearer sandbox-token'
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', error)
    return Promise.reject(error)
  },
)

