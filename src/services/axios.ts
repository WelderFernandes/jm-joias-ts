import axios from 'axios'
import { parseCookies } from 'nookies'

export function getApiClient(ctx?: any) {
  const { 'memeli.token': token } = parseCookies(ctx)

  const baseURL = 'http://jm-joias.rmsolucoestecnologicas.com.br'

  const api = axios.create({
    baseURL: baseURL
  })

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return api
}
