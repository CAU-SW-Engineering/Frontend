"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronDown, Layers } from "lucide-react"
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
import { problems as api, Category, Problem, Difficulty } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const DIFFICULTY_META: Record<Difficulty, { label: string; className: string }> = {
  EASY: { label: "초급", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  MEDIUM: { label: "중급", className: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  HARD: { label: "고급", className: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
}

export default function ProblemsPage() {
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [problemList, setProblemList] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null)

  // 카테고리 목록 로드
  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
  }, [])

  // 문제 목록 로드 (카테고리/난이도 변경 시 재요청)
  useEffect(() => {
    setLoading(true)
    setError(null)
    api.getList(selectedCategoryId ?? undefined, selectedDifficulty ?? undefined)
      .then(setProblemList)
      .catch(() => setError("문제 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [selectedCategoryId, selectedDifficulty])

  const filteredProblems = problemList.filter((p) =>
    !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 카테고리 이름 조회 헬퍼
  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.categoryId === categoryId)?.categoryName ?? `카테고리 ${categoryId}`

  const selectedCategoryName = selectedCategoryId
    ? getCategoryName(selectedCategoryId)
    : "전체"

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-card/50 lg:block">
          <div className="sticky top-16 p-4">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground">카테고리</h2>
            <nav className="space-y-1">
              {/* 전체 */}
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedCategoryId === null
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Layers className="h-4 w-4" />
                <span>전체</span>
              </button>

              {/* 최상위 카테고리 */}
              {categories
                .filter((c) => c.parentId === null)
                .map((parent) => (
                  <div key={parent.categoryId}>
                    <button
                      onClick={() => setSelectedCategoryId(parent.categoryId)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        selectedCategoryId === parent.categoryId
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span>{parent.categoryName}</span>
                    </button>
                    {/* 하위 카테고리 */}
                    {categories
                      .filter((c) => c.parentId === parent.categoryId)
                      .map((child) => (
                        <button
                          key={child.categoryId}
                          onClick={() => setSelectedCategoryId(child.categoryId)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 pl-8 text-sm transition-colors",
                            selectedCategoryId === child.categoryId
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span>{child.categoryName}</span>
                        </button>
                      ))}
                  </div>
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

              {/* 난이도 필터 (FR-28) */}
              <div className="flex gap-2">
                <Button
                  variant={selectedDifficulty === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(null)}
                >
                  전체
                </Button>
                {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
                  <Button
                    key={d}
                    variant={selectedDifficulty === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(d)}
                  >
                    {DIFFICULTY_META[d].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Category Filter */}
            <div className="mb-6 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedCategoryName}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => setSelectedCategoryId(null)}>
                    전체
                  </DropdownMenuItem>
                  {categories.map((c) => (
                    <DropdownMenuItem
                      key={c.categoryId}
                      onClick={() => setSelectedCategoryId(c.categoryId)}
                      className={c.parentId !== null ? "pl-6" : ""}
                    >
                      {c.categoryName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Problems Table */}
            {loading ? (
              <div className="py-20 text-center text-muted-foreground">불러오는 중...</div>
            ) : error ? (
              <div className="py-20 text-center text-rose-400">{error}</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                <div className="grid grid-cols-12 gap-4 border-b border-border/60 bg-secondary/30 px-4 py-3 text-sm font-medium text-muted-foreground">
                  {user && <div className="col-span-1">상태</div>}
                  <div className={cn(user ? "col-span-6" : "col-span-7")}>제목</div>
                  <div className="col-span-3">카테고리</div>
                  <div className="col-span-2 text-right">제한</div>
                </div>
                <div className="divide-y divide-border/40">
                  {filteredProblems.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      해당 조건의 문제가 없습니다.
                    </div>
                  ) : (
                    filteredProblems.map((problem) => (
                      <Link
                        key={problem.problemId}
                        href={`/problems/${problem.problemId}`}
                        className={cn(
                          "grid grid-cols-12 items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary/30",
                          selectedProblem === problem.problemId && "bg-secondary/50"
                        )}
                        onClick={() => setSelectedProblem(problem.problemId)}
                      >
                        {user && (
                          <div className="col-span-1">
                            <div className="h-5 w-5 rounded-full border border-border/60" />
                          </div>
                        )}
                        <div className={cn("flex items-center gap-2", user ? "col-span-6" : "col-span-7")}>
                          {problem.difficulty && (
                            <Badge
                              variant="outline"
                              className={cn("text-xs shrink-0", DIFFICULTY_META[problem.difficulty]?.className)}
                            >
                              {DIFFICULTY_META[problem.difficulty]?.label ?? problem.difficulty}
                            </Badge>
                          )}
                          <span className="font-medium">{problem.title}</span>
                        </div>
                        <div className="col-span-3">
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                            {getCategoryName(problem.categoryId)}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right text-xs text-muted-foreground">
                          {problem.timeLimitMs / 1000}s
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {!loading && !error && (
              <p className="mt-4 text-sm text-muted-foreground">
                총 {problemList.length}개 문제 중 {filteredProblems.length}개 표시
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
