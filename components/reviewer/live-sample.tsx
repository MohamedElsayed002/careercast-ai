import { Check } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"


export const LiveSample = () => {
    return (
        <div className='container mx-auto p-10 grid grid-cols-1 md:grid-cols-2'>
            <Image
                src="/sample-1.png"
                width={500}
                height={500}
                priority
                className='object-cover rounded-md -mt-20 mx-auto'
                alt='sample-1'
            />
            <div className='max-w-4xl mx-auto flex flex-col space-y-6 mt-10'>
                <p className='text-xl md:text-2xl text-teal-600 font-semibold'>Live sample</p>
                <h1 className='text-3xl md:text-6xl font-bold'>See your results in action</h1>
                <p className='text-gray-400 text-md'>Our detailed report goes beyond a simple score. We provide
                    actionable insights to help your CV for each application,
                    increasing your chances of landing an interview
                </p>
                <div className="space-y-6">

                    {/* Item 1 */}
                    <div className="flex items-center gap-5">
                        <div className="bg-teal-600 rounded-full p-3 flex justify-center items-center">
                            <Check className="text-white w-6 h-6" />
                        </div>
                        <p className="text-gray-800">
                            Identify critical skills gaps instantly.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-5">
                        <div className="bg-teal-600 rounded-full p-3 flex justify-center items-center">
                            <Check className="text-white w-6 h-6" />
                        </div>
                        <p className="text-gray-800">
                            Optimize keywords for Applicant Tracking System (ATS).
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-5">
                        <div className="bg-teal-600 rounded-full p-3 flex justify-center items-center">
                            <Check className="text-white w-6 h-6" />
                        </div>
                        <p className="text-gray-800">
                            Get AI-Powered suggestions to strengthen your CV.
                        </p>
                    </div>
                </div>
                <Button size='sm' className='bg-teal-200 text-teal-600' asChild>
                    <Link href="/services/reviewer/cv-reviewer">Try Sample</Link>
                </Button>
            </div>
        </div>
    )
}

