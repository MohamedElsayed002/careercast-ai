"use client"
import { authClient } from "@/utils/auth-client"
import Link from "next/link"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription"
import { Mic, LogOut, Crown, LogIn } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

const Header = () => {
    const trpc = useTRPC()
    const { data: user } = useQuery(trpc.getUser.queryOptions())
    const { data } = authClient.useSession()
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription()
    const userName = data?.user?.name || data?.user?.email?.split('@')[0] || 'User'
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <header className="top-0 z-50 w-full   bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href='/' className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Podcastr
                        </h1>
                    </Link>

                    {/* Navigation & Auth */}
                    <div className="flex items-center gap-3">
                        {data ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                                            <Avatar className="h-8 w-8 border-2 border-white/30">
                                                <AvatarImage src={data.user?.image || undefined} alt={userName} />
                                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-semibold">
                                                    {userInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden md:block">
                                                <p className="text-sm font-medium text-white">{userName}</p>
                                                {user?.isPro && hasActiveSubscription && !isLoading && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Crown className="w-3 h-3 text-yellow-300" />
                                                        <span className="text-xs text-white/80">Pro Member</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            <Link href='/user'>My account</Link>
                                        </DropdownMenuLabel>
                                        { !user?.isPro && !isLoading && (
                                            <DropdownMenuItem>
                                                <h1
                                                    onClick={() => authClient.checkout({ slug: "pro" })}
                                                    className='cursor-pointer'
                                                >
                                                    <span className="hidden sm:inline">Upgrade</span>
                                                </h1>
                                            </DropdownMenuItem>
                                        )}
                                        {
                                            user?.isPro && hasActiveSubscription && !isLoading && (
                                                <DropdownMenuItem>
                                                    <h1
                                                        onClick={() => authClient.customer.portal()}
                                                        className="cursor-pointer"
                                                    >
                                                        <span className="hidden sm:inline">Portal</span>
                                                    </h1>
                                                </DropdownMenuItem>
                                            )
                                        }
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => authClient.signOut()}
                                                    variant="outline"
                                                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                                                >
                                                    <LogOut className="w-4 h-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Logout</span>
                                                </Button>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <Button
                                asChild
                                className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                            >
                                <Link href='/sign-in' className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Login</span>
                                    <span className="sm:hidden">Login</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header