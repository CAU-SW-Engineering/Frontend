"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Trophy, Medal, Award, Crown, Target } from "lucide-react"
import { leaderboard as leaderboardApi, LeaderboardEntry } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const tierColors: Record<string, string> = {
  "그랜드마스터": "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
  "마스터": "bg-gradient-to-r from-purple-500 to-violet-500 text-white",
  "다이아몬드": "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
  "플래티넘": "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
  "골드": "bg-gradient-to-r from-yellow-400 to-orange-400 text-white",
  "실버": "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
  "브론즈": "bg-gradient-to-r from-orange-300 to-amber-400 text-gray-800",
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
  return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    leaderboardApi.getRanking()
      .then(setData)
      .catch(() => setError("리더보드를 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  const filteredData = data.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const myEntry = user ? data.find((u) => u.userId === user.userId) : undefined

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-foreground">리더보드</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            최고의 ML 엔지니어들과 실력을 겨뤄보세요
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">불러오는 중...</div>
        ) : error ? (
          <div className="py-20 text-center text-rose-400">{error}</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            아직 랭킹 데이터가 없습니다. 문제를 풀고 첫 순위에 올라보세요!
          </div>
        ) : (
          <>
            {/* 상위 3명 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {data.slice(0, 3).map((u, index) => (
                <Card
                  key={u.userId}
                  className={`bg-card border-border relative overflow-hidden ${
                    index === 0 ? "md:order-2 md:-mt-4" : index === 1 ? "md:order-1" : "md:order-3"
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />
                  )}
                  <CardContent className="pt-6 text-center">
                    <div className="mb-3">{getRankIcon(u.rank)}</div>
                    <Avatar className="w-20 h-20 mx-auto mb-3 ring-2 ring-border">
                      <AvatarFallback className="bg-secondary text-lg">
                        {u.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-foreground mb-1">{u.username}</h3>
                    <Badge className={`${tierColors[u.tier] ?? ""} mb-3`}>{u.tier}</Badge>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {u.solvedCount}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">해결</div>
                        <div className="font-semibold text-foreground">{u.solvedCount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">정답률</div>
                        <div className="font-semibold text-foreground">{u.accuracy}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 검색 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="사용자 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            {/* 리더보드 테이블 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  전체 순위
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-muted-foreground font-medium w-16">순위</th>
                        <th className="pb-3 text-muted-foreground font-medium">사용자</th>
                        <th className="pb-3 text-muted-foreground font-medium text-center hidden sm:table-cell">티어</th>
                        <th className="pb-3 text-muted-foreground font-medium text-right">해결</th>
                        <th className="pb-3 text-muted-foreground font-medium text-right hidden md:table-cell">오답</th>
                        <th className="pb-3 text-muted-foreground font-medium text-right hidden lg:table-cell">정답률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((u) => (
                        <tr
                          key={u.userId}
                          className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                            user && u.userId === user.userId ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="py-4">
                            <div className="w-8 flex justify-center">{getRankIcon(u.rank)}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-secondary text-sm">
                                  {u.username.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-foreground">{u.username}</div>
                            </div>
                          </td>
                          <td className="py-4 text-center hidden sm:table-cell">
                            <Badge className={tierColors[u.tier] ?? ""}>{u.tier}</Badge>
                          </td>
                          <td className="py-4 text-right font-bold text-foreground">{u.solvedCount}</td>
                          <td className="py-4 text-right hidden md:table-cell text-foreground">{u.wrongCount}</td>
                          <td className="py-4 text-right hidden lg:table-cell text-foreground">{u.accuracy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 내 순위 */}
            {myEntry && (
              <Card className="bg-card border-border mt-6 border-primary/50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground">#{myEntry.rank}</div>
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {myEntry.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">내 순위</div>
                        <Badge className={tierColors[myEntry.tier] ?? ""}>{myEntry.tier}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{myEntry.solvedCount}</div>
                      <div className="text-sm text-muted-foreground">해결한 문제</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
