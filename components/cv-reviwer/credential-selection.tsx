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

interface CredentialSelectionProps {
    credential: string
    setCredential: (value: SetStateAction<string>) => void
    setStep: Dispatch<SetStateAction<number>>
}

export const CredentialSelection = ({ credential, setCredential, setStep }: CredentialSelectionProps) => {
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
                    Step 2: Select Credential
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Choose the API credential to use for CV analysis
                </p>
            </div>

            <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Credentials (API Key)
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

