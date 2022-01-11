import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/api'
import { parseCookies, setCookie } from 'nookies'
import { useRouter } from 'next/router'

type User = {
  id?: string
  name: string
  email: string
}

type AuthProps = {
  children?: ReactNode
}

type SignInData = {
  email: string
  password: string
}

type SignInProps = {
  token: string
  user: User
  data: {
    token: string
    user: User
  }
  message: string
  errors: string[]
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProps) {
  const router = useRouter()

  const [user, setUser] = useState<User>({} as User)

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'memeli.token': token } = parseCookies()

    if (token && router.route !== '/') {
      api.post('/api/user', { token }).then(response => {
        setUser(response.data.data)
        router.push('/painel')
      })
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const { data }: SignInProps = await api.post('/api/login', {
      email,
      password
    })

    setCookie(undefined, 'memeli.token', data.token, {
      maxAge: 30 * 24 * 60 * 60
    })

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    setUser(data.user)
    router.push('/painel')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
