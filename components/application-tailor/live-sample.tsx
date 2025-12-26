import { PlayCircle, Check, KeyRound, Sparkles, LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"

export const LiveSample = () => {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* LEFT – IMAGE PLACEHOLDER */}
          <div className="relative">
            <div className="rounded-3xl border bg-white p-4 shadow-xl">
              <Image
                src="/image.png" // replace later with real image
                alt="Live ATS Sample"
                width={700}
                height={520}
                className="rounded-2xl object-cover"
              />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-purple-600 shadow">
                ATS Match Report
              </div>
            </div>
          </div>

          {/* RIGHT – CONTENT */}
          <div className="space-y-8">

            {/* Heading */}
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              See exactly what{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                recruiters see
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-xl text-lg text-gray-500">
              Don&apos;t guess if your resume is good enough. Get an instant ATS
              analysis and tailored suggestions to triple your interview
              chances.
            </p>

            {/* Feature List */}
            <div className="space-y-6">
              <Feature
                icon={Sparkles}
                title="What changed?"
                description="We automatically highlighted passive phrasing and suggested active alternatives."
                color="text-blue-600"
                bg="bg-blue-50"
              />

              <Feature
                icon={KeyRound}
                title="Keywords added"
                description="Identified and integrated 5 critical keywords missing from your original CV."
                color="text-yellow-600"
                bg="bg-yellow-50"
              />

              <Feature
                icon={Check}
                title="Why it helps"
                description="Passing the automated screen is the first step. Optimization gets you in front of humans."
                color="text-green-600"
                bg="bg-green-50"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="gap-2 px-8">
                <PlayCircle className="h-5 w-5" />
                Try Interactive Sample
              </Button>

              <Button size="lg" variant="outline">
                View All Features
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------ Feature Item ------------------ */

const Feature = ({
  icon: Icon,
  title,
  description,
  color,
  bg,
}: {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bg: string
}) => {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg} ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}
