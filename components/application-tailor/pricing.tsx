"use client"

import { Check } from "lucide-react"
import { Button } from "../ui/button"
import { authClient } from "@/utils/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export const Pricing = () => {
  const router = useRouter()
  const { data } = authClient.useSession()

  const handleUpgradeToPro = () => {
    if (!data?.user) {
      router.push("/sign-in")
      return
    }
    authClient.checkout({ slug: "job-application-tailor" })
  }

  return (
    <section id="pricing" className="container mx-auto py-20 px-4 text-center">
      <h2 className="text-3xl md:text-5xl font-extrabold">
        Simple, transparent pricing
      </h2>
      <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
        Start for free, upgrade for career-changing results. No hidden fees.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Starter */}
        <div className="flex flex-col justify-between bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-700">Starter</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Perfect for casually browsing new opportunities.
            </p>

            <ul className="mt-8 space-y-3 text-left">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-500" />
                Limited tailoring (basic keywords)
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-500" />
                Match score & top 5 keywords
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-500" />
                PDF export only
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-500" />
                3 free jobs/month
              </li>
            </ul>
          </div>

          <Button
            asChild
            className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-full"
          >
            <Link href="/services/job-application-tailor/application">Start free</Link>
          </Button>
        </div>

        {/* Professional */}
        <div className="relative flex flex-col justify-between bg-white rounded-2xl border-2 border-indigo-500 p-8 shadow-lg">
          <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-700">Professional</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">$50</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              For serious job seekers who want results fast.
            </p>

            <ul className="mt-8 space-y-3 text-left">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                Full deep tailoring (AI rewriting)
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                Cover letter generation
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                DOCX & PDF export
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                Unlimited jobs
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                Priority processing
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-indigo-600" />
                Detailed ATS report
              </li>
            </ul>
          </div>

          <Button
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full"
            onClick={handleUpgradeToPro}
          >
            Upgrade to Pro — $50
          </Button>
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Cancel anytime. Secure payment processing via Polar.
      </p>
    </section>
  )
}
