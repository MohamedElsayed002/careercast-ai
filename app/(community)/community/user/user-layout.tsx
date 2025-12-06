"use client"

import { PodcastsLoader } from "@/components/loader"
import { PodcastListUser } from "@/components/podcast/podcast-list-user"
import { NavButton } from "@/components/ui/nav-button"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Loader, PlusIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"


export function UserLayout() {

    const trpc = useTRPC()
    const { data: user, isPending } = useQuery(trpc.getUser.queryOptions())

    if(!user) {
        notFound()
    }


    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}

            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                    {/* Header */}
                    <div className="flex-col md:flex-row flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <NavButton href="/" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                    ← Back Home
                                </NavButton>
                            </div>
                            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 bg-clip-text text-transparent">
                                Your Podcasts
                            </h1>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                {
                                    isPending ? <Loader className='inline-block size-4 animate-spin' /> : (
                                        <>
                                            <p>Welcome back, <span className="font-semibold text-purple-600">{user?.name}</span>! 🎉 </p>
                                        </>
                                    )
                                }
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg">
                                {
                                    isPending ? <Loader className='inline-block size-4 animate-spin' />
                                        :
                                        user?.podcasts.length} {user?.podcasts.length === 1 ? 'Podcast' : 'Podcasts'
                                }
                            </div>
                            {/* Navigate to credentials page */}
                            <div className="bg-white/80 hover:bg-white/90 text-purple-600 font-semibold px-4 py-3 rounded-lg shadow-md border border-purple-200/50 hover:border-purple-300/50">
                                <Link className="flex items-center gap-1" href="/community/credentials">
                                    <PlusIcon className="size-4" />
                                    Add Credentials
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
                            {
                                isPending ? <Loader className='inline-block size-4 animate-spin' /> : (
                                    <div className="text-3xl font-bold">{user?.podcasts.length}</div>
                                )
                            }
                            <div className="text-purple-100 mt-1">Total Podcasts</div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-2xl shadow-xl text-white">
                            <div className="text-3xl font-bold">🎙️</div>
                            <div className="text-cyan-100 mt-1">Audio Files</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl shadow-xl text-white">
                            <div className="text-3xl font-bold">📄</div>
                            <div className="text-yellow-100 mt-1">PDF Summaries</div>
                        </div>
                        {/* Total Credentials */}
                        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl shadow-xl text-white">
                            {
                                isPending ? <Loader className='inline-block size-4 animate-spin' /> : (
                                    <div className="text-3xl font-bold">{user?.credentials.length}</div>
                                )
                            }
                            <div className="text-green-100 mt-1">Total Credentials</div>
                        </div>
                    </div>

                    {/* Podcast List */}
                    {!isPending && (
                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200/50 dark:border-purple-800/50">
                            <PodcastListUser
                                podcasts={(user?.podcasts ?? []).map(p => ({
                                    ...p,
                                    title: p.title ?? '(untitled)',
                                    status: p.status ?? "PRIVATE"
                                }))}
                            />
                        </div>
                    )}
                    
                    {/* Loading Podcast */}
                    {isPending && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <PodcastsLoader />
                            <PodcastsLoader />
                            <PodcastsLoader />
                            <PodcastsLoader />
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    )
}

