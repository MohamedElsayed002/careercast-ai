"use client"

import { ArrowLeft, ArrowRight, Key } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { AIProvider } from "./index"

interface CredentialSelectionProps {
    credential: string
    setCredential: (value: SetStateAction<string>) => void
    provider: AIProvider
    setProvider: (value: SetStateAction<AIProvider>) => void
    setStep: Dispatch<SetStateAction<number>>
}

export const CredentialSelection = ({ credential, setCredential, provider, setProvider, setStep }: CredentialSelectionProps) => {
    const trpc = useTRPC()
    const router = useRouter()
    const { data: credentials, isLoading } = useQuery(trpc.getCredential.queryOptions(undefined))

    const handleNext = () => {
        if (!credential) {
            return
        }
        setStep(3)
    }

    const handleAddCredential = () => {
        router.push('/community/credentials')
    }

    return (
        <div className="space-y-6">
            <div className='text-center'>
                <Key className='w-12 h-12 text-teal-600 mx-auto mb-4' />
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                    Step 2: Select Provider & Credential
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Choose the AI provider and API credential to use for CV analysis
                </p>
            </div>

            {/* AI Provider Selection */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Provider
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setProvider('openai')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            provider === 'openai'
                                ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                        </svg>
                        <span className="font-medium">OpenAI</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProvider('gemini')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            provider === 'gemini'
                                ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.648 0 12 0zm0 3.6c2.124 0 4.08.756 5.616 2.004L12 12l5.616 6.396A8.352 8.352 0 0 1 12 20.4c-4.632 0-8.4-3.768-8.4-8.4S7.368 3.6 12 3.6zm6.396 3.984A8.352 8.352 0 0 1 20.4 12c0 2.124-.756 4.08-2.004 5.616L12 12l6.396-5.616z"/>
                        </svg>
                        <span className="font-medium">Gemini</span>
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {provider === 'openai' 
                        ? 'Using OpenAI GPT-5 for analysis. Requires OpenAI API key.' 
                        : 'Using Google Gemini for analysis. Requires Google AI API key.'}
                </p>
            </div>

            {/* Credential Selection */}
            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {provider === 'openai' ? 'OpenAI API Key' : 'Google AI API Key'}
                </Label>
                <Select onValueChange={setCredential} value={credential}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select credential..." />
                    </SelectTrigger>
                    <SelectContent>
                        {isLoading ? (
                            <SelectItem value="loading" disabled>
                                Loading credentials...
                            </SelectItem>
                        ) : credentials && credentials.length > 0 ? (
                            credentials.map((cred) => (
                                <SelectItem key={cred.id} value={cred.id}>
                                    {cred.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-credentials" disabled>
                                No credentials available
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Don&apos;t have any credentials?{' '}
                    <Link href="/community/credentials" className="text-primary underline font-medium">
                        Add your credentials here.
                    </Link>
                </p>
            </div>

            {!credentials || credentials.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                        You need to add a credential before you can analyze your CV.
                    </p>
                    <Button
                        onClick={handleAddCredential}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        Go to Credentials Page
                    </Button>
                </div>
            ) : null}

            <div className="flex gap-3">
                <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!credential || isLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                    Next: Job Description
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    )
}

