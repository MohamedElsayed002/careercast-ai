import { CheckCircle, Mic } from "lucide-react"


export const InfoCommunity = () => {
    return (
        <div className='min-h-screen max-w-5xl mx-auto flex flex-col items-center justify-center space-y-6'>
            <h1 className='text-center text-5xl md:text-7xl font-bold px-5'>
                AI-Powered Tools Accelerate Your Growth
            </h1>
            <p className='text-center text-xl text-gray-400 px-3'>
                Our platform offers two core features designed to give you competitive edge in your
                professional and educational journey.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 mt-10'>
                <div className='p-10 mx-10 rounded-md md:mx-0 border border-indigo-600 flex flex-col space-y-4'>
                    <Mic className='size-10 text-indigo-600 cursor-pointer'/>
                    <h1>AI Podcast Generator</h1>
                    <p>
                        Simply provide a topic and our AI generates a complete 
                        educational podcast with natural dialogue between two speakers,
                        plus a custom thumbnail, Perfect for English learners at any level
                    </p>
                </div>
                <div className='p-10 mx-10 rounded-md md:mx-0 border border-indigo-600 flex flex-col space-y-4'>
                    <CheckCircle className='size-10 text-indigo-600 cursor-pointer'/>
                    <h1>AI CV Reviewer</h1>
                    <p>
                        Upload your CV and job description. Get detailed AI-powered 
                        feedback comparing your qualifications and actionable recommendations,
                        Helps candidates know if they&apos;re ready to apply
                    </p>
                </div>
            </div>
        </div>
    )
}