import axios from 'axios'
import { parseCookies } from 'nookies'

export function getApiClient(ctx?: any) {
  const { 'memeli.token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'https://jm-joias.rmsolucoestecnologicas.com.br/'
  })

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return api
}
