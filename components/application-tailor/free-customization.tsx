import { Dispatch, SetStateAction } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { TailoringOptions } from "@/actions/ai-job-application-tailor"

interface FreeCustomizationProps {
  setStep: Dispatch<SetStateAction<number>>
  options: Partial<TailoringOptions>
  setOptions: Dispatch<SetStateAction<Partial<TailoringOptions>>>
}

export const FreeCustomization = ({
  setStep,
  options,
  setOptions,
}: FreeCustomizationProps) => {
  const updateOption = <K extends keyof TailoringOptions>(
    key: K,
    value: TailoringOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        Customize Your Tailoring Options
      </h1>

      <p className="text-gray-500 text-lg mb-8">
        Configure basic tailoring options. Upgrade to Pro for advanced features like cover letter generation and full CV optimization.
      </p>

      {/* Card */}
      <div className="border rounded-xl p-6 bg-white shadow-sm space-y-8">
        {/* Generation Settings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Generation Settings</h2>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="generateTailoredCv"
              checked={options.generateTailoredCv ?? true}
              onCheckedChange={(checked) => updateOption('generateTailoredCv', checked as boolean)}
            />
            <Label htmlFor="generateTailoredCv" className="text-base cursor-pointer">
              Generate Tailored CV
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="optimizeForATS"
              checked={options.optimizeForATS ?? true}
              onCheckedChange={(checked) => updateOption('optimizeForATS', checked as boolean)}
            />
            <Label htmlFor="optimizeForATS" className="text-base cursor-pointer">
              Optimize for ATS (Applicant Tracking Systems)
            </Label>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Cover letter generation is available in Pro tier only.
            </p>
          </div>
        </div>

        {/* CV Section Controls */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-semibold">CV Section Controls</h2>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="rewriteSummary"
              checked={options.rewriteSummary ?? true}
              onCheckedChange={(checked) => updateOption('rewriteSummary', checked as boolean)}
            />
            <Label htmlFor="rewriteSummary" className="text-base cursor-pointer">
              Rewrite Professional Summary
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="rewriteExperience"
              checked={options.rewriteExperience ?? true}
              onCheckedChange={(checked) => updateOption('rewriteExperience', checked as boolean)}
            />
            <Label htmlFor="rewriteExperience" className="text-base cursor-pointer">
              Rewrite Work Experience (Limited to first 2 experiences)
            </Label>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Free Tier:</strong> Only the first 2 work experiences will be tailored. Upgrade to Pro for full CV customization.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Button
          onClick={() => setStep(6)}
          className="px-6 bg-violet-600"
        >
          Continue to Tailoring →
        </Button>
      </div>
    </div>
  )
}

