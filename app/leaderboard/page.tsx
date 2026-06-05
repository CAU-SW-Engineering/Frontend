"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { leaderboard as leaderboardApi, LeaderboardEntry } from "@/lib/api"
import { cn } from "@/lib/utils"

const TIER_COLOR: Record<string, string> = {
  그랜드마스터: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  마스터:       "bg-purple-500/20 text-purple-400 border-purple-500/30",
  다이아몬드:   "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  플래티넘:     "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  골드:         "bg-amber-500/20 text-amber-400 border-amber-500/30",
  실버:         "bg-slate-400/20 text-slate-400 border-slate-400/30",
  브론즈:       "bg-orange-700/20 text-orange-400 border-orange-700/30",
}

const RANK_ICON = (rank: number) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-amber-400" />
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />
  return <span className="w-5 text-center text-sm font-medium text-muted-foreground">{rank}</span>
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    leaderboardApi.getRanking()
      .then(setEntries)
      .catch(() => setError("랭킹을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">리더보드</h1>
            <p className="mt-2 text-muted-foreground">
              풀어낸 문제 수 기준 전체 사용자 랭킹
            </p>
          </div>

          {loading ? (
            <p className="py-20 text-center text-muted-foreground">불러오는 중...</p>
          ) : error ? (
            <p className="py-20 text-center text-rose-400">{error}</p>
          ) : entries.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              아직 랭킹 데이터가 없습니다.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-border/60 bg-secondary/30 px-5 py-3 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">순위</div>
                <div className="col-span-4">사용자</div>
                <div className="col-span-3">티어</div>
                <div className="col-span-2 text-right">푼 문제</div>
                <div className="col-span-2 text-right">정답률</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border/40">
                {entries.map((entry) => (
                  <div
                    key={entry.userId}
                    className={cn(
                      "grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/20",
                      entry.rank <= 3 && "bg-primary/5"
                    )}
                  >
                    {/* 순위 */}
                    <div className="col-span-1 flex items-center">
                      {RANK_ICON(entry.rank)}
                    </div>

                    {/* 사용자명 */}
                    <div className="col-span-4 font-medium">
                      {entry.username}
                    </div>

                    {/* 티어 */}
                    <div className="col-span-3">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", TIER_COLOR[entry.tier] ?? "")}
                      >
                        {entry.tier}
                      </Badge>
                    </div>

                    {/* 푼 문제 수 */}
                    <div className="col-span-2 text-right font-semibold">
                      {entry.solvedCount}
                    </div>

                    {/* 정답률 */}
                    <div className="col-span-2 text-right text-sm text-muted-foreground">
                      {Number(entry.accuracy).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
