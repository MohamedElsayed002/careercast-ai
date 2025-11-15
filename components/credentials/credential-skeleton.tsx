
// CredentialCardSkeleton.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CredentialCardSkeleton() {
    return (
        <div
            className="bg-white/10 p-4 rounded-lg shadow-md border border-white/20 mt-4"
            role="status"
            aria-busy="true"
        >
            <div className="flex items-center justify-between">
                {/* left column (title + meta lines) */}
                <div className="flex-1 pr-4">
                    <Skeleton className="h-6 w-48 rounded-md" />
                    <div className="mt-2">
                        <Skeleton className="h-4 w-28 rounded-md" />
                    </div>
                    <div className="mt-2">
                        <Skeleton className="h-4 w-36 rounded-md" />
                    </div>
                </div>

                {/* right column (button) */}
                <div className="flex-shrink-0">
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
}
