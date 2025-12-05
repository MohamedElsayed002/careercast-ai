import Link from "next/link"
import { Button } from "../ui/button"


export const HeroReviewer = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center text-center space-y-6 -mt-[90px]'>
            <h1 className='text-5xl md:text-7xl  font-bold max-w-3xl px-6 md:px-8'>Create Amazing CV Matches</h1>
            <p className='text-gray-400 text-md px-6 md:px-8'>Our AI analyzes your CV against any job description to give you a detailed 
                match report and suggestions for improvement 
            </p>
            <div className='flex gap-5'>
                <Button className='bg-teal-600 hover:bg-teal-400' asChild>
                    <Link href="/reviewer/cv-reviewer">
                        Review my CV
                    </Link>
                </Button>
                <Button variant='link'>See demo</Button>
            </div>
            <p className='text-gray-400 text-md'>Trusted by 10,000+ professionals worldwide (hwa klam bflos)</p>
        </div>
    )
}