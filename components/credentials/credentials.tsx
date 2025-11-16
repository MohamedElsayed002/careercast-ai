"use client"

import { Button } from "../ui/button"
import { BreadcrumbsCred } from "./breadcrumbs-cred"
import { DialogCred } from "./dialog-cred"
import { useTRPC } from "@/trpc/client"
import {  useQuery } from "@tanstack/react-query"
import { Credential } from "./credential"
import { CredentialCardSkeleton } from "./credential-skeleton"

export const Credentials = () => {
    const trpc = useTRPC()

    const { data: credentials, isLoading, error } = useQuery(trpc.getUserCredentials.queryOptions(undefined))

    return (
        <div className='w-4/5 mx-auto mt-5'>
            <div>
                <BreadcrumbsCred />
                <Button variant="ghost" className="mt-4 mb-6">
                    Manage your API credentials here.
                </Button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-white">Your API Credentials</h2>
                <DialogCred />
            </div>

            {/* Fetch Credentials */}
            <div className="mt-4">
                {isLoading && (
                    <div className='flex flex-col'>
                        <CredentialCardSkeleton/>
                        <CredentialCardSkeleton/>
                        <CredentialCardSkeleton/>
                    </div>
                )}
                {error && (
                    <p className="text-red-400">Error loading credentials. Please try again.</p>
                )}
                {!isLoading && !error && credentials && credentials.length > 0 && (
                    credentials.map((cred) => (
                        <Credential key={cred.id} cred={cred} />
                    ))
                )}
                {!isLoading && !error && credentials && credentials.length === 0 && (
                    <p className="text-white mt-4">No credentials found. Add your first credential above.</p>
                )}
            </div>
        </div>
    )
}
