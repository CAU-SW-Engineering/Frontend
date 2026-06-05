"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const ERROR_MESSAGES: Record<number, string> = {
  400: "입력 형식이 올바르지 않습니다. (비밀번호 8자 이상, 이메일 형식 확인)",
  401: "이메일 또는 비밀번호가 일치하지 않습니다.",
  409: "이미 사용 중인 이메일 또는 사용자명입니다.",
}

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(username, email, password)
      }
      router.push("/dashboard")
    } catch (err: unknown) {
      const status = (err as { status?: number }).status
      setError(ERROR_MESSAGES[status ?? 0] ?? "서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.")
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MLCode</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                {isLogin ? "로그인" : "회원가입"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isLogin
                  ? "계정에 로그인하여 ML 문제를 풀어보세요"
                  : "새 계정을 만들고 ML 여정을 시작하세요"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">사용자명</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="홍길동"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary border-border"
                    required
                    minLength={8}
                  />
                </div>

                {error && (
                  <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "처리 중..." : isLogin ? "로그인" : "가입하기"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "계정이 없으신가요? " : "이미 계정이 있으신가요? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "회원가입" : "로그인"}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
