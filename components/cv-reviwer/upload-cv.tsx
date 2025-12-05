import { ArrowRight, CheckCircle, FileText, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";


interface UploadCVProps {
  cvText: string;
  setStep: Dispatch<SetStateAction<number>>;
  useDummyCV: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileName: string;
}

export const UploadCV = ({ fileName,cvText, setStep, useDummyCV, handleFileUpload }: UploadCVProps) => {
    return (
        <div className='space-y-6'>
            <div className='text-center'>
                <FileText className='w-12 h-12 text-teal-600 mx-auto mb-4' />
                <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                    Step 1: Upload your CV
                </h2>
                <p className='text-gray-600'>
                    Upload your CV/Resume in PDF format
                </p>
            </div>

            <Label className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-teal-300 rounded-xl cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='w-12 h-12 text-teal-500 mb-3' />
                    <p className='mb-2 text-sm text-gray-700'>
                        <span className='font-semibold'>Click to upload</span>
                    </p>
                    <p className='text-xs text-gray-500'>PDF files only</p>
                </div>
                <Input
                    type='file'
                    className='hidden'
                    accept=".pdf,applicaiton/pdf"
                    onChange={handleFileUpload}
                />
            </Label>

            <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Or try with sample data</p>
                <button
                    onClick={useDummyCV}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Use Dummy CV Data
                </button>
            </div>

            {cvText && (
                <div className="space-y-4 mb-10">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-green-900">CV Uploaded Successfully!</p>
                            <p className="text-sm text-green-800">{fileName || 'Dummy CV data loaded'}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto border border-gray-200">
                        <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                            {cvText}
                        </pre>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-10"
                    >
                        Next: Add Job Description
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

        </div>
    )
}