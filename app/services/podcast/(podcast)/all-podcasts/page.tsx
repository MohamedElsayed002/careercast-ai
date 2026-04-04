import { Suspense } from "react"
import { caller } from "@/trpc/server"
import { PodcastList } from "@/components/podcast/podcast-list"
import { Music2 } from "lucide-react"
import { PodcastsLoader } from "@/components/loader"
import type { Metadata } from "next";
import Header from "@/components/header"
import { PodcastSearch } from "@/components/all-podcasts/podcast-search"
import { PodcastPagination } from "@/components/all-podcasts/podcast-pagination"

export const metadata: Metadata = {
    title: "Podcastr | All Podcasts Page",
    description: "All podcasts"
};


interface AllPodcastPageProps {
    searchParams: Promise<{
        page?: string
        search?: string
    }>
}

const AllPodcastPageContent = async ({ searchParams }: AllPodcastPageProps) => {
    const params = await searchParams
    const page = parseInt(params.page || "1", 10)
    const search = params.search || ""

    // Fetch podcasts server-side
    const data = await caller.getPodcastsWithPagination({
        page,
        limit: 6,
        search,
    })

    // Convert Date objects to strings for PodcastList component
    const podcasts = data.podcasts.map((podcast) => ({
        ...podcast,
        createdAt: podcast.createdAt.toISOString(),
    }))
    const totalPages = data.totalPages
    const total = data.total

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
            <Header/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            All Podcasts
                        </h1>
                        <p className="text-lg text-white max-w-2xl mx-auto mb-6">
                            Discover amazing podcasts created by our community. Listen, read, and download your favorites.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <Suspense fallback={<div className="max-w-2xl mx-auto mb-8 h-12" />}>
                        <PodcastSearch />
                    </Suspense>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Music2 className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-200">
                            {total} {total === 1 ? "Podcast" : "Podcasts"} {search ? "found" : "available"}
                        </span>
                    </div>

                    {/* Podcast Grid */}
                    <div className="mb-12 min-h-[400px]">
                        {podcasts.length > 0 ? (
                            <PodcastList podcasts={podcasts.map((podcast) => ({
                                ...podcast,
                                title: podcast.title ?? "", 
                            }))} />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                                    <div className="relative size-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-5xl animate-bounce">
                                        🎙️
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {search ? "No podcasts found" : "No podcasts yet!"}
                                    </h3>
                                    <p className="text-gray-300">
                                        {search
                                            ? "Try adjusting your search query"
                                            : "Create your first podcast and watch it appear here ✨"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <PodcastPagination currentPage={page} totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}

const AllPodcastPage = async (props: AllPodcastPageProps) => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    All Podcasts
                                </h1>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <AllPodcastPageContent {...props} />
        </Suspense>
    )
}

export default AllPodcastPage
