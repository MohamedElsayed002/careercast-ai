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

interface PodcastDetailsSectionProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const PodcastDetailsSection = ({ form }: PodcastDetailsSectionProps) => {
    const voice = form.watch('voice')

    return (
        <Card className="shadow-lg border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-5 h-5" />
                    Podcast Details
                </CardTitle>
                <CardDescription>
                    Fill in the details below to generate your podcast
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
                                Describe what your podcast is about (10-1000 characters)
                            </FormDescription>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    className="resize-none focus:ring-2 focus:ring-primary"
                                    placeholder="Write a detailed description for your podcast content..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">AI Voice</FormLabel>
                            <FormDescription>
                                Select the perfect voice for your podcast
                            </FormDescription>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a voice..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {voices.map((voice) => (
                                            <SelectItem key={voice.value} value={voice.value}>
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
                {voice && (
                    <audio src={`/${voice}.mp3`} autoPlay className='hidden' />
                )}
            </CardContent>
        </Card>
    )
}
