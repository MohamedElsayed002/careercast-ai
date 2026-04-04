import { Lock, WandSparkles, PlayCircle } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import Image from "next/image"
import { DotPattern } from "../community/dot-pattern"
import { ApplicationTailorHeader } from "@/components/application-tailor/header"

export const HeroSection = () => {
  return (
    <DotPattern
      layout="section"
      vignette={false}
      className="border-b border-violet-200/40 bg-gradient-to-br from-white via-violet-50/50 to-indigo-100/35 dark:border-white/10 dark:from-zinc-950 dark:via-purple-950/25 dark:to-zinc-900"
      baseColor="#a1a1aa"
      glowColor="#7c3aed"
      gap={20}
      dotSize={2}
      proximity={110}
      glowIntensity={0.85}
      waveSpeed={0.35}
    > 
      <ApplicationTailorHeader/>
      <section className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 md:px-0">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 text-sm font-medium text-purple-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/80 dark:text-violet-300">
                <WandSparkles className="h-4 w-4" />
                AI-POWERED OPTIMIZATION
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl dark:text-zinc-50">
                Tailor your CV to{" "}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                  any job
                </span>{" "}
                — instantly
              </h1>

              <p className="max-w-xl text-lg text-gray-600 dark:text-zinc-400">
                Upload your CV and the job description — our AI rewrites,
                prioritizes, and optimizes your application so you apply with
                confidence.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="px-8 shadow-md shadow-purple-500/15">
                  <Link href="/services/job-application-tailor/application">
                    Start Tailoring
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="gap-2 border-violet-200/80 bg-white/70 backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/60">
                  <Link href="/services/job-application-tailor#live-samples">
                    <PlayCircle className="h-5 w-5" />
                    Try live sample
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gray-500 dark:text-zinc-500">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-600 dark:text-violet-400" />
                  Privacy-first
                </div>
                <span>✓ No fabricated experience</span>
                <span>OpenAI</span>
                <span>Gemini</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl border border-violet-200/60 bg-white/95 p-3 shadow-xl shadow-purple-500/10 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/90">
                <Image
                  src="/application-tailor-hero.webp"
                  width={700}
                  height={520}
                  alt="Application Tailor Preview"
                  className="rounded-2xl object-cover"
                  priority
                />

                <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-violet-100/80 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-600 dark:text-zinc-400">Optimization Score</span>
                    <span className="text-purple-600 dark:text-violet-400">94/100</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-zinc-800">
                    <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500" />
                  </div>

                  <div className="mt-3 flex gap-3 text-xs">
                    <span className="rounded-full bg-green-50 px-2 py-1 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                      + Added Keywords
                    </span>
                    <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-600 dark:bg-purple-950/50 dark:text-violet-400">
                      Rephrased
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DotPattern>
  )
}
