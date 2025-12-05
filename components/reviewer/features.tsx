import { Brain, ListChecks, Verified } from "lucide-react"


export const Features = () => {
    return (
        <div id='features' className='container mx-auto flex flex-col items-center justify-center space-y-4 my-32'>
            <p className="text-xl md:text-2xl text-center text-teal-600 font-semibold">
                Features
            </p>

            <h1 className="text-3xl md:text-6xl text-center font-bold max-w-3xl">
                Everything you need to succeed
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 my-10 px-6'>
                <div className='border p-5 space-y-3 rounded-md shadow-lg'>
                    <Brain className='text-teal-600 size-8' />
                    <h1 className='text-2xl md:text-3xl font-bold'>AI-Powered Suggestions</h1>
                    <p className='text-gray-400 font-medium'>
                        Get Specific, actionable advice on how to rephrase bullet
                        points and add missing skills to make your CV stand out.
                    </p>
                </div>
                <div className='border p-5 space-y-3 rounded-md shadow-lg'>
                    <ListChecks className='text-teal-600 size-8' />
                    <h1 className='text-2xl md:text-3xl font-bold'>Keyword Matching</h1>
                    <p className='font-medium text-gray-400'>
                        Our tool scans the job description for key 
                        terms and shows you exactly which ones are missing
                        from your CV
                    </p>
                </div>
                <div className='border p-5 space-y-3 rounded-md shadow-lg'>
                    <Verified className='text-teal-600 size-8' />
                    <h1 className='text-2xl md:text-3xl font-bold'>ATS Compatibility Score</h1>
                    <p className='font-medium text-gray-400'>
                        Ensure your CV get past automated 
                        screeners with a compatibility score and formatting tips
                    </p>
                </div>
            </div>
        </div>
    )
}
