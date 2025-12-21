import { ArrowRight, CheckCircle, FileText, CloudUpload, Upload, Lock } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";

interface UploadCVProps {
    cvText: string;
    setStep: Dispatch<SetStateAction<number>>
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    fileName: string
}

const UploadCV = ({ fileName, cvText, setStep, handleFileUpload }: UploadCVProps) => {
    return (
        <div className="space-y-4 border bg-gray-100 p-5 rounded-md">
            <div className="space-y-3">
                <h1 className="text-4xl font-bold">Let&apos;s start with your Resume</h1>
                <h2 className='text-xl font-medium text-gray-400'>Upload your existing CV so our AI can analyze your experience</h2>
                <div className='inline-block p-2 rounded-2xl bg-green-400 text-green-700'>
                    <Lock className="w-5 h-5 text-white inline-block mr-1" />
                    <span className="text-sm font-medium text-white">Your CV is securely processed and never stored.</span>
                </div>
            </div>

            <label className="block cursor-pointer">
                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition">
                    <CloudUpload className="mx-auto w-12 h-12 text-gray-400" />

                    <p className="text-black text-3xl font-bold mt-4">
                        Click to browse
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        PDF files only
                    </p>

                    <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </label>

            {cvText && (
                <div className='space-y-4 mb-10'>
                    <div className='p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3'>
                        <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                        <div>
                            <p className='text-sm font-semibold text-green-900'>CV Uploaded Successfully!</p>
                            <p className='text-sm text-green-800'>{fileName || 'No File Name'}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <pre className="whitespace-pre-wrap text-xs text-gray-700 dark:text-gray-300 font-mono">
                            {cvText}
                        </pre>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className='w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-10'
                    >
                        Proceed to Credential <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    )
}
export default UploadCV