"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Send,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { problems as problemsApi, submissions as submissionsApi, Problem, Submission, SubmissionStatus } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const FINAL_STATUSES: SubmissionStatus[] = [
  "ACCEPTED", "WRONG_ANSWER", "RUNTIME_ERROR",
  "TIME_LIMIT", "MEMORY_LIMIT", "COMPILE_ERROR", "SYSTEM_ERROR",
]

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "채점 대기 중",
  JUDGING: "채점 중",
  ACCEPTED: "정답",
  WRONG_ANSWER: "오답",
  RUNTIME_ERROR: "런타임 에러",
  TIME_LIMIT: "시간 초과",
  MEMORY_LIMIT: "메모리 초과",
  COMPILE_ERROR: "컴파일 에러",
  SYSTEM_ERROR: "시스템 오류",
}

const STATUS_COLOR: Record<SubmissionStatus, string> = {
  PENDING: "text-muted-foreground",
  JUDGING: "text-amber-400",
  ACCEPTED: "text-emerald-400",
  WRONG_ANSWER: "text-rose-400",
  RUNTIME_ERROR: "text-rose-400",
  TIME_LIMIT: "text-rose-400",
  MEMORY_LIMIT: "text-rose-400",
  COMPILE_ERROR: "text-orange-400",
  SYSTEM_ERROR: "text-rose-400",
}

const STARTER = `# 여기에 코드를 작성하세요\n`

export default function ProblemSolvePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [code, setCode] = useState(STARTER)
  const [language, setLanguage] = useState("python")
  const [hintsOpen, setHintsOpen] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<Submission | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 문제 로드
  useEffect(() => {
    problemsApi.getById(Number(id))
      .then(setProblem)
      .catch(() => setLoadError("문제를 불러오지 못했습니다."))
  }, [id])

  // 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const startPolling = useCallback((submissionId: number) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const sub = await submissionsApi.getById(submissionId)
        setResult(sub)
        if (FINAL_STATUSES.includes(sub.status)) {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
        }
      } catch {
        clearInterval(pollingRef.current!)
        pollingRef.current = null
      }
    }, 2000)
  }, [])

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("제출하려면 로그인이 필요합니다.")
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    setResult(null)
    try {
      const res = await submissionsApi.submit(user.userId, Number(id), code, language)
      setResult({ submissionId: res.submissionId, status: res.status } as Submission)
      startPolling(res.submissionId)
    } catch {
      setSubmitError("제출에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setCode(STARTER)
    setResult(null)
    setSubmitError(null)
  }

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center text-rose-400">
        {loadError}
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const isPolling = result && !FINAL_STATUSES.includes(result.status)

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border/40 bg-card px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/problems"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">문제 목록으로</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium">{problem.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-[40%] overflow-y-auto border-r border-border/40 bg-card/50">
          <div className="p-6">
            <h2 className="text-2xl font-bold">{problem.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>시간 제한: {problem.timeLimitMs / 1000}초</span>
              <span>·</span>
              <span>메모리 제한: {problem.memoryLimitMb}MB</span>
            </div>

            <div className="mt-8 space-y-6">
              <section>
                <h3 className="text-lg font-semibold">문제 설명</h3>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {problem.content}
                </p>
              </section>

              {problem.inputExample && (
                <section>
                  <h3 className="text-lg font-semibold">입력 예시</h3>
                  <div className="mt-3 overflow-x-auto rounded-lg bg-[#0d1117] p-4">
                    <pre className="font-mono text-sm text-emerald-400">
                      {problem.inputExample.replaceAll('\\n', '\n')}
                    </pre>
                  </div>
                </section>
              )}

              {problem.outputExample && (
                <section>
                  <h3 className="text-lg font-semibold">출력 예시</h3>
                  <div className="mt-3 overflow-x-auto rounded-lg bg-[#0d1117] p-4">
                    <pre className="font-mono text-sm text-amber-400">
                      {problem.outputExample.replaceAll('\\n', '\n')}
                    </pre>
                  </div>
                </section>
              )}

              <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>힌트</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        hintsOpen && "rotate-90"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="rounded-lg border border-border/60 bg-secondary/30 p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                    {problem.hint ?? "힌트가 없습니다."}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex w-[60%] flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-border/40 bg-card px-4 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {language === "python" ? "Python" : language}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("python")}>
                  Python
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 overflow-hidden bg-[#0d1117]">
            <div className="h-full overflow-auto">
              <div className="flex min-h-full">
                <div className="select-none border-r border-border/20 bg-[#0d1117] px-3 py-4 text-right font-mono text-sm text-muted-foreground/50">
                  {code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="min-h-full flex-1 resize-none bg-transparent p-4 font-mono text-sm text-muted-foreground outline-none"
                  style={{ tabSize: 4 }}
                />
              </div>
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="flex items-center justify-between border-t border-border/40 bg-card px-4 py-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="gap-2"
                onClick={handleSubmit}
                disabled={submitting || !!isPolling}
              >
                {submitting || isPolling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "제출 중..." : isPolling ? "채점 중..." : "제출"}
              </Button>
            </div>
          </div>

          {/* Result Panel */}
          {(result || submitError) && (
            <div className="border-t border-border/40 bg-card">
              <div className="border-b border-border/40 px-4 py-2">
                <h3 className="text-sm font-medium">채점 결과</h3>
              </div>
              <div className="p-4">
                {submitError && (
                  <p className="text-sm text-rose-400">{submitError}</p>
                )}
                {result && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {isPolling && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
                      <span className={cn("text-sm font-semibold", STATUS_COLOR[result.status])}>
                        {STATUS_LABEL[result.status]}
                      </span>
                    </div>
                    {result.score !== null && (
                      <p className="text-sm text-muted-foreground">
                        점수: <span className="text-foreground font-medium">{result.score}점</span>
                      </p>
                    )}
                    {result.executionTimeMs !== null && (
                      <p className="text-sm text-muted-foreground">
                        실행 시간: <span className="text-foreground">{result.executionTimeMs}ms</span>
                        {result.memoryUsedMb !== null && (
                          <span> / 메모리: {result.memoryUsedMb}MB</span>
                        )}
                      </p>
                    )}
                    {result.errorMessage && (
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-rose-500/10 p-3 font-mono text-xs text-rose-400">
                        {result.errorMessage}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
