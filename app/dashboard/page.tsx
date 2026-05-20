"use client"

import Link from "next/link"
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Check,
  ChevronRight,
  Award,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const stats = [
  {
    label: "해결한 문제",
    value: "47",
    icon: Check,
    change: "이번 주 +5",
  },
  {
    label: "연속 학습",
    value: "12",
    icon: Flame,
    change: "일",
  },
  {
    label: "정답률",
    value: "68%",
    icon: Target,
    change: "지난 달 대비 +3%",
  },
  {
    label: "전체 순위",
    value: "#1,247",
    icon: TrendingUp,
    change: "상위 15%",
  },
]

const progressData = [
  { category: "데이터 전처리", solved: 18, total: 24, fill: "var(--color-chart-2)" },
  { category: "모델 아키텍처", solved: 12, total: 31, fill: "var(--color-chart-1)" },
  { category: "손실 함수", solved: 8, total: 18, fill: "var(--color-chart-3)" },
  { category: "학습 루프", solved: 6, total: 22, fill: "var(--color-chart-5)" },
  { category: "평가", solved: 3, total: 15, fill: "var(--color-chart-4)" },
]

const chartConfig = {
  solved: {
    label: "해결",
    color: "var(--color-primary)",
  },
}

const recentActivity = [
  {
    id: 1,
    title: "배치 정규화 구현하기",
    difficulty: "보통",
    date: "오늘",
    status: "해결",
  },
  {
    id: 2,
    title: "커스텀 데이터로더 구축",
    difficulty: "보통",
    date: "어제",
    status: "해결",
  },
  {
    id: 3,
    title: "정밀도, 재현율, F1 점수 계산",
    difficulty: "쉬움",
    date: "2일 전",
    status: "해결",
  },
  {
    id: 4,
    title: "미니배치 경사 하강법",
    difficulty: "보통",
    date: "3일 전",
    status: "시도함",
  },
  {
    id: 5,
    title: "데이터 증강 파이프라인 구축",
    difficulty: "쉬움",
    date: "4일 전",
    status: "해결",
  },
]

const recommendedProblems = [
  {
    id: 1,
    title: "드롭아웃 레이어 구현",
    category: "모델 아키텍처",
    difficulty: "보통",
  },
  {
    id: 2,
    title: "커스텀 크로스 엔트로피 손실 함수 작성",
    category: "손실 함수",
    difficulty: "어려움",
  },
  {
    id: 3,
    title: "Adam 옵티마이저 구현",
    category: "학습 루프",
    difficulty: "어려움",
  },
]

const difficultyColors: Record<string, string> = {
  쉬움: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  보통: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  어려움: "bg-rose-500/20 text-rose-400 border-rose-500/30",
}

const categoryColors: Record<string, string> = {
  "모델 아키텍처": "bg-primary/20 text-primary border-primary/30",
  "손실 함수": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "학습 루프": "bg-rose-500/20 text-rose-400 border-rose-500/30",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Profile Section */}
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>김</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">김개발</h1>
                <Badge className="gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Award className="h-3 w-3" />
                  ML 엔지니어 Lv.3
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                47개 문제 해결 · 2024년 1월 가입
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/60 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Progress Chart */}
            <Card className="border-border/60 bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle>카테고리별 진행률</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={progressData}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="category"
                        axisLine={false}
                        tickLine={false}
                        width={90}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <ChartTooltip
                        cursor={{ fill: "var(--color-muted)", opacity: 0.1 }}
                        content={
                          <ChartTooltipContent
                            formatter={(value, name, props) => {
                              const item = props.payload
                              return (
                                <span>
                                  {item.solved} / {item.total} 해결
                                </span>
                              )
                            }}
                          />
                        }
                      />
                      <Bar
                        dataKey="solved"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recommended Problems */}
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  추천 문제
                  <Trophy className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="group block rounded-lg border border-border/60 bg-secondary/30 p-4 transition-colors hover:border-primary/40"
                  >
                    <h4 className="font-medium group-hover:text-primary">
                      {problem.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${categoryColors[problem.category]}`}
                      >
                        {problem.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${difficultyColors[problem.difficulty]}`}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8 border-border/60 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                최근 활동
                <Link
                  href="/problems"
                  className="flex items-center gap-1 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                >
                  전체 보기
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">문제</th>
                      <th className="pb-3 font-medium">난이도</th>
                      <th className="pb-3 font-medium">날짜</th>
                      <th className="pb-3 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="group">
                        <td className="py-4">
                          <Link
                            href={`/problems/${activity.id}`}
                            className="font-medium transition-colors group-hover:text-primary"
                          >
                            {activity.title}
                          </Link>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${difficultyColors[activity.difficulty]}`}
                          >
                            {activity.difficulty}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {activity.date}
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-sm ${
                              activity.status === "해결"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
