"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Flame,
  Target
} from "lucide-react"

const leaderboardData = [
  { 
    rank: 1, 
    prevRank: 1,
    name: "김지능", 
    avatar: "",
    tier: "그랜드마스터",
    score: 15840,
    solved: 342,
    streak: 45,
    accuracy: 94.2,
    topCategory: "딥러닝"
  },
  { 
    rank: 2, 
    prevRank: 3,
    name: "이머신", 
    avatar: "",
    tier: "그랜드마스터",
    score: 14920,
    solved: 318,
    streak: 32,
    accuracy: 91.8,
    topCategory: "자연어처리"
  },
  { 
    rank: 3, 
    prevRank: 2,
    name: "박러닝", 
    avatar: "",
    tier: "그랜드마스터",
    score: 14780,
    solved: 305,
    streak: 28,
    accuracy: 93.1,
    topCategory: "컴퓨터비전"
  },
  { 
    rank: 4, 
    prevRank: 4,
    name: "최알고", 
    avatar: "",
    tier: "마스터",
    score: 12450,
    solved: 276,
    streak: 21,
    accuracy: 89.5,
    topCategory: "딥러닝"
  },
  { 
    rank: 5, 
    prevRank: 7,
    name: "정데이터", 
    avatar: "",
    tier: "마스터",
    score: 11890,
    solved: 258,
    streak: 38,
    accuracy: 88.2,
    topCategory: "데이터전처리"
  },
  { 
    rank: 6, 
    prevRank: 5,
    name: "한뉴럴", 
    avatar: "",
    tier: "마스터",
    score: 11520,
    solved: 245,
    streak: 15,
    accuracy: 90.1,
    topCategory: "모델최적화"
  },
  { 
    rank: 7, 
    prevRank: 6,
    name: "윤텐서", 
    avatar: "",
    tier: "마스터",
    score: 10980,
    solved: 231,
    streak: 12,
    accuracy: 87.9,
    topCategory: "자연어처리"
  },
  { 
    rank: 8, 
    prevRank: 10,
    name: "서파이썬", 
    avatar: "",
    tier: "다이아몬드",
    score: 9870,
    solved: 198,
    streak: 25,
    accuracy: 86.4,
    topCategory: "컴퓨터비전"
  },
  { 
    rank: 9, 
    prevRank: 8,
    name: "강모델", 
    avatar: "",
    tier: "다이아몬드",
    score: 9650,
    solved: 192,
    streak: 8,
    accuracy: 85.8,
    topCategory: "딥러닝"
  },
  { 
    rank: 10, 
    prevRank: 9,
    name: "임코딩", 
    avatar: "",
    tier: "다이아몬드",
    score: 9420,
    solved: 187,
    streak: 19,
    accuracy: 84.3,
    topCategory: "데이터전처리"
  },
]

const tierColors: Record<string, string> = {
  "그랜드마스터": "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
  "마스터": "bg-gradient-to-r from-purple-500 to-violet-500 text-white",
  "다이아몬드": "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
  "플래티넘": "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
  "골드": "bg-gradient-to-r from-yellow-400 to-orange-400 text-white",
  "실버": "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
  "브론즈": "bg-gradient-to-r from-orange-300 to-amber-400 text-gray-800",
}

function getRankChange(current: number, prev: number) {
  if (current < prev) {
    return { icon: TrendingUp, color: "text-green-500", change: prev - current }
  } else if (current > prev) {
    return { icon: TrendingDown, color: "text-red-500", change: current - prev }
  }
  return { icon: Minus, color: "text-muted-foreground", change: 0 }
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
  return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "monthly" | "weekly">("all")

  const filteredData = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

        {/* 상위 3명 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <Card 
              key={user.rank}
              className={`bg-card border-border relative overflow-hidden ${
                index === 0 ? "md:order-2 md:-mt-4" : index === 1 ? "md:order-1" : "md:order-3"
              }`}
            >
              {index === 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />
              )}
              <CardContent className="pt-6 text-center">
                <div className="mb-3">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="w-20 h-20 mx-auto mb-3 ring-2 ring-border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-secondary text-lg">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground mb-1">{user.name}</h3>
                <Badge className={`${tierColors[user.tier]} mb-3`}>
                  {user.tier}
                </Badge>
                <div className="text-3xl font-bold text-primary mb-2">
                  {user.score.toLocaleString()}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">해결</div>
                    <div className="font-semibold text-foreground">{user.solved}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">정확도</div>
                    <div className="font-semibold text-foreground">{user.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">연속</div>
                    <div className="font-semibold text-foreground flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {user.streak}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 필터 및 검색 */}
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
          <div className="flex gap-2">
            <Button
              variant={timeFilter === "all" ? "default" : "outline"}
              onClick={() => setTimeFilter("all")}
              size="sm"
            >
              전체
            </Button>
            <Button
              variant={timeFilter === "monthly" ? "default" : "outline"}
              onClick={() => setTimeFilter("monthly")}
              size="sm"
            >
              이번 달
            </Button>
            <Button
              variant={timeFilter === "weekly" ? "default" : "outline"}
              onClick={() => setTimeFilter("weekly")}
              size="sm"
            >
              이번 주
            </Button>
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
                    <th className="pb-3 text-muted-foreground font-medium text-right">점수</th>
                    <th className="pb-3 text-muted-foreground font-medium text-right hidden md:table-cell">해결</th>
                    <th className="pb-3 text-muted-foreground font-medium text-right hidden lg:table-cell">정확도</th>
                    <th className="pb-3 text-muted-foreground font-medium text-right hidden lg:table-cell">연속</th>
                    <th className="pb-3 text-muted-foreground font-medium text-center hidden xl:table-cell">주력 분야</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((user) => {
                    const rankChange = getRankChange(user.rank, user.prevRank)
                    const RankChangeIcon = rankChange.icon
                    
                    return (
                      <tr 
                        key={user.rank} 
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 flex justify-center">
                              {getRankIcon(user.rank)}
                            </div>
                            <div className={`flex items-center gap-0.5 ${rankChange.color}`}>
                              <RankChangeIcon className="w-3 h-3" />
                              {rankChange.change > 0 && (
                                <span className="text-xs">{rankChange.change}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-secondary text-sm">
                                {user.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">{user.name}</div>
                              <div className="text-xs text-muted-foreground sm:hidden">
                                {user.tier}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center hidden sm:table-cell">
                          <Badge className={tierColors[user.tier]}>
                            {user.tier}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-bold text-foreground">
                            {user.score.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 text-right hidden md:table-cell">
                          <span className="text-foreground">{user.solved}</span>
                        </td>
                        <td className="py-4 text-right hidden lg:table-cell">
                          <span className="text-foreground">{user.accuracy}%</span>
                        </td>
                        <td className="py-4 text-right hidden lg:table-cell">
                          <span className="flex items-center justify-end gap-1 text-foreground">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {user.streak}일
                          </span>
                        </td>
                        <td className="py-4 text-center hidden xl:table-cell">
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {user.topCategory}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 내 순위 카드 */}
        <Card className="bg-card border-border mt-6 border-primary/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-muted-foreground">#128</div>
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/20 text-primary">나</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">내 순위</div>
                  <Badge className={tierColors["골드"]}>골드</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">4,280</div>
                <div className="text-sm text-muted-foreground">총 점수</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
