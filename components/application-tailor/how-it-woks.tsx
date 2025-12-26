import {
  Upload,
  FileText,
  SlidersHorizontal,
  CheckCircle,
} from "lucide-react"
import { Button } from "../ui/button"

const steps = [
  {
    step: "1",
    title: "Upload CV",
    description:
      "Drag and drop your current resume PDF or Word file to set your baseline.",
    icon: Upload,
  },
  {
    step: "2",
    title: "Add Job Description",
    description:
      "Paste the LinkedIn or Indeed job link or text to target keywords.",
    icon: FileText,
  },
  {
    step: "3",
    title: "Choose Options",
    description:
      "Select tone (Professional, Casual) and add any specific credentials.",
    icon: SlidersHorizontal,
  },
  {
    step: "4",
    title: "Get Results",
    description:
      "Download your perfectly tailored CV & cover letter instantly.",
    icon: CheckCircle,
  },
]

export const HowItWorks = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-600">
            SIMPLE PROCESS
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Optimize your application in{" "}
            <span className="text-purple-600">4 steps</span>
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            A linear, human-first process designed to get you hired faster
            without the headache of manual editing.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Button size="lg" className="px-10">
            Start Tailoring Now →
          </Button>
        </div>
      </div>
    </section>
  )
}
