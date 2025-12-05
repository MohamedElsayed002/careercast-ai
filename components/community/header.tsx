"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

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
                    <li><Button>Get Started</Button></li>
                </ul>

                {/* Mobile Dropdown Menu */}
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger className="md:hidden">
                        <Menu size={28} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-52 mr-4">
                        <DropdownMenuItem>
                            <Link href="/features" className="w-full">Features</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="/how-it-works" className="w-full">How it works</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="/contact" className="w-full">Contact</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Button className="w-full mt-2">Get Started</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    );
};



