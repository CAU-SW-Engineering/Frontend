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

export interface Problem {
  problemId: number
  title: string
  content: string
  inputExample: string
  outputExample: string
  timeLimitMs: number
  memoryLimitMb: number
  categoryId: number
  createdAt: string
}

export const problems = {
  getCategories: () => request<Category[]>("/api/problems/categories"),

  getList: (categoryId?: number) =>
    request<Problem[]>(
      categoryId ? `/api/problems?categoryId=${categoryId}` : "/api/problems"
    ),

  getById: (id: number) => request<Problem>(`/api/problems/${id}`),
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
