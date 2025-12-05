"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ClipboardList, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ReviewerHeader = () => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className="container mx-auto px-6 py-6">
            <nav className="flex justify-between items-center">

                {/* Logo */}
                <Link
                    className="text-2xl md:text-3xl border-b border-teal-600 font-bold flex gap-1 items-center"
                    href="/reviewer"
                >
                    <ClipboardList className='text-teal-600' />
                    <span>CV Reviewer</span>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex flex-row gap-6 items-center">
                    <li><Link href="#how-it-works">How it works</Link></li>
                    <li><Link href="#pricing">Pricing</Link></li>
                    <li><Link href="#features">Features</Link></li>
                    <li><Link href="#testimonials">Testimonials</Link></li>
                    <li><Button className='bg-teal-600 hover:bg-teal-400'>Get Started</Button></li>
                </ul>

                {/* Mobile Dropdown Menu */}
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger className="md:hidden">
                        <Menu size={28} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-52 mr-4">
                        <DropdownMenuItem>
                            <Link href="#how-it-works" className="w-full">How it works</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="#pricing" className="w-full">Pricing</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="#features" className="w-full">Features</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href="#testimonials" className="w-full">Testimonials</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Button className="w-full mt-2 bg-teal-600 hover:bg-teal-400">Get Started</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    );
};
