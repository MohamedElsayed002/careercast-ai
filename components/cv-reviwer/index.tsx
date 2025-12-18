"use client";

import { DummyCVText, DummyJobDescription } from "@/lib/constants";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UploadCV } from "./upload-cv";
import { JobDescription } from "./job-description";
import { CVReviewProTier } from "@/actions/cv-reviewer";
import { CVAnalysis } from "./cv-analysis";
import { CredentialSelection } from "./credential-selection";

export type AIProvider = 'openai' | 'gemini';

export const CVReviewer = () => {
    const [step, setStep] = useState(1);
    const [cvText, setCvText] = useState('');
    const [fileName, setFileName] = useState('');
    const [credential, setCredential] = useState('');
    const [provider, setProvider] = useState<AIProvider>('openai');
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState<Partial<CVReviewProTier> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            toast.error("Only upload pdf.")
            return;
        }

        setFileName(file.name);
        setCvText('');

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
                    .map(item => item.str)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                fullText += pageText + '\n\n';
            }

            setCvText(fullText.trim() || 'No text content found in PDF.');
        } catch {
            toast.error("Failed to extract text from PDF. Try using dummy data instead.")
        }
    };

    const useDummyCV = () => {
        setCvText(DummyCVText)
    }

    const useDummyJobDescription = () => {
        setJobDescription(DummyJobDescription)
    }


    const reset = () => {
        setStep(1)
        setCvText('')
        setFileName('')
        setCredential('')
        setProvider('openai')
        setJobDescription('')
        setAnalysis(null)
        setError(null)
        setIsLoading(false)
    }

    return (
        <div className='min-h-screen grid place-items-center'>
            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-20 h-20 bg-teal-600 rounded-2xl mb-4 shadow-lg'>
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        AI CV Reviewer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload your CV, select credential, paste the job description, and get instant AI-powered feedback
                    </p>
                </div>

                {/* Progress steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                1
                            </div>
                            <span className="font-medium hidden sm:inline">Upload CV</span>
                        </div>
                        <ArrowRight className={`${step >= 2 ? 'text-teal-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                2
                            </div>
                            <span className="font-medium hidden sm:inline">Credential</span>
                        </div>
                        <ArrowRight className={`${step >= 3 ? 'text-teal-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                3
                            </div>
                            <span className="font-medium hidden sm:inline">Job Description</span>
                        </div>
                        <ArrowRight className={`${step >= 4 ? 'text-teal-600' : 'text-gray-400'} hidden sm:block`} />
                        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                4
                            </div>
                            <span className="font-medium hidden sm:inline">AI Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Steps */}

                {/* Step 1 */}
                {step === 1 && (
                    <UploadCV
                        handleFileUpload={handleFileUpload}
                        useDummyCV={useDummyCV}
                        fileName={fileName}
                        cvText={cvText}
                        setStep={setStep}
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
                        cvText={cvText}
                        jobDescription={jobDescription}
                        setJobDescription={setJobDescription}
                        setStep={setStep}
                        useDummyJob={useDummyJobDescription}
                        setAnalysis={setAnalysis}
                        credential={credential}
                        provider={provider}
                        setError={setError}
                        setIsLoading={setIsLoading}
                        key={step}
                    />
                )}

                {/* Step 4 */}
                {step === 4 && (
                    <CVAnalysis
                        analysis={analysis}
                        error={error}
                        isLoading={isLoading}
                        reset={reset}
                        onRetry={() => setStep(3)}
                    />
                )}
            </div>
        </div>
    );
};
