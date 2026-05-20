import Link from "next/link"
import { ArrowRight, Brain, Code, Layers, Target, Zap, Database, GitBranch, Activity, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const features = [
  {
    icon: Brain,
    title: "ML 특화 문제",
    description:
      "일반 알고리즘이 아닌 머신러닝 워크플로우에 특화된 문제를 연습하세요.",
  },
  {
    icon: Layers,
    title: "실제 파이프라인 챌린지",
    description:
      "데이터 전처리부터 모델 배포까지 실제 ML 파이프라인 구성 요소를 구현해보세요.",
  },
  {
    icon: Target,
    title: "실무 역량 강화",
    description:
      "업계에서 요구하는 실질적인 ML 엔지니어링 면접을 준비하세요.",
  },
]

const categories = [
  {
    icon: Database,
    name: "데이터 전처리",
    count: 24,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: GitBranch,
    name: "모델 아키텍처",
    count: 31,
    color: "bg-primary/20 text-primary",
  },
  {
    icon: Zap,
    name: "손실 함수 및 최적화",
    count: 18,
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    icon: Code,
    name: "학습 루프",
    count: 22,
    color: "bg-rose-500/20 text-rose-400",
  },
  {
    icon: BarChart3,
    name: "평가 지표",
    count: 15,
    color: "bg-cyan-500/20 text-cyan-400",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Gradient Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                PyTorch & TensorFlow 지원
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                당신의{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ML 엔지니어링
                </span>{" "}
                실력을 증명하세요
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                일반 알고리즘을 테스트하는 LeetCode나 백준과 달리, MLCode는 머신러닝 
                엔지니어링 역량에 집중합니다. 데이터 전처리부터 모델 배포까지 ML 
                파이프라인의 개별 구성 요소를 직접 구현해보세요.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/problems">
                  <Button size="lg" className="gap-2">
                    연습 시작하기
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/problems">
                  <Button variant="outline" size="lg">
                    문제 보기
                  </Button>
                </Link>
              </div>
            </div>

            {/* Code Preview */}
            <div className="mx-auto mt-16 max-w-2xl">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
                <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/30 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    batch_norm.py
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-sm">
                  <code className="text-muted-foreground">
                    <span className="text-primary">import</span> numpy{" "}
                    <span className="text-primary">as</span> np{"\n\n"}
                    <span className="text-primary">def</span>{" "}
                    <span className="text-emerald-400">batch_norm</span>(X, gamma, beta, eps=
                    <span className="text-amber-400">1e-5</span>):{"\n"}
                    {"    "}
                    <span className="text-muted-foreground/60">
                      # 평균과 분산 계산
                    </span>
                    {"\n"}
                    {"    "}mean = np.mean(X, axis=<span className="text-amber-400">0</span>)
                    {"\n"}
                    {"    "}var = np.var(X, axis=<span className="text-amber-400">0</span>)
                    {"\n\n"}
                    {"    "}
                    <span className="text-muted-foreground/60"># 정규화</span>
                    {"\n"}
                    {"    "}X_norm = (X - mean) / np.sqrt(var + eps){"\n\n"}
                    {"    "}
                    <span className="text-muted-foreground/60"># 스케일 및 시프트</span>
                    {"\n"}
                    {"    "}
                    <span className="text-primary">return</span> gamma * X_norm + beta
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ML 엔지니어를 위해 설계되었습니다
              </h2>
              <p className="mt-4 text-muted-foreground">
                실제 ML 엔지니어링에서 필요한 실용적인 역량을 마스터하는 데 필요한 모든 것.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-t border-border/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                문제 카테고리
              </h2>
              <p className="mt-4 text-muted-foreground">
                머신러닝 파이프라인의 모든 구성 요소를 마스터하세요.
              </p>
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href="/problems"
                  className="group flex flex-col items-center rounded-xl border border-border/60 bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${category.color}`}
                  >
                    <category.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.count}개 문제
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/20 p-8 sm:p-16">
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  ML 실력을 한 단계 높일 준비가 되셨나요?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  매일 연습하고 실력을 향상시키는 수천 명의 ML 엔지니어들과 함께하세요.
                </p>
                <div className="mt-8">
                  <Link href="/problems">
                    <Button size="lg" className="gap-2">
                      무료로 시작하기
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
