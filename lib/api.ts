const BASE_URL = "http://localhost:8080"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const error = new Error(`API ${res.status}`) as Error & { status: number }
    error.status = res.status
    throw error
  }
  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string
  tokenType: string
  userId: number
  username: string
  email: string
}

export interface UserResponse {
  userId: number
  username: string
  email: string
}

export const auth = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (username: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  me: () => request<UserResponse>("/api/auth/me"),
}

// ── Problems ─────────────────────────────────────────────────────────────────

export interface Category {
  categoryId: number
  categoryName: string
  parentId: number | null
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD"

export interface Problem {
  problemId: number
  title: string
  content: string
  inputExample: string
  outputExample: string
  difficulty: Difficulty
  timeLimitMs: number
  memoryLimitMb: number
  categoryId: number
  hint: string | null
  createdAt: string
}

export interface SolutionEntry {
  submissionId: number
  userId: number
  username: string
  language: string
  executionTimeMs: number | null
  code: string
  submittedAt: string
}

export const problems = {
  getCategories: () => request<Category[]>("/api/problems/categories"),

  getList: (categoryId?: number, difficulty?: Difficulty) => {
    const qs = new URLSearchParams()
    if (categoryId) qs.set("categoryId", String(categoryId))
    if (difficulty) qs.set("difficulty", difficulty)
    const q = qs.toString()
    return request<Problem[]>(`/api/problems${q ? `?${q}` : ""}`)
  },

  getById: (id: number) => request<Problem>(`/api/problems/${id}`),

  // FR-26 문제 추천: 아직 못 푼 문제를 쉬운 난이도 순으로
  getRecommendations: (userId: number, limit = 3) =>
    request<Problem[]>(`/api/problems/recommendations?userId=${userId}&limit=${limit}`),

  // FR-29 풀이 비교: 해당 문제의 정답 제출들
  getSolutions: (problemId: number, limit = 20) =>
    request<SolutionEntry[]>(`/api/problems/${problemId}/solutions?limit=${limit}`),
}

// ── Submissions ───────────────────────────────────────────────────────────────

export type SubmissionStatus =
  | "PENDING"
  | "JUDGING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT"
  | "MEMORY_LIMIT"
  | "COMPILE_ERROR"
  | "SYSTEM_ERROR"

export interface Submission {
  submissionId: number
  userId: number
  problemId: number
  code: string
  language: string
  status: SubmissionStatus
  score: number | null
  executionTimeMs: number | null
  memoryUsedMb: number | null
  errorMessage: string | null
  submittedAt: string
  judgedAt: string | null
}

export interface SubmitResponse {
  submissionId: number
  status: SubmissionStatus
  message: string
}

export const submissions = {
  submit: (userId: number, problemId: number, code: string, language = "python") =>
    request<SubmitResponse>("/api/submissions", {
      method: "POST",
      body: JSON.stringify({ userId, problemId, code, language }),
    }),

  getById: (id: number) => request<Submission>(`/api/submissions/${id}`),
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface UserStats {
  userId: number
  attemptedCount: number
  solvedCount: number
  wrongCount: number
  accuracy: number
}

export const users = {
  getStats: () => request<UserStats>("/api/users/me/stats"),

  getSubmissions: () => request<Submission[]>("/api/users/me/submissions"),
}

// ── Leaderboard (FR-31) ─────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  solvedCount: number
  wrongCount: number
  accuracy: number
  tier: string
}

export const leaderboard = {
  getRanking: (limit?: number) =>
    request<LeaderboardEntry[]>(`/api/leaderboard${limit ? `?limit=${limit}` : ""}`),
}

// ── Experiments (FR-30) ─────────────────────────────────────────────────────────

export interface Experiment {
  experimentId: number
  userId: number
  problemId: number | null
  submissionId: number | null
  title: string | null
  params: string | null
  metrics: string | null
  note: string | null
  createdAt: string
}

export interface ExperimentRequest {
  userId: number
  problemId?: number
  submissionId?: number
  title?: string
  params?: string
  metrics?: string
  note?: string
}

export const experiments = {
  create: (body: ExperimentRequest) =>
    request<Experiment>("/api/experiments", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  list: (userId: number, problemId?: number) =>
    request<Experiment[]>(
      `/api/experiments?userId=${userId}${problemId ? `&problemId=${problemId}` : ""}`
    ),

  remove: (id: number) =>
    request<void>(`/api/experiments/${id}`, { method: "DELETE" }),
}
