import { Lock, WandSparkles, PlayCircle } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import Image from "next/image"

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 md:px-0  py-20">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm font-medium text-purple-600 shadow-sm">
              <WandSparkles className="h-4 w-4" />
              AI-POWERED OPTIMIZATION
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
              Tailor your CV to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                any job
              </span>{" "}
              — instantly
            </h1>

            {/* Description */}
            <p className="max-w-xl text-lg text-gray-500">
              Upload your CV and the job description — our AI rewrites,
              prioritizes, and optimizes your application so you apply with
              confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/">
                  Start Tailoring
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Link href="/">
                  <PlayCircle className="h-5 w-5" />
                  Try live sample
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600" />
                Privacy-first
              </div>
              <span>✓ No fabricated experience</span>
              <span>OpenAI</span>
              <span>Gemini</span>
            </div>
          </div>

          {/* RIGHT IMAGE CARD */}
          <div className="relative">
            <div className="relative rounded-3xl border bg-white p-3 shadow-xl">
              <Image
                src="/application-tailor-hero.webp"
                width={700}
                height={520}
                alt="Application Tailor Preview"
                className="rounded-2xl object-cover"
                priority
              />

              {/* Floating Score Card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-600">Optimization Score</span>
                  <span className="text-purple-600">94/100</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" />
                </div>

                <div className="mt-3 flex gap-3 text-xs">
                  <span className="rounded-full bg-green-50 px-2 py-1 text-green-600">
                    + Added Keywords
                  </span>
                  <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-600">
                    Rephrased
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
