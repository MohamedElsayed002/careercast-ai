"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href}>
            <Button variant="ghost" className={className}>
                {children}
            </Button>
        </Link>
    )
}

