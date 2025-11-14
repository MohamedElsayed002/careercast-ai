"use client"

import { PodcastList } from "@/components/podcast/podcast-list"
import { NavButton } from "@/components/ui/nav-button"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"


export function UserLayout() {

    const trpc = useTRPC()
    const {data: user} = useQuery(trpc.getUser.queryOptions())


    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
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
                                Welcome back, <span className="font-semibold text-purple-600">{user?.name}</span>! 🎉
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg">
                                {user?.podcasts.length} {user?.podcasts.length === 1 ? 'Podcast' : 'Podcasts'}
                            </div>
                            {/* Navigate to credentials page */}
                            <div className="bg-white/80 hover:bg-white/90 text-purple-600 font-semibold px-4 py-3 rounded-lg shadow-md border border-purple-200/50 hover:border-purple-300/50">
                                <Link   href="/user/credentials">
                                    View Credentials
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
                            <div className="text-3xl font-bold">{user?.podcasts.length}</div>
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
                            <div className="text-3xl font-bold">{user?.credentials.length}</div>
                            <div className="text-green-100 mt-1">Total Credentials</div>
                        </div>
                    </div>

                    {/* Podcast List */}
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200/50 dark:border-purple-800/50">
                        <PodcastList
                            podcasts={(user?.podcasts ?? []).map(p => ({
                                ...p,
                                title: p.title ?? '(untitled)',
                            }))}
                        />
                    </div>
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

