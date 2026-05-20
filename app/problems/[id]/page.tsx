"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Play,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  ArrowLeft,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const starterCode = `import numpy as np

def batch_norm(X, gamma, beta, eps=1e-5):
    """
    배치 정규화 순전파를 구현하세요.
    
    Args:
        X: 입력 텐서, 형태 (N, D)
        gamma: 스케일 파라미터, 형태 (D,)
        beta: 시프트 파라미터, 형태 (D,)
        eps: 수치 안정성을 위한 작은 상수
    
    Returns:
        out: 정규화된 출력, 형태 (N, D)
    """
    # 여기에 코드를 작성하세요
    pass`

const testCases = [
  {
    id: 1,
    name: "테스트 케이스 1",
    input: "X = [[1, 2], [3, 4], [5, 6]]\ngamma = [1, 1]\nbeta = [0, 0]",
    expected: "[[-1.22, -1.22], [0.0, 0.0], [1.22, 1.22]]",
    status: "passed" as const,
  },
  {
    id: 2,
    name: "테스트 케이스 2",
    input: "X = [[0, 0], [0, 0]]\ngamma = [1, 1]\nbeta = [0, 0]",
    expected: "[[0, 0], [0, 0]]",
    status: "passed" as const,
  },
  {
    id: 3,
    name: "테스트 케이스 3",
    input: "X = [[1, 2, 3], [4, 5, 6]]\ngamma = [2, 2, 2]\nbeta = [1, 1, 1]",
    expected: "[[-1, -1, -1], [3, 3, 3]]",
    status: "failed" as const,
  },
]

export default function ProblemSolvePage() {
  const [code, setCode] = useState(starterCode)
  const [language, setLanguage] = useState("Python")
  const [hintsOpen, setHintsOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleRun = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setCode(starterCode)
    setShowResults(false)
  }

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
          <h1 className="text-sm font-medium">배치 정규화 구현하기</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-primary/20 text-primary border-primary/30"
          >
            모델 아키텍처
          </Badge>
          <Badge
            variant="outline"
            className="bg-amber-500/20 text-amber-400 border-amber-500/30"
          >
            보통
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-[40%] overflow-y-auto border-r border-border/40 bg-card/50">
          <div className="p-6">
            <h2 className="text-2xl font-bold">배치 정규화 구현하기</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary border-primary/30"
              >
                모델 아키텍처
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-500/20 text-amber-400 border-amber-500/30"
              >
                보통
              </Badge>
              <Badge variant="outline">NumPy</Badge>
            </div>

            <div className="mt-8 space-y-6">
              <section>
                <h3 className="text-lg font-semibold">문제 설명</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  배치 정규화의 순전파를 구현하세요. 형태가 (N, D)인 입력 텐서{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">X</code>가 
                  주어지면 배치 차원에서 정규화하고, 학습된 스케일{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">gamma</code>와 
                  시프트{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">beta</code>를 
                  적용하세요.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  배치 정규화 공식은 다음과 같습니다:
                </p>
                <div className="mt-3 rounded-lg bg-secondary/50 p-4">
                  <code className="text-sm">
                    x_norm = (x - mean) / sqrt(var + eps)
                    <br />
                    out = gamma * x_norm + beta
                  </code>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">함수 시그니처</h3>
                <div className="mt-3 overflow-x-auto rounded-lg bg-[#0d1117] p-4">
                  <pre className="font-mono text-sm">
                    <code className="text-muted-foreground">
                      <span className="text-primary">def</span>{" "}
                      <span className="text-emerald-400">batch_norm</span>(X, gamma,
                      beta, eps=<span className="text-amber-400">1e-5</span>):
                    </code>
                  </pre>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">예제</h3>
                <div className="mt-3 space-y-4">
                  <div className="rounded-lg border border-border/60 bg-secondary/30">
                    <div className="border-b border-border/60 px-4 py-2 text-sm font-medium">
                      예제 1
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 font-mono text-sm">
                        <div>
                          <span className="text-muted-foreground">입력:</span>
                          <pre className="mt-1 text-emerald-400">
                            X = [[1, 2], [3, 4], [5, 6]]{"\n"}
                            gamma = [1, 1]{"\n"}
                            beta = [0, 0]
                          </pre>
                        </div>
                        <div>
                          <span className="text-muted-foreground">출력:</span>
                          <pre className="mt-1 text-amber-400">
                            [[-1.22, -1.22], [0.0, 0.0], [1.22, 1.22]]
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-secondary/30">
                    <div className="border-b border-border/60 px-4 py-2 text-sm font-medium">
                      예제 2
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 font-mono text-sm">
                        <div>
                          <span className="text-muted-foreground">입력:</span>
                          <pre className="mt-1 text-emerald-400">
                            X = [[0, 0], [0, 0]]{"\n"}
                            gamma = [1, 1]{"\n"}
                            beta = [0, 0]
                          </pre>
                        </div>
                        <div>
                          <span className="text-muted-foreground">출력:</span>
                          <pre className="mt-1 text-amber-400">[[0, 0], [0, 0]]</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
                  <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        1. axis=0을 따라 평균을 계산하여 각 특성의 평균을 구하세요
                      </li>
                      <li>
                        2. axis=0을 따라 각 특성의 분산을 계산하세요
                      </li>
                      <li>
                        3. 정규화: (X - mean) / sqrt(var + eps)
                      </li>
                      <li>4. 스케일과 시프트 적용: gamma * X_norm + beta</li>
                    </ul>
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
                  {language}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("Python")}>
                  Python
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("NumPy")}>
                  NumPy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 overflow-hidden bg-[#0d1117]">
            <div className="h-full overflow-auto">
              <div className="flex min-h-full">
                {/* Line Numbers */}
                <div className="select-none border-r border-border/20 bg-[#0d1117] px-3 py-4 text-right font-mono text-sm text-muted-foreground/50">
                  {code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Code Content */}
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
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                onClick={handleRun}
              >
                <Play className="h-4 w-4" />
                실행
              </Button>
              <Button size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                제출
              </Button>
            </div>
          </div>

          {/* Test Results Panel */}
          {showResults && (
            <div className="border-t border-border/40 bg-card">
              <div className="border-b border-border/40 px-4 py-2">
                <h3 className="text-sm font-medium">테스트 결과</h3>
              </div>
              <div className="max-h-48 overflow-y-auto p-4">
                <div className="space-y-2">
                  {testCases.map((testCase) => (
                    <div
                      key={testCase.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-4 py-3",
                        testCase.status === "passed"
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-rose-500/30 bg-rose-500/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {testCase.status === "passed" ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20">
                            <X className="h-3 w-3 text-rose-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{testCase.name}</span>
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          testCase.status === "passed"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        )}
                      >
                        {testCase.status === "passed" ? "통과" : "실패"}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  3개 중 2개 테스트 케이스 통과
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
