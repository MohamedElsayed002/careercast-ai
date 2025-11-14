"use client"

import { ArrowRight, Mic, Music2 } from "lucide-react"
import { PodcastList } from "../podcast/podcast-list"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { PodcastsLoader } from "../loader"



export const PodcastSection = () => {

    const trpc = useTRPC()
    const { isLoading, data: recentPodcasts } = useQuery(trpc.getHomePodcast.queryOptions())

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
                <section id="podcasts" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                All Podcasts
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                                Discover amazing podcasts created by our community. Listen, read, and download your favorites.
                            </p>
                        </div>

                        {/* Podcast Grid Loader */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <PodcastsLoader />
                            <PodcastsLoader />
                            <PodcastsLoader />
                            <PodcastsLoader />
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    if (recentPodcasts && recentPodcasts.length === 0) return
    const totalPodcasts = recentPodcasts!.length

    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
            <section id="podcasts" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            All Podcasts
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                            Discover amazing podcasts created by our community. Listen, read, and download your favorites.
                        </p>
                        {totalPodcasts > 0 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                                <Music2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                    {totalPodcasts} {totalPodcasts === 1 ? 'Podcast' : 'Podcasts'} Available
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Podcast Grid */}
                    <div className="mb-12 min-h-[400px]">
                        {isLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                                <PodcastsLoader />
                            </div>
                        )}
                        {totalPodcasts > 0 ? (
                            <PodcastList
                                podcasts={
                                    recentPodcasts
                                        ? recentPodcasts.map((p) => ({
                                            ...p,
                                            title: p.title || '',
                                        }))
                                        : []
                                }
                            />
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 mb-6">
                                    <Mic className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No podcasts yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Be the first to create an amazing podcast!
                                </p>
                                <Button asChild size="lg">
                                    <Link href="/create-podcast">
                                        Create Your First Podcast
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}