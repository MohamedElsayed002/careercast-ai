"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Crown, LogIn, LogOut, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { authClient } from "@/utils/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export const Header = () => {


    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false)

    const router = useRouter()
    const trpc = useTRPC()
    const { data: user } = useQuery(trpc.getUser.queryOptions())
    const { data } = authClient.useSession()
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription()
    const userName = data?.user?.name || data?.user?.email?.split('@')[0] || 'User'
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className="container mx-auto px-6 py-6">
            <nav className="flex justify-between items-center">

                {/* Logo */}
                <Link className="text-2xl md:text-4xl font-bold" href="/">
                    CareerCast AI
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex flex-row gap-6 items-center">
                    <li><Link href="/features">Features</Link></li>
                    <li><Link href="/how-it-works">How it works</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li>
                        {data ? (
                            <>
                                <DropdownMenu open={open} onOpenChange={setOpen} >
                                    <DropdownMenuTrigger>
                                        <div className="sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-600 backdrop-blur-md border border-white/20">
                                            <Avatar className="h-8 w-8 border-2 border-white/30">
                                                <AvatarImage src={data.user?.image || undefined} alt={userName} />
                                                <AvatarFallback className=" bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-semibold">
                                                    {userInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden md:block">
                                                <p className="text-sm font-medium text-white">{userName}</p>
                                                {user?.isProCVReviewer && user?.isProPodcast && hasActiveSubscription && !isLoading && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Crown className="w-3 h-3 text-yellow-300" />
                                                        <span className="text-xs text-white/80">Pro Member</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {user?.role === 'ADMIN' && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link href='/community/admin/dashboard'>Admin Dashboard</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/community/admin/messages">Messages</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {user && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Link href='/community/user'>My account</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/community/edit-user">Edit User</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/community/user/cv-reviews">
                                                        CV Reviews
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {!user?.isProCVReviewer && !isLoading && (
                                            <DropdownMenuItem>
                                                <h1
                                                    onClick={() => authClient.checkout({ slug: "cv-reviewer" })}
                                                    className='cursor-pointer'
                                                >
                                                    <span className="hidden sm:inline">Upgrade</span>
                                                </h1>
                                            </DropdownMenuItem>
                                        )}
                                        {
                                            user?.isProCVReviewer && hasActiveSubscription && !isLoading && (
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
                                                    onClick={() => authClient.signOut({
                                                        fetchOptions: {
                                                            onSuccess: () => {
                                                                router.push('/')
                                                                toast.success("User logged out")
                                                            }
                                                        }
                                                    })}
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
                    </li>
                </ul>

                {/* Mobile Dropdown Menu */}
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger className="md:hidden">
                        <Menu size={28} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-52 mr-4">
                        {user?.role === 'ADMIN' && (
                            <DropdownMenuItem>
                                <Link href='/community/admin/dashboard'>Admin Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                        {
                            user && (
                                <>
                                    <DropdownMenuItem>
                                        <Link href='/community/user'>My account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/community/edit-user">Edit User</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/community/user/cv-reviews">
                                            CV Reviews
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )
                        }
                        <DropdownMenuItem>
                            <Link href="/features" className="w-full">Features</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="/how-it-works" className="w-full">How it works</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="/contact" className="w-full">Contact</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    );
};



