import { Target, Sparkles, Zap } from "lucide-react"

const FEATURES = [
  {
    title: "Keyword Targeting",
    description:
      "Our AI scans the job description to identify and integrate crucial keywords naturally.",
    icon: Target,
  },
  {
    title: "Smart Formatting",
    description:
      "Automatically adjust layout and structure to pass ATS filters without losing style.",
    icon: Sparkles,
  },
  {
    title: "Instant Results",
    description:
      "Get a fully tailored CV in seconds, not hours. Focus on interviewing, not editing.",
    icon: Zap,
  },
]

export const Features = () => {
  return (
    <section className="relative bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="rounded-2xl border bg-gray-50 p-8 transition hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
