"use client"

import { ArrowLeft, Briefcase, Sparkles, Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Dispatch, SetStateAction } from "react"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { CVReviewType } from "@/actions/cv-reviewer"

interface JobDescriptionProps {
    jobDescription: string
    cvText: string
    credential: string
    setJobDescription: (value: SetStateAction<string>) => void
    useDummyJob: () => void
    setStep: Dispatch<SetStateAction<number>>
    setAnalysis: Dispatch<SetStateAction<CVReviewType | null>>
    setError: Dispatch<SetStateAction<string | null>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const JobDescription = ({ setAnalysis, cvText, useDummyJob, setStep, jobDescription, setJobDescription, credential, setError, setIsLoading }: JobDescriptionProps) => {

    const trpc = useTRPC()
    const generateReview = useMutation(trpc.generateCVReview.mutationOptions({
        onSuccess: (data) => {
            setAnalysis(data)
            setError(null)
            setIsLoading(false)
            setStep(4)
        },
        onError: (error: unknown) => {
            setIsLoading(false)
            const errorMessage = error instanceof Error ? error.message : 'Failed to analyze CV. Please try again.'
            setError(errorMessage)
            toast.error(errorMessage)
            setStep(4) // Move to step 4 to show error
        }
    }))

    const analyzeMatch = () => {
        if (!cvText.trim() || !jobDescription.trim()) {
            toast.error('CV and Job description text are required')
            return
        }
        if (!credential.trim()) {
            toast.error('Credential is required')
            return
        }
        
        // Reset previous error and set loading state
        setError(null)
        setIsLoading(true)
        setAnalysis(null)
        
        // Move to step 4 to show loading state
        setStep(4)
        
        // Start the mutation
        generateReview.mutate({
            cvText,
            jobDescription,
            credential
        })
    }
    return (
        <div className="space-y-6">
            <div className='text-center'>
                <Briefcase className='w-12 h-12 text-teal-600 mx-auto mb-4' />
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                    Step 3: Job Description
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Paste job description you&apos;re applying for
                </p>
            </div>

            <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                </Label>
                <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications.."
                    className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Or use sample job description</p>
                <button
                    onClick={useDummyJob}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Use Dummy Job Description
                </button>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={analyzeMatch}
                    disabled={!jobDescription.trim() || !credential.trim() || generateReview.isPending}
                    className="flex-1 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {generateReview.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            Analyze Match
                            <Sparkles className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}