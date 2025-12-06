import { ActionSection } from "@/components/community/action"
import { CheckCircle, Mic } from "lucide-react"
import { Metadata } from "next";
import Image from "next/image"

export const metadata: Metadata = {
  title: "CareerCast AI | Features",
  description: "CareerCast AI Website features!"
};




const FeaturesPage = () => {
    return (
        <div className='my-10'>
            <div className='space-y-6 text-center  max-w-4xl mx-auto mt-20'>
                <h1 className='text-3xl md:text-6xl font-bold'>
                    Our Platform Features
                </h1>
                <p className='text-gray-400 text-xl'>
                    Discover how our AI-powered tools, can revolutionize your learning and career <br />
                    development, one feature at a time
                </p>
            </div>
            {/* Features */}
            <div className='container mx-auto px-6 flex flex-col my-10'>
                <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-48 my-20'>
                        <div className='flex flex-col space-y-6'>
                            <div className='flex gap-5 items-center'>
                                <div className='bg-blue-100 w-14 h-14 flex items-center rounded-full justify-center'>
                                    <Mic className='text-indigo-600 size-8' />
                                </div>
                                <span className='text-2xl md:text-4xl font-bold'>AI Podcast Generator</span>
                            </div>
                            <p className='text-xl text-gray-400'>
                                Transform any topic into a professional, dual-speaker
                                educational podcast. Ideal for auditory learners and busy
                                professionals looking to master new subjects on the go.
                                Improve your English listening skills natural, engaging conversations
                            </p>
                            <div className='flex gap-3 mb-5'>
                                <CheckCircle className='size-10 text-green-500' />
                                <p className='text-xl'>
                                    <span className='font-bold'>Personalized Content:</span>
                                    Tailor podcasts to your specific interests or study needs, from complex scientific
                                    theories to daily English conversation practice
                                </p>
                            </div>
                            <div className='flex gap-3'>
                                <CheckCircle className='size-10 text-green-500' />
                                <p className='text-xl'>
                                    <span className='font-bold'>Efficient Learning:</span>
                                    Absorb information effortlessly while commuting, exercising, or relaxing.
                                    Our AI ensures clear, and memorable content delivery.
                                </p>
                            </div>
                        </div>
                        <Image
                            src="/cover.png"
                            alt="Feature 1"
                            width={500}
                            height={500}
                            className='rounded-md'
                        />
                    </div>
                    <div className="rounded-xl shadow p-6 border">
                        <h1 className="text-lg font-semibold">User Story</h1>

                        <div className="mt-4 flex gap-4">
                            {/* Left Blue Line */}
                            <div className="w-1 bg-blue-500 rounded"></div>

                            {/* Quote Text */}
                            <div>
                                <p className="text-gray-400 italic">
                                    “As an international student, the AI Podcast Generator has been a game-changer for my
                                    English listening skills. I can create podcasts on topics I actually care about, which makes
                                    learning so much more engaging. My comprehension has improved dramatically!”
                                </p>

                                <p className="mt-3 font-medium">
                                    — Maria, University Student
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-48 my-20'>
                        <Image
                            src="/cover.png"
                            alt="Feature 1"
                            width={500}
                            height={500}
                            className='rounded-md'
                        />
                        <div className='flex flex-col space-y-6'>
                            <div className='flex gap-5 items-center'>
                                <div className='bg-blue-100 w-14 h-14 flex items-center rounded-full justify-center'>
                                    <CheckCircle className='text-indigo-600 size-8' />
                                </div>
                                <span className='text-2xl md:text-4xl font-bold'>AI CV Reviewer</span>
                            </div>
                            <p className='text-xl text-gray-400'>
                                Get a competitive edge in your job search. Our AI analyzes your CV
                                against a specifc job description, providing instant , actionable feedback
                                to highlight your stengths and identify areas for improvment. Apply with confidence
                            </p>
                            <div className='flex gap-3 mb-5'>
                                <CheckCircle className='size-10 text-green-500' />
                                <p className='text-xl'>
                                    <span className='font-bold'>Targeted Feedback:</span>
                                    Receive a detailed breakdown of how well your skills and experience
                                    match the employer&apos;s requirments
                                </p>
                            </div>
                            <div className='flex gap-3'>
                                <CheckCircle className='size-10 text-green-500' />
                                <p className='text-xl'>
                                    <span className='font-bold'>Actionable Recommendations:</span>
                                    Get concrete suggestions for optimizing your CV content, from
                                    keyword integration to impact statement phrasing, to pass through ATS filters
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl shadow p-6 border">
                        <h1 className="text-lg font-semibold">User Story</h1>

                        <div className="mt-4 flex gap-4">
                            {/* Left Blue Line */}
                            <div className="w-1 bg-blue-500 rounded"></div>

                            {/* Quote Text */}
                            <div>
                                <p className="text-gray-400 italic">
                                    “I was struggling to get interviews. The CV Reviewer showed me exactly where my resume 
                                    was falling short for the jobs I wanted. After making suggested changes, I got three interview
                                    invitations in one week. It&apos;s essential tool for any job seeker”

                                </p>
                                <p className="mt-3 font-medium">
                                    — David, Software Engineer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ActionSection/>
        </div>
    )
}

export default FeaturesPage