import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { AuroraBackground } from "./aurora"
import FlipWords from "./flip-words"
import { Header } from "./header"

export const HeroCommunity = () => {
    const flipWords = ["Speak", "Learn", "Grow"]

    return (
        <AuroraBackground
            animationSpeed={18}
            className="min-h-[calc(100vh-4rem)] items-stretch justify-start bg-white/95 px-0 pb-12 pt-0 dark:bg-zinc-950/95"
        >
            <div className="relative z-20 w-full shrink-0">
                <Header />
            </div>
            <div className="container relative z-10 mx-auto flex flex-1 flex-col justify-center px-4 md:px-6">
                <div className="grid max-w-3xl mx-auto grid-cols-1 place-items-center gap-10 text-center md:gap-10">
                    <div className='space-y-4'>
                        <h1 className='text-5xl font-bold leading-tight md:text-7xl'>
                            <FlipWords words={flipWords} className="px-0 text-teal-400" />
                            smarter English.
                            <br />
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-300'>
                            Generate personalized educational podcasts and get expert CV Feedback - all powered
                            by artifical intelligence
                        </p>
                        <div className='flex flex-wrap justify-center text-center items-center gap-5'>
                            <Button className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white" asChild>
                                <Link href="/services/podcast">
                                    Generate Podcast
                                </Link>
                            </Button>
                            <Button className='bg-teal-600 text-white cursor-pointer' asChild>
                                <Link href="/services/reviewer">Review My CV</Link>
                            </Button>
                            <Button className="bg-orange-600 text-white cursor-pointer" asChild>
                                <Link href="/services/job-application-tailor">
                                    Tailor My Application
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {/* <Image
                        src="/community-image.png"
                        width={600}
                        height={600}
                        priority
                        alt='Hero Image'
                        className='rounded-xl'
                    /> */}
                </div>
            </div>
        </AuroraBackground>
    )
}
