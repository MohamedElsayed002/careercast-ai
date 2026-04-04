"use client"

import { useState } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import UploadCV from "./upload-cv";
import { AIProvider } from "../cv-reviwer";
import { CredentialSelection } from "../cv-reviwer/credential-selection";
import { JobDescription } from "./job-description";
import { ProCustomization } from "./pro-customization";
import { FreeCustomization } from "./free-customization";
import { TailoredResult } from "./tailored-result";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { TailoringOptions, TailoredCVFreeTier, TailoredCVProTier } from "@/actions/ai-job-application-tailor";
import { Button } from "../ui/button";
import Lottie from 'lottie-react';
import animationData from '@/public/loading.json';
import { XCircle, RefreshCw } from "lucide-react";
import { DotPattern } from "../community/dot-pattern";
import { ApplicationTailorHeader } from "./header";



export const ApplicationTailor = () => {
    const trpc = useTRPC()
    const [allMyData, setAllMyData] = useState<TailoredCVFreeTier | TailoredCVProTier | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { data: user } = useQuery(trpc.getUser.queryOptions())
    const { mutate: tailorCV, isPending: isLoading } = useMutation(trpc.tailorCV.mutationOptions({
        onSuccess: (data) => {
            toast.success('CV tailored successfully')
            setAllMyData(data)
            setError(null)
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Failed to tailor CV. Please try again.'
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }))
    const isPro = user?.isProJobApplicationTailor ?? false
    const [step, setStep] = useState(3)
    const [cvText, setCvText] = useState('')
    const [fileName, setFileName] = useState('')
    const [credential, setCredential] = useState('')
    const [provider, setProvider] = useState<AIProvider>('openai')
    const [jobDescription, setJobDescription] = useState('')
    const [openMoreInfo,setOpenMoreInfo] = useState(false)
    const [moreInfo,setMoreInfo] = useState('')
    const [options, setOptions] = useState<Partial<TailoringOptions>>({
        generateTailoredCv: true,
        generateCoverLetter: false,
        optimizeForATS: true,
        rewriteSummary: true,
        rewriteExperience: true,
        reorderSkills: true,
        emphasizeAchievements: true,
    })


    const handleTailoredCV = async () => {
        setStep(7)
        tailorCV({
            cvText,
            jobDescription,
            credential,
            options: options as TailoringOptions,
            provider,
            moreInfo
        })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || file.type !== 'application/pdf') {
            toast.error("Only upload pdf.")
            return
        }

        setFileName(file.name)
        setCvText('')

        try {
            if (!window.pdfjsLib) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                document.head.appendChild(script);

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });

                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                const pageText = textContent.items
                    .map((item: { str: string }) => item.str)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                fullText += pageText + '\n\n';
            }

            setCvText(fullText.trim() || 'No text content found in PDF.');
        } catch {
            toast.error("Failed to extract text from PDF. Try using dummy data instead.")
        }
    }

    return (
      <DotPattern
       layout="section"
       vignette={false}
       className="border-b border-violet-200/40 bg-gradient-to-br from-white via-violet-50/50 to-indigo-100/35 dark:border-white/10 dark:from-zinc-950 dark:via-purple-950/25 dark:to-zinc-900"
       baseColor="#a1a1aa"
       glowColor="#7c3aed"
       gap={20}
       dotSize={2}
       proximity={110}
       glowIntensity={0.85}
       waveSpeed={0.35}
     >
        <ApplicationTailorHeader/>
         <div className='container mx-auto min-h-screen my-10'>
            <div className='flex justify-between gap-5 flex-col md:flex-row items-center mb-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/services/job-application-tailor">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>New Application</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='bg-gray-200 p-2 rounded-md'>
                    <div className='flex items-center justify-center gap-2 flex-wrap'>
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-violet-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                1
                            </div>
                            <span className="font-medium hidden sm:inline">Upload CV</span>
                        </div>
                        <ArrowRight className={`${step >= 2 ? 'text-violet-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-violet-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                2
                            </div>
                            <span className="font-medium hidden sm:inline">Credential</span>
                        </div>
                        <ArrowRight className={`${step >= 3 ? 'text-violet-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-violet-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                3
                            </div>
                            <span className="font-medium hidden sm:inline">Job Description</span>
                        </div>
                        <ArrowRight className={`${step >= 4 ? 'text-violet-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-violet-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 4 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                4
                            </div>
                            <span className="font-medium hidden sm:inline">Customization</span>
                        </div>
                        <ArrowRight className={`${step >= 7 ? 'text-violet-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 7 ? 'text-violet-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 5 ? 'bg-violet-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                5
                            </div>
                            <span className="font-medium hidden sm:inline">Finalization</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Steps */}

            {/* Step 1 */}
            {step === 1 && (
                <UploadCV
                    cvText={cvText}
                    setStep={setStep}
                    fileName={fileName}
                    handleFileUpload={handleFileUpload}
                />
            )}

            {/* Step 2 */}
            {step === 2 && (
                <CredentialSelection
                    credential={credential}
                    setCredential={setCredential}
                    provider={provider}
                    setProvider={setProvider}
                    setStep={setStep}
                />
            )}

            {/* Step 3 */}
            {step === 3 && (
                <JobDescription
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    setStep={setStep}
                />
            )}

            {/* Step 4 - Pro Customization */}
            {step === 4 && isPro && (
                <ProCustomization
                    setStep={setStep}
                    options={options}
                    setOptions={setOptions}
                    moreInfo={moreInfo}
                    setMoreInfo={setMoreInfo}
                    openMoreInfo={openMoreInfo}
                    setOpenMoreInfo={setOpenMoreInfo}
                />
            )}

            {/* Step 4 - Free Customization (shown as step 4 for free users, but internally step 4) */}
            {step === 4 && !isPro && (
                <FreeCustomization
                    setStep={setStep}
                    options={options}
                    setOptions={setOptions}
                />
            )}

            {/* Step 5 - Pro users continue to tailoring (step 5) */}
            {step === 5 && isPro && (
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <h1 className="text-4xl font-bold mb-4">Ready to Tailor</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Your CV will be tailored based on your selected options. This step will be implemented next.
                    </p>
                    <div className="border rounded-xl p-6 bg-white shadow-sm">
                        <pre className="text-sm">{JSON.stringify(options, null, 2)}</pre>
                    </div>
                    <div className='flex justify-between mt-5'>
                        <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                        <Button className="bg-violet-600" onClick={() => handleTailoredCV()}>
                            Tailor Now
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 5 - Free users continue to tailoring (step 6) */}
            {step === 6 && !isPro && (
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <h1 className="text-4xl font-bold mb-4">Ready to Tailor</h1>
                    <p className="text-gray-500 text-lg mb-8">
                        Your CV will be tailored based on your selected options. This step will be implemented next.
                    </p>
                    <div className="border rounded-xl p-6 bg-white shadow-sm">
                        <pre className="text-sm">{JSON.stringify(options, null, 2)}</pre>
                    </div>
                    <div className='flex justify-between mt-5'>
                        <Button variant="outline" onClick={() => setStep(4)}>
                            Back
                        </Button>
                        <Button className="bg-violet-600" onClick={() => handleTailoredCV()}>
                            Tailor Now
                        </Button>
                    </div>
                </div>
            )}

            {step === 7 && (
                <div>
                    {isLoading && !error && !allMyData ? (
                        <div className="text-center py-12">
                            <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300, margin: '0 auto' }} />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
                                Tailoring Your CV...
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Our AI is optimizing your CV for the job description. This may take a moment.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Tailoring Failed</h3>
                            <p className="text-red-700 dark:text-red-300 mb-6 max-w-md mx-auto">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={() => {
                                        setError(null)
                                        handleTailoredCV()
                                    }}
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => {
                                        setStep(4)
                                        setError(null)
                                        setAllMyData(null)
                                    }}
                                    variant="outline"
                                >
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    ) : allMyData ? (
                        <TailoredResult
                            data={allMyData}
                            isPro={isPro}
                            onReset={() => {
                                setStep(1)
                                setAllMyData(null)
                                setError(null)
                                setCvText('')
                                setFileName('')
                                setJobDescription('')
                                setCredential('')
                                setProvider('openai')
                                setOptions({
                                    generateTailoredCv: true,
                                    generateCoverLetter: false,
                                    optimizeForATS: true,
                                    rewriteSummary: true,
                                    rewriteExperience: true,
                                    reorderSkills: true,
                                    emphasizeAchievements: true,
                                })
                            }}
                        />
                    ) : null}
                </div>
            )}
        </div>
         </DotPattern>
    )
}

