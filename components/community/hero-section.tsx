import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"



export const HeroCommunity = () => {
    return (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 place-items-center p-10">
            <div className='space-y-4'>
                <h1 className='text-5xl md:text-7xl font-bold '>
                    Master English & Advance Your Career with AI
                </h1>
                <p className='text-xl text-gray-400'>
                    Generate personalized educational podcasts and get expert CV Feedback - all powered
                    by artifical intelligence
                </p>
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
            </div>
            <Image
                src="/community-image.png"
                width={600}
                height={600}
                alt='Hero Image'
                className='rounded-xl'
             />
        </div>
    )
}