import axios from 'axios'
import { parseCookies } from 'nookies'

export function getApiClient(ctx?: any) {
  const { 'memeli.token': token } = parseCookies(ctx)

  // if (typeof window !== 'undefined') {
  // browser code
  let location = ''

  location = window.location.pathname

  const url =
    location != 'localhost'
      ? 'http://jm-joias.rmsolucoestecnologicas.com.br'
      : 'https://jm-joias.rmsolucoestecnologicas.com.br'

  const baseURL = 'https://jm-joias.rmsolucoestecnologicas.com.br'
  console.log(baseURL)
  const api = axios.create({
    baseURL: baseURL
  })
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return api
  // }
}
