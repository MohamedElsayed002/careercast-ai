import { Dispatch, SetStateAction } from "react"
import { Textarea } from "../ui/textarea"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"

interface JobDescriptionProps {
  setStep: Dispatch<SetStateAction<number>>
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
}

const MAX_CHARS = 10000

export const JobDescription = ({
  setStep,
  jobDescription,
  setJobDescription,
}: JobDescriptionProps) => {
  const isExceeded = jobDescription.length > MAX_CHARS

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        What role are you applying for?
      </h1>

      <p className="text-gray-500 text-lg mb-8">
        Copy and paste the full job description below. The more detailed the
        description, the better our AI can tailor your results.
      </p>

      {/* Card */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        {/* Textarea */}
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={`e.g. Senior Product Manager at TechCorp...

Responsibilities:
- Lead the product team in developing new features
- Analyze market trends and user feedback

Requirements:
- 5+ years experience in product management
- Strong communication skills`}
          className={`min-h-[260px] resize-none text-base border-dashed ${
            isExceeded
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-gray-300"
          }`}
        />

        {/* Footer info */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>
              We prioritize Responsibilities & Requirements sections.
            </span>
          </div>

          <span
            className={
              isExceeded ? "text-red-600 font-medium" : "text-gray-500"
            }
          >
            {jobDescription.length} / {MAX_CHARS} characters
          </span>
        </div>

        {/* Error message */}
        {isExceeded && (
          <p className="mt-2 text-sm text-red-600">
            Job description exceeds the maximum allowed length of 20,000
            characters.
          </p>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Button
          onClick={() => setStep(4)}
          disabled={isExceeded || jobDescription.length === 0}
          className="px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Description →
        </Button>
      </div>
    </div>
  )
}
