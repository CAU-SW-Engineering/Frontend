"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Check,
  ChevronDown,
  Database,
  GitBranch,
  Zap,
  Code,
  BarChart3,
  RefreshCw,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "전체", icon: Layers, count: 110 },
  { id: "data-preprocessing", name: "데이터 전처리", icon: Database, count: 24 },
  { id: "model-architecture", name: "모델 아키텍처", icon: GitBranch, count: 31 },
  { id: "loss-functions", name: "손실 함수", icon: Zap, count: 18 },
  { id: "training-loop", name: "학습 루프", icon: Code, count: 22 },
  { id: "backpropagation", name: "역전파", icon: RefreshCw, count: 12 },
  { id: "evaluation", name: "평가", icon: BarChart3, count: 15 },
]

const problems = [
  {
    id: 1,
    title: "배치 정규화 구현하기",
    category: "모델 아키텍처",
    difficulty: "보통",
    acceptance: 45.2,
    solved: true,
  },
  {
    id: 2,
    title: "커스텀 크로스 엔트로피 손실 함수 작성",
    category: "손실 함수",
    difficulty: "어려움",
    acceptance: 32.1,
    solved: false,
  },
  {
    id: 3,
    title: "데이터 증강 파이프라인 구축",
    category: "데이터 전처리",
    difficulty: "쉬움",
    acceptance: 67.8,
    solved: true,
  },
  {
    id: 4,
    title: "역전파 알고리즘 직접 구현",
    category: "역전파",
    difficulty: "어려움",
    acceptance: 28.5,
    solved: false,
  },
  {
    id: 5,
    title: "미니배치 경사 하강법",
    category: "학습 루프",
    difficulty: "보통",
    acceptance: 52.3,
    solved: false,
  },
  {
    id: 6,
    title: "정밀도, 재현율, F1 점수 계산",
    category: "평가",
    difficulty: "쉬움",
    acceptance: 78.9,
    solved: true,
  },
  {
    id: 7,
    title: "드롭아웃 레이어 구현",
    category: "모델 아키텍처",
    difficulty: "보통",
    acceptance: 48.6,
    solved: false,
  },
  {
    id: 8,
    title: "커스텀 데이터로더 구축",
    category: "데이터 전처리",
    difficulty: "보통",
    acceptance: 44.1,
    solved: true,
  },
  {
    id: 9,
    title: "Adam 옵티마이저 구현",
    category: "학습 루프",
    difficulty: "어려움",
    acceptance: 35.7,
    solved: false,
  },
  {
    id: 10,
    title: "ROC-AUC 점수 계산기",
    category: "평가",
    difficulty: "보통",
    acceptance: 51.2,
    solved: false,
  },
]

const difficultyColors: Record<string, string> = {
  쉬움: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  보통: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  어려움: "bg-rose-500/20 text-rose-400 border-rose-500/30",
}

const categoryColors: Record<string, string> = {
  "데이터 전처리": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "모델 아키텍처": "bg-primary/20 text-primary border-primary/30",
  "손실 함수": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "학습 루프": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  역전파: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  평가: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null)

  const filteredProblems = problems.filter((problem) => {
    const categoryMap: Record<string, string> = {
      "데이터 전처리": "data-preprocessing",
      "모델 아키텍처": "model-architecture",
      "손실 함수": "loss-functions",
      "학습 루프": "training-loop",
      역전파: "backpropagation",
      평가: "evaluation",
    }
    const matchesCategory =
      selectedCategory === "all" ||
      categoryMap[problem.category] === selectedCategory
    const matchesDifficulty =
      !selectedDifficulty || problem.difficulty === selectedDifficulty
    const matchesSearch =
      !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-card/50 lg:block">
          <div className="sticky top-16 p-4">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
              카테고리
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-5xl">
            {/* Filters Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="문제 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {selectedDifficulty || "난이도"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedDifficulty(null)}>
                      전체
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedDifficulty("쉬움")}>
                      쉬움
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedDifficulty("보통")}>
                      보통
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedDifficulty("어려움")}>
                      어려움
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      정렬
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>정답률</DropdownMenuItem>
                    <DropdownMenuItem>난이도</DropdownMenuItem>
                    <DropdownMenuItem>제목</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Category Filter */}
            <div className="mb-6 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {categories.find((c) => c.id === selectedCategory)?.name || "전체"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Problems Table */}
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="grid grid-cols-12 gap-4 border-b border-border/60 bg-secondary/30 px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">상태</div>
                <div className="col-span-5">제목</div>
                <div className="col-span-2">카테고리</div>
                <div className="col-span-2">난이도</div>
                <div className="col-span-2 text-right">정답률</div>
              </div>
              <div className="divide-y divide-border/40">
                {filteredProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className={cn(
                      "grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary/30",
                      selectedProblem === problem.id && "bg-secondary/50"
                    )}
                    onClick={() => setSelectedProblem(problem.id)}
                  >
                    <div className="col-span-1">
                      {problem.solved ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-border/60" />
                      )}
                    </div>
                    <div className="col-span-5">
                      <span className="font-medium">{problem.title}</span>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", categoryColors[problem.category])}
                      >
                        {problem.category}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", difficultyColors[problem.difficulty])}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-right text-sm text-muted-foreground">
                      {problem.acceptance}%
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="mt-4 text-sm text-muted-foreground">
              총 {problems.length}개 문제 중 {filteredProblems.length}개 표시
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
