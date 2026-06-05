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
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FlaskConical, Trash2 } from "lucide-react"
import {
  users as usersApi,
  problems as problemsApi,
  experiments as experimentsApi,
  UserStats,
  Submission,
  Problem,
  Difficulty,
  Experiment,
} from "@/lib/api"

const DIFFICULTY_META: Record<Difficulty, { label: string; className: string }> = {
  EASY: { label: "초급", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  MEDIUM: { label: "중급", className: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  HARD: { label: "고급", className: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
}

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
  const [recommendations, setRecommendations] = useState<Problem[]>([])
  const [problemMap, setProblemMap] = useState<Record<number, string>>({})
  const [experimentList, setExperimentList] = useState<Experiment[]>([])
  const [expForm, setExpForm] = useState({ title: "", params: "", metrics: "" })
  const [dataLoading, setDataLoading] = useState(true)

  const addExperiment = async () => {
    if (!user || !expForm.title.trim()) return
    const created = await experimentsApi.create({
      title: expForm.title,
      params: expForm.params,
      metrics: expForm.metrics,
    })
    setExperimentList((prev) => [created, ...prev])
    setExpForm({ title: "", params: "", metrics: "" })
  }

  const removeExperiment = async (id: number) => {
    await experimentsApi.remove(id)
    setExperimentList((prev) => prev.filter((e) => e.experimentId !== id))
  }

  // 비로그인 시 로그인 페이지로
  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([
      usersApi.getStats(),
      usersApi.getSubmissions(),
      problemsApi.getRecommendations(3).catch(() => [] as Problem[]),
      experimentsApi.list().catch(() => [] as Experiment[]),
    ])
      .then(([s, subs, recs, exps]) => {
        setStats(s)
        const recent = subs.slice(0, 10)
        setRecentSubmissions(recent)
        setRecommendations(recs)
        setExperimentList(exps)
        // 제출 이력에 등장하는 문제 ID의 제목을 일괄 조회
        const ids = [...new Set(recent.map((sub) => sub.problemId))]
        Promise.all(ids.map((id) => problemsApi.getById(id).catch(() => null)))
          .then((probs) => {
            const map: Record<number, string> = {}
            probs.forEach((p) => { if (p) map[p.problemId] = p.title })
            setProblemMap(map)
          })
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

          {/* 추천 문제 (FR-26) */}
          {recommendations.length > 0 && (
            <Card className="mb-8 border-border/60 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  추천 문제
                  <span className="text-sm font-normal text-muted-foreground">아직 풀지 않은 문제예요</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {recommendations.map((p) => (
                    <Link
                      key={p.problemId}
                      href={`/problems/${p.problemId}`}
                      className="rounded-lg border border-border/60 bg-secondary/20 p-4 transition-colors hover:bg-secondary/40"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        {p.difficulty && (
                          <Badge variant="outline" className={`text-xs ${DIFFICULTY_META[p.difficulty]?.className ?? ""}`}>
                            {DIFFICULTY_META[p.difficulty]?.label ?? p.difficulty}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="font-medium">{p.title}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                        <th className="pb-3 font-medium">문제</th>
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
                              {problemMap[sub.problemId] ?? `#${sub.problemId}`}
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
          {/* 실험 기록 (FR-30) */}
          <Card className="mt-8 border-border/60 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                실험 기록
                <span className="text-sm font-normal text-muted-foreground">하이퍼파라미터·지표를 남겨 성장을 추적하세요</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 추가 폼 */}
              <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input
                  placeholder="제목 (예: lr 튜닝)"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                />
                <Input
                  placeholder='파라미터 {"lr":0.01}'
                  value={expForm.params}
                  onChange={(e) => setExpForm({ ...expForm, params: e.target.value })}
                />
                <Input
                  placeholder='지표 {"acc":0.93}'
                  value={expForm.metrics}
                  onChange={(e) => setExpForm({ ...expForm, metrics: e.target.value })}
                />
                <Button onClick={addExperiment} disabled={!expForm.title.trim()}>
                  기록 추가
                </Button>
              </div>

              {experimentList.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  아직 실험 기록이 없습니다.
                </p>
              ) : (
                <div className="divide-y divide-border/40">
                  {experimentList.map((exp) => (
                    <div key={exp.experimentId} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">{exp.title ?? "(제목 없음)"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[exp.params, exp.metrics].filter(Boolean).join("  ·  ") || "-"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeExperiment(exp.experimentId)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-rose-400"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
