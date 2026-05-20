"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Github, Mail } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
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

      {/* 메인 */}
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
              {/* 소셜 로그인 */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              {/* 이메일 폼 */}
              <form className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">이름</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary border-border"
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
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">비밀번호</Label>
                    {isLogin && (
                      <Link href="#" className="text-xs text-primary hover:underline">
                        비밀번호 찾기
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {isLogin ? "로그인" : "가입하기"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "계정이 없으신가요? " : "이미 계정이 있으신가요? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "회원가입" : "로그인"}
                </button>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            가입 시{" "}
            <Link href="#" className="text-primary hover:underline">이용약관</Link>
            {" "}및{" "}
            <Link href="#" className="text-primary hover:underline">개인정보처리방침</Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </div>
  )
}
