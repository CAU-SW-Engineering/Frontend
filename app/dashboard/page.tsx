"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Trophy,
  Target,
  TrendingUp,
  Check,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { users as usersApi, UserStats, Submission } from "@/lib/api"

const STATUS_LABEL: Record<string, string> = {
  ACCEPTED: "정답",
  WRONG_ANSWER: "오답",
  PENDING: "대기중",
  JUDGING: "채점중",
  RUNTIME_ERROR: "런타임 에러",
  TIME_LIMIT: "시간 초과",
  MEMORY_LIMIT: "메모리 초과",
  COMPILE_ERROR: "컴파일 에러",
  SYSTEM_ERROR: "시스템 오류",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return "방금 전"
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // 비로그인 시 로그인 페이지로
  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([usersApi.getStats(), usersApi.getSubmissions()])
      .then(([s, subs]) => {
        setStats(s)
        setRecentSubmissions(subs.slice(0, 10))
      })
      .finally(() => setDataLoading(false))
  }, [user])

  if (loading || !user) return null

  const statCards = [
    {
      label: "해결한 문제",
      value: stats?.solvedCount ?? "-",
      icon: Check,
      sub: stats ? `시도 ${stats.attemptedCount}회` : "",
    },
    {
      label: "정답률",
      value: stats ? `${stats.accuracy.toFixed(1)}%` : "-",
      icon: Target,
      sub: stats ? `오답 ${stats.wrongCount}회` : "",
    },
    {
      label: "총 제출",
      value: stats?.attemptedCount ?? "-",
      icon: TrendingUp,
      sub: "",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Profile Section */}
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="mt-1 text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.label} className="border-border/60 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold">
                        {dataLoading ? "..." : stat.value}
                      </p>
                      {stat.sub && (
                        <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
                      )}
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Submissions */}
          <Card className="border-border/60 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                최근 제출
                <Link
                  href="/problems"
                  className="flex items-center gap-1 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                >
                  문제 풀기
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">불러오는 중...</p>
              ) : recentSubmissions.length === 0 ? (
                <div className="py-12 text-center">
                  <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">아직 제출 이력이 없습니다.</p>
                  <Link href="/problems" className="mt-3 inline-block text-sm text-primary hover:underline">
                    문제 풀러 가기
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">문제 ID</th>
                        <th className="pb-3 font-medium">언어</th>
                        <th className="pb-3 font-medium">상태</th>
                        <th className="pb-3 font-medium">점수</th>
                        <th className="pb-3 font-medium">제출 시각</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {recentSubmissions.map((sub) => (
                        <tr key={sub.submissionId} className="group">
                          <td className="py-4">
                            <Link
                              href={`/problems/${sub.problemId}`}
                              className="font-medium transition-colors group-hover:text-primary"
                            >
                              #{sub.problemId}
                            </Link>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="text-xs">
                              {sub.language}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <span
                              className={
                                sub.status === "ACCEPTED"
                                  ? "text-sm text-emerald-400"
                                  : sub.status === "PENDING" || sub.status === "JUDGING"
                                  ? "text-sm text-amber-400"
                                  : "text-sm text-rose-400"
                              }
                            >
                              {STATUS_LABEL[sub.status] ?? sub.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {sub.score !== null ? `${sub.score}점` : "-"}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {formatDate(sub.submittedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
