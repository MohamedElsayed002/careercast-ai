import { PodcastSection } from "@/components/home/podcast-section";
import { PodcastsLoader } from "@/components/loader";
import { ShareButtons } from "@/components/share-buttons"
import { SummaryScript } from "@/components/summary-script"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { caller } from "@/trpc/server"
import { Badge, Music2, Podcast } from "lucide-react";
import Image from "next/image"
import Link from "next/link";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params) {
    const data = await caller.singlePodcast({ id: params.id })
    return {
        title: data.title,
        description: data?.message || "Podcast description not available"
    }
}

const Page = async ({ params }: { params: { id: string } }) => {
    const data = await caller.singlePodcast({ id: params.id })
    const podcasts = await caller.getHomePodcast()
    const formatDate = (dateInput: string | Date) => {
        if (!dateInput) return ''
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }



    return (
        <div className='p-10 bg-white'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Title Section */}
                <h1 className='text-4xl md:text-5xl font-serif font-bold text-black mb-6 italic'>
                    {data.title}
                </h1>

                {/* Subtitle/Description */}
                <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
                    {data.message}
                </p>

                {/* Audio Player and Share Section */}
                <div className='flex items-center justify-between py-6 border-y border-gray-200 mb-8'>
                    {/* Audio Player */}
                    <div className='flex items-center gap-4 flex-1'>
                        {data.audioUrl && (
                            <audio
                                controls
                                className='w-full max-w-md'
                                preload='metadata'
                            >
                                <source src={data.audioUrl} type='audio/mpeg' />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>

                    {/* Share Buttons */}
                    <div className='flex items-center gap-4 ml-4'>
                        <ShareButtons
                            podcastId={data.id}
                            title={data.title ?? ""}
                            key={data.id}
                        />
                    </div>
                </div>

                {/* Full Width Image */}
                <section className='relative w-full h-[400px] md:h-[600px] mb-8'>
                    <Image
                        src={data.imageUrl ?? ""}
                        fill
                        sizes='100vw'
                        alt={data.title ?? ""}
                        className='object-cover rounded-lg'
                        priority
                    />
                </section>

                {/* Additional Content Section */}
                <section className='prose prose-lg max-w-none'>
                    {/* Metadata */}
                    <div className='flex items-center gap-4 text-sm text-gray-500 mb-6'>
                        <span>{formatDate(data.createdAt)}</span>
                        <span>•</span>
                        <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
                            {data.status}
                        </span>
                    </div>

                    {/* PDF Link */}
                    {data.pdfUrl && (
                        <a
                            href={data.pdfUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                            View Full Transcript (PDF)
                        </a>
                    )}

                    {/* Add more content sections here as needed */}
                    <SummaryScript
                        podcastScriptDialogue={Array.isArray(data.podcastScriptDialogue) ? data.podcastScriptDialogue : []}
                        podcastSummaryConclusion={data.podcastSummaryConclusion ?? ""}
                        podcastSummaryKeyPoints={data.podcastSummaryKeyPoints ?? []}
                        podcastSummaryOverview={data.podcastSummaryOverview ?? ""}
                    />
                </section>
            </div>
            <hr className="mt-10 w-4/5 mx-auto" />
            <div className="max-w-4xl mx-auto">
                <h1 className='text-4xl md:text-5xl font-serif font-bold text-black mt-10 mb-3 italic'>Latest Podcasts </h1>
                <div className='grid grid-cols-1 md:grid-cols-3  gap-6'>
                    {podcasts.map((p, idx) => {
                        const created = new Date(p.createdAt);
                        const dateLabel = created.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                        if (p.id === params.id) return
                        return (
                            <div
                                key={p.id}
                                className="group relative"
                            >
                                {/* Glow effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300`} />

                                <Card className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
                                    {/* Image Header */}
                                    {p.imageUrl && (
                                        <Link className="cursor-pointer" href={`/community/podcast/${p.id}`}>
                                            <div className="relative w-full h-48 overflow-hidden">
                                                <Image
                                                    src={p.imageUrl}
                                                    alt={p.message}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <CardTitle className="text-lg leading-6 line-clamp-2 font-bold text-white drop-shadow-lg">
                                                        {p.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Page