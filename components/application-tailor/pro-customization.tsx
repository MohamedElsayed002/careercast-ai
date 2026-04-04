import { Dispatch, SetStateAction } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { TailoringOptions } from "@/actions/ai-job-application-tailor"
import { Textarea } from "../ui/textarea"

interface ProCustomizationProps {
    setStep: Dispatch<SetStateAction<number>>
    options: Partial<TailoringOptions>
    setOptions: Dispatch<SetStateAction<Partial<TailoringOptions>>>,
    moreInfo: string
    openMoreInfo: boolean
    setOpenMoreInfo: Dispatch<SetStateAction<boolean>>
    setMoreInfo: Dispatch<SetStateAction<string>>
}

export const ProCustomization = ({
    setStep,
    options,
    setOptions,
    moreInfo,
    openMoreInfo,
    setMoreInfo,
    setOpenMoreInfo
}: ProCustomizationProps) => {
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
                Configure how you want your CV and cover letter to be tailored. All options are enabled by default.
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
                            id="generateCoverLetter"
                            checked={options.generateCoverLetter ?? false}
                            onCheckedChange={(checked) => updateOption('generateCoverLetter', checked as boolean)}
                        />
                        <Label htmlFor="generateCoverLetter" className="text-base cursor-pointer">
                            Generate Cover Letter
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
                            Rewrite Work Experience
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="reorderSkills"
                            checked={options.reorderSkills ?? true}
                            onCheckedChange={(checked) => updateOption('reorderSkills', checked as boolean)}
                        />
                        <Label htmlFor="reorderSkills" className="text-base cursor-pointer">
                            Reorder Skills by Relevance
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="emphasizeAchievements"
                            checked={options.emphasizeAchievements ?? true}
                            onCheckedChange={(checked) => updateOption('emphasizeAchievements', checked as boolean)}
                        />
                        <Label htmlFor="emphasizeAchievements" className="text-base cursor-pointer">
                            Emphasize Achievements
                        </Label>
                    </div>
                </div>

                {/* Cover Letter Options */}
                {options.generateCoverLetter && (
                    <div className="space-y-4 border-t pt-6">
                        <h2 className="text-2xl font-semibold">Cover Letter Options</h2>

                        <div className="space-y-2">
                            <Label htmlFor="coverLetterTone">Cover Letter Tone</Label>
                            <Select
                                value={options.coverLetterTone || 'professional'}
                                onValueChange={(value) => updateOption('coverLetterTone', value as any)}
                            >
                                <SelectTrigger id="coverLetterTone">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="friendly">Friendly</SelectItem>
                                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                    <SelectItem value="formal">Formal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverLetterLength">Cover Letter Length</Label>
                            <Select
                                value={options.coverLetterLength || 'standard'}
                                onValueChange={(value) => updateOption('coverLetterLength', value as any)}
                            >
                                <SelectTrigger id="coverLetterLength">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">Short (150-200 words)</SelectItem>
                                    <SelectItem value="standard">Standard (250-350 words)</SelectItem>
                                    <SelectItem value="detailed">Detailed (400-500 words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Context Options */}
                <div className="space-y-4 border-t pt-6">
                    <h2 className="text-2xl font-semibold">Context (Optional)</h2>

                    <div className="space-y-2">
                        <Label htmlFor="targetRole">Target Role</Label>
                        <input
                            id="targetRole"
                            type="text"
                            value={options.targetRole || ''}
                            onChange={(e) => updateOption('targetRole', e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type</Label>
                        <Select
                            value={options.companyType || ''}
                            onValueChange={(value) => updateOption('companyType', value as any)}
                        >
                            <SelectTrigger id="companyType">
                                <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="startup">Startup</SelectItem>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="consulting">Consulting</SelectItem>
                                <SelectItem value="nonprofit">Nonprofit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seniorityLevel">Seniority Level</Label>
                        <Select
                            value={options.seniorityLevel || ''}
                            onValueChange={(value) => updateOption('seniorityLevel', value as any)}
                        >
                            <SelectTrigger id="seniorityLevel">
                                <SelectValue placeholder="Select seniority level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="entry">Entry Level</SelectItem>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="mid">Mid Level</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Custom Data */}
                {openMoreInfo ? (
                    <>

                        <h1 className='text-2xl font-bold'>Add More Info</h1>
                        <div className="border rounded-xl p-1 bg-white shadow-sm">
                            <Textarea
                                value={moreInfo}
                                onChange={(e) => setMoreInfo(e.target.value)}
                                placeholder={`Add more Info about you
                                    e.g.
                                    1- Projects that not included in the CV
                                    2- Work experience
                                    
                                    Will give you the best project or work experience to put it on the CV. or to put it in the
                                    Cover letter as you wish
                                `}
                                className="border-gray-300 min-h-[260px] resize-none text-base border-dashed"
                            />
                        </div>
                        <Button onClick={() => setOpenMoreInfo(false)}>
                            Hide
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setOpenMoreInfo(true)}>
                            Add Custom data
                        </Button>
                    </>
                )}
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
                    onClick={() => setStep(5)}
                    className="px-6 bg-violet-600"
                >
                    Continue to Tailoring →
                </Button>
            </div>
        </div>
    )
}

