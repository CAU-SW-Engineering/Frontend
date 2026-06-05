"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { auth, AuthResponse, UserResponse } from "./api"

interface AuthState {
  user: UserResponse | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  const saveAuth = (res: AuthResponse) => {
    localStorage.setItem("token", res.token)
    localStorage.setItem("userId", String(res.userId))
    setState({ user: { userId: res.userId, username: res.username, email: res.email }, loading: false })
  }

  // 새로고침 시 토큰으로 세션 복원
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setState({ user: null, loading: false })
      return
    }
    auth.me()
      .then((user) => setState({ user, loading: false }))
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setState({ user: null, loading: false })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await auth.login(email, password)
    saveAuth(res)
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await auth.register(username, email, password)
    saveAuth(res)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setState({ user: null, loading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
