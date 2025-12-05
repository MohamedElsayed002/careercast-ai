import Link from "next/link"
import { Button } from "../ui/button"


export const ActionSection = () => {
    return (
        <div className='max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-4 my-48 px-6 md:px-0 '>
            <h1 className='text-center text-5xl md:text-7xl font-bold'>
                Ready to Level Up Your English and Career?
            </h1>
            <div className='flex gap-5'>
                <Button asChild>
                    <Link href="/podcast">
                        Generate Podcast
                    </Link>
                </Button>
                <Button className='bg-indigo-600 text-white cursor-pointer' asChild>
                    <Link href="/reviewer">Review My CV</Link>
                </Button>
            </div>
            <div className='flex gap-5 text-gray-400'>
                <span>Powered by GPT-5 </span>
                <span>Instant Generation</span>
            </div>
        </div>
    )
}