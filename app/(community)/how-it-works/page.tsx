import { ActionSection } from "@/components/community/action"
import { BrainCircuit, CheckCircle } from "lucide-react"
import { Metadata } from "next";
import Image from "next/image"

export const metadata: Metadata = {
  title: "CustomCareer AI | How it works",
  description: "How the website works!"
};



const Page = () => {
    return (
        <div className='my-10'>
            <div className='space-y-6 text-center  max-w-4xl mx-auto px-6'>
                <h1 className='text-3xl md:text-6xl font-bold'>
                    A Simple Path to Success
                </h1>
                <p className='text-gray-400 text-xl'>
                    Our Platform is designed for simplicity and power. Follow these three steps to
                    generate personalized educational content and career tools in minutes
                </p>
            </div>

            {/* Steps */}
            <div className='container mx-auto flex flex-col px-6 my-10'>

                {/* Step 1 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-48 my-20'>
                    <div className='flex flex-col space-y-6'>
                        <div className='flex gap-5 items-center'>
                            <div className='bg-blue-100 w-14 h-14 flex items-center rounded-full justify-center'>
                                <span className='text-indigo-600 text-xl font-bold'>1</span>
                            </div>
                            <span className='text-2xl md:text-4xl font-bold'>Provide Your Input</span>
                        </div>
                        <p className='text-xl text-gray-400'>
                            Your journey begins with a simple action. Whether you&apos;re
                            looking to create an educational podcast or get feedback on your CV,
                            all you need to do is provide the initial material. This is where you tell our AI
                            what you need
                        </p>
                        <div className='flex gap-5 mb-5'>
                            <CheckCircle className='size-8 text-green-500' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">User&apos;s Action</p>
                                <p className='text-gray-400 font-medium'>
                                    For a podcast, enter a topic. For a CV Review, upload your
                                    CV and the relevant job description.
                                </p>
                            </div>
                        </div>
                        <div className='flex'>
                            <BrainCircuit className='size-8 text-indigo-600 mr-5' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">AI&apos;s Process</p>
                                <p className='text-gray-400 font-medium'>
                                    The AI parses your input, identifying key concept,
                                    requirments, and  the core intent of your request
                                </p>
                            </div>
                        </div>
                    </div>
                    <Image
                        src="/first-image.png"
                        alt="Feature 1"
                        priority
                        width={500}
                        height={500}
                        className='rounded-md'
                    />
                </div>

                {/* Step 2 */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-48 my-20'>
                    <div className='flex flex-col space-y-6'>
                        <div className='flex gap-5 items-center'>
                            <div className='bg-blue-100 w-14 h-14 flex items-center rounded-full justify-center'>
                                <span className='text-indigo-600 text-xl font-bold'>2</span>
                            </div>
                            <span className='text-2xl md:text-4xl font-bold'>AI Analyzes & Generates</span>
                        </div>
                        <p className='text-xl text-gray-400'>
                            This is where the magic happens. Our advanced AI models get to work, 
                            transforming your simple input into rich, high-quality content. The process
                            is fully automated and takes just moments to complete
                        </p>
                        <div className='flex gap-5 mb-5'>
                            <CheckCircle className='size-8 text-green-500' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">User&apos;s Action</p>
                                <p className='text-gray-400 font-medium'>
                                    Simply wait a few seconds while the generation process
                                    completes. You can see the progress in real-time
                                </p>
                            </div>
                        </div>
                        <div className='flex'>
                            <BrainCircuit className='size-8 text-indigo-600 mr-5' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">AI&apos;s Process</p>
                                <p className='text-gray-400 font-medium'>
                                   For podcasts, it scripts a dialogue, generates natural-sounding 
                                   voices, and creates a thumbnail For CVs, it cross-references your skills
                                   with the job description to provide actionable feedback
                                </p>
                            </div>
                        </div>
                    </div>
                    <Image
                        src="/second-image.png"
                        alt="Feature 2"
                        priority
                        width={500}
                        height={500}
                        className='rounded-md'
                    />
                </div>

                {/* Step 3 */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-48 my-20'>
                    <div className='flex flex-col space-y-6'>
                        <div className='flex gap-5 items-center'>
                            <div className='bg-blue-100 w-14 h-14 flex items-center rounded-full justify-center'>
                                <span className='text-indigo-600 text-xl font-bold'>3</span>
                            </div>
                            <span className='text-2xl md:text-4xl font-bold'>Download & Use</span>
                        </div>
                        <p className='text-xl text-gray-400'>
                            Your personalized materials are now ready. Access your generated
                            content instantly and start using it to improve your English Skills,
                            prepare for job interviews, and advance your career
                        </p>
                        <div className='flex gap-5 mb-5'>
                            <CheckCircle className='size-8 text-green-500' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">User&apos;s Action</p>
                                <p className='text-gray-400 font-medium'>
                                    Download the podcast audio file,read the transcript, or 
                                    review your detailed CV analysis. The content is yours to keep 
                                    and use
                                </p>
                            </div>
                        </div>
                        <div className='flex'>
                            <BrainCircuit className='size-8 text-indigo-600 mr-5' />
                            <div className='flex flex-col'>
                                <p className="text-2xl font-bold">AI&apos;s Process</p>
                                <p className='text-gray-400 font-medium'>
                                    The AI complies all generated assests into a clean, easy-to-use 
                                    format. It ensures all deliverable are high-quality and ready
                                    for immediate application
                                </p>
                            </div>
                        </div>
                    </div>
                    <Image
                        src="/third-image.png"
                        alt="Feature 3"
                        priority
                        width={500}
                        height={500}
                        className='rounded-md'
                    />
                </div>
            </div>
            <ActionSection/>
        </div>
    )
}

export default Page