import {
  Briefcase,
  ShieldCheck,
  FileText,
  BarChart3,
  History,
  Award,
  CheckCircle2,
  Download,
  LucideIcon,
} from "lucide-react"

export const MoreFeatures = () => {
  return (
    <section id='more-features' className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            FEATURES DESIGNED TO GET YOU HIRED
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Everything you need to land the job
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Our AI analyzes job descriptions and optimizes your documents to
            help you stand out from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={Briefcase}
            title="Job-specific CV Tailoring"
            description="AI analysis matches your skills to the job description perfectly."
          />

          <Feature
            icon={ShieldCheck}
            title="ATS Optimization"
            description="Keywords designed to pass Applicant Tracking Systems effortlessly."
          />

          <Feature
            icon={FileText}
            title="Cover Letter Generator"
            description="Instantly write persuasive letters that match your professional tone."
            badge="Pro"
          />

          <Feature
            icon={BarChart3}
            title="Before & After Scores"
            description="See exactly how much your match potential improved with data."
          />

          <Feature
            icon={History}
            title="Change Tracking"
            description="Review every edit the AI makes before finalizing your documents."
          />

          <Feature
            icon={Award}
            title="Credential Management"
            description="Securely store your certifications, awards, and portfolio links."
          />

          <Feature
            icon={CheckCircle2}
            title="Validation & Safety"
            description="Human-in-the-loop verification options available for peace of mind."
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------ Feature Card ------------------ */

const Feature = ({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
}) => {
  return (
    <div className="relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Badge */}
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-600">
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="text-sm text-gray-500">
        {description}
      </p>
    </div>
  )
}
