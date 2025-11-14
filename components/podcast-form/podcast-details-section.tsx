"use client"

import { UseFormReturn } from "react-hook-form"
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sparkles } from "lucide-react"
import { voices } from "@/lib/utils"
import { formSchema } from "@/types"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

interface PodcastDetailsSectionProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const PodcastDetailsSection = ({ form }: PodcastDetailsSectionProps) => {
    const voice1 = form.watch('voice1')
    const voice2 = form.watch('voice2')

    const trpc = useTRPC()
    const { data : credentials} = useQuery(trpc.getCredential.queryOptions(undefined))
    

    return (
        <Card className="shadow-lg border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-5 h-5" />
                    Podcast Details
                </CardTitle>
                <CardDescription>
                    Fill in the details below to generate your debate podcast
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Title</FormLabel>
                            <FormDescription>
                                Choose a catchy title for your podcast
                            </FormDescription>
                            <FormControl>
                                <Input
                                    className="focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your podcast title..." {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Description</FormLabel>
                            <FormDescription>
                                Describe the debate topic for your podcast (10-1000 characters)
                            </FormDescription>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    className="resize-none focus:ring-2 focus:ring-primary"
                                    placeholder="Write a detailed description for your debate topic..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='credential'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">
                                Credentials (API Key)
                            </FormLabel>
                            <FormDescription>
                                <p>Select the API credential to be used for generating the podcast</p>
                                <p> 
                                    Don&apos;t have any credentials?{' '}
                                    <Link href="/user" className="text-primary underline">
                                        Add your credentials here.
                                    </Link>
                                </p>
                            </FormDescription>

                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select credential..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {credentials && credentials.length > 0 ? (
                                            credentials.map((credential) => (
                                                <SelectItem key={credential.id} value={credential.id}>
                                                    {credential.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-credentials" disabled>
                                                No credentials available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Podcast Duration</FormLabel>
                            <FormDescription>
                                Select how long you want the podcast to be
                            </FormDescription>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select duration..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 minute</SelectItem>
                                        <SelectItem value="5">5 minutes</SelectItem>
                                        <SelectItem value="10">10 minutes</SelectItem>
                                        <SelectItem value="20">20 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="voice1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Speaker 1 Voice</FormLabel>
                                <FormDescription>
                                    Select the voice for the first debater
                                </FormDescription>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose voice 1..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {voices.map((voice) => (
                                                <SelectItem key={voice.value} value={voice.value} disabled={voice.value === voice2}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{voice.label}</span>
                                                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="voice2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Speaker 2 Voice</FormLabel>
                                <FormDescription>
                                    Select the voice for the second debater
                                </FormDescription>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose voice 2..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {voices.map((voice) => (
                                                <SelectItem key={voice.value} value={voice.value} disabled={voice.value === voice1}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{voice.label}</span>
                                                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {voice1 && (
                    <audio src={`/${voice1}.mp3`} autoPlay className='hidden' />
                )}
                {voice2 && (
                    <audio src={`/${voice2}.mp3`} autoPlay className='hidden' />
                )}
            </CardContent>
        </Card>
    )
}
