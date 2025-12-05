"use client"

import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation"

export const Pricing = () => {

  const router = useRouter()
  const { data } = authClient.useSession()

  const handleUpgradeToPro = () => {
    if(!data?.user) {
      router.push('/sign-in')
      return 
    }
    authClient.checkout({slug: 'cv-reviewer'})
  }
  
  return (
    <section
      id="pricing"
      className="container mx-auto py-20 px-4 text-center"
    >
      <p className="text-teal-600 font-semibold text-base md:text-lg">Pricing</p>
      <h2 className="mt-4 text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto">
        Choose the plan that&apos;s right for you
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Free Card */}
        <div className="flex flex-col justify-between bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-full">
          <div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Free</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-black">
                  $0
                </span>
                <span className="text-sm text-gray-500">/month</span>
              </div>

              <p className="mt-3 text-sm text-gray-500 max-w-lg">
                For casual job seekers to get started.
              </p>
            </div>

            <ul className="mt-8 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">3 CV reviews per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Basic match report</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Keyword analysis</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button
              className="w-full bg-teal-50 text-teal-700 hover:bg-teal-100 border border-transparent font-semibold py-3 rounded-full"
              aria-label="Get Started - Free"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Pro Card */}
        <div className="relative flex flex-col justify-between h-full">
          {/* Badge */}
          <div className="absolute -top-3 right-6 z-10">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold rounded-full px-3 py-1 shadow-md">
              MOST POPULAR
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-teal-400 shadow-md p-8">
            <div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">Pro</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-black">
                    $30
                  </span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>

                <p className="mt-3 text-sm text-gray-500 max-w-lg">
                  For serious applicants who want an edge.
                </p>
              </div>

              <ul className="mt-8 space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited CV reviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Detailed match report</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">ATS compatibility score</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className="w-full bg-teal-600 text-white hover:bg-teal-700 font-semibold py-3 rounded-full cursor-pointer"
                aria-label="Go Pro"
                onClick={handleUpgradeToPro}
              >
                Go Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
