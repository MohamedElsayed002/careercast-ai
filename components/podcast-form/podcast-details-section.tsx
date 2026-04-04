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
import { InfoIcon, Sparkles } from "lucide-react"
import { voices } from "@/lib/utils"
import { formSchema } from "@/types"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Slider } from "../ui/slider"
import { CoverImageSection } from "./cover-image-section"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { formatPriceForDisplay, InfoHover, PRICE_MAP } from "./info-hover"

interface PodcastDetailsSectionProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const PodcastDetailsSection = ({ form }: PodcastDetailsSectionProps) => {
    const voice1 = form.watch('voice1')
    const voice2 = form.watch('voice2')

    const trpc = useTRPC()
    const { data: credentials } = useQuery(trpc.getCredential.queryOptions(undefined))


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
                                    autoFocus={true}
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">
                                Credentials (API Key)
                            </FormLabel>
                            <FormDescription>
                                <p>Select the API credential to be used for generating the podcast</p>
                                <p>
                                    Don&apos;t have any credentials?{' '}
                                    <Link href="/community/credentials" className="text-primary underline">
                                        Add your credentials here.
                                    </Link>
                                </p>
                            </FormDescription>

                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger aria-label="Select Credential (OpenAI/Gemini)" className="w-full">
                                        <SelectValue aria-label="Select Credential" placeholder="Select credential..." />
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
                    name="voiceSpeed"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                id="voice-speed-label"
                                className="text-base font-semibold"
                            >
                                Voice Speed
                            </FormLabel>

                            <FormDescription id="voice-speed-description">
                                Choose the speed of the AI voices in the podcast
                            </FormDescription>

                            <FormControl>
                                <Slider
                                    min={0.8}
                                    max={1.5}
                                    step={0.1}
                                    value={[field.value ?? 1]}
                                    onValueChange={(v) => field.onChange(v[0])}
                                    className="w-full"
                                    aria-labelledby="voice-speed-label"
                                    aria-describedby="voice-speed-description"
                                />
                            </FormControl>

                            <p className="text-sm text-muted-foreground mt-2">
                                Current:{" "}
                                <span className="font-semibold">
                                    {field.value ?? 1}x
                                </span>
                            </p>
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
                                    <SelectTrigger aria-label="Podcast Duration" className="w-full">
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
                                        <SelectTrigger aria-label="Select voice 1" className="w-full">
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
                                        <SelectTrigger aria-label="Voice 2 Select" className="w-full">
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

                {/* Models */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="textModel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Text Model</FormLabel>

                                <FormDescription className="flex justify-between items-center">
                                    <span>Select the model to generate the text for dialogue</span>

                                    {/* Reusable hover showing the currently selected model details */}
                                    <div>
                                        <InfoHover modelKey={field.value || "gpt-4o-mini"} />
                                    </div>
                                </FormDescription>

                                <FormControl>
                                    <Select onValueChange={(v) => field.onChange(v)} value={field.value}>
                                        <SelectTrigger aria-label='Select text modal' className="w-full">
                                            <SelectValue placeholder="Choose text model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4o-mini" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">gpt-4o-mini</span>
                                                    <span className="text-xs text-muted-foreground">Low-cost, fast</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["gpt-4o-mini"].pricePer1MInput)} / 1M in</div>
                                            </SelectItem>

                                            <SelectItem value="gpt-4-turbo" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">gpt-4-turbo</span>
                                                    <span className="text-xs text-muted-foreground">Balanced quality</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["gpt-4-turbo"].pricePer1MInput)} / 1M in</div>
                                            </SelectItem>

                                            <SelectItem value="gpt-5" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">gpt-5</span>
                                                    <span className="text-xs text-muted-foreground">Highest quality</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["gpt-5"].pricePer1MInput)} / 1M in</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="audioModel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Audio Model</FormLabel>

                                <FormDescription className="flex justify-between items-center">
                                    <span>Select the model to generate the audio</span>
                                    <div>
                                        <InfoHover modelKey={field.value || "tts-1"} />
                                    </div>
                                </FormDescription>

                                <FormControl>
                                    <Select onValueChange={(v) => field.onChange(v)} value={field.value}>
                                        <SelectTrigger aria-label="Select Audio Modal" className="w-full">
                                            <SelectValue placeholder="Choose audio model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4o-mini-tts" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">gpt-4o-mini-tts</span>
                                                    <span className="text-xs text-muted-foreground">Low-cost TTS</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["gpt-4o-mini-tts"].pricePerUnit)} / {PRICE_MAP["gpt-4o-mini-tts"].unit}</div>
                                            </SelectItem>

                                            <SelectItem value="tts-1" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">tts-1</span>
                                                    <span className="text-xs text-muted-foreground">Realtime</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["tts-1"].pricePerUnit)} / {PRICE_MAP["tts-1"].unit}</div>
                                            </SelectItem>

                                            <SelectItem value="tts-1-hd" className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">tts-1-hd</span>
                                                    <span className="text-xs text-muted-foreground">High fidelity</span>
                                                </div>
                                                <div className="text-sm">{formatPriceForDisplay(PRICE_MAP["tts-1-hd"].pricePerUnit)} / {PRICE_MAP["tts-1-hd"].unit}</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                {/* Image Model */}
                <FormField
                    control={form.control}
                    name="imageModel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Image Model</FormLabel>
                            <FormDescription className="flex flex-row justify-between">
                                <span>Select the model to generate the image</span>
                                <div>
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <InfoIcon className='size-4 -mt-5' />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold">Image model — quick cost & quality</h4>

                                                <div className="border rounded-md p-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-sm font-medium">DALL·E-3 — Standard</div>
                                                            <div className="text-xs text-muted-foreground">Best overall quality & prompt fidelity</div>
                                                        </div>
                                                        <div className="text-sm font-semibold">$0.04</div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">Cost: per <strong>1024×1024</strong> image</div>
                                                </div>
                                                <div className="border rounded-md p-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-sm font-medium">DALL·E-2</div>
                                                            <div className="text-xs text-muted-foreground">Lower cost — good for drafts and batch runs</div>
                                                        </div>
                                                        <div className="text-sm font-semibold">$0.016</div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">Cost: per <strong>1024×1024</strong> image</div>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    Note: prices & quality options may change. These figures are for 1024×1024 images. (Updated Nov 19, 2025)
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </FormDescription>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger aria-label="Select Image Modal" className="w-full">
                                        <SelectValue placeholder="Choose image model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dall-e-2">
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>dall-e-2</span>
                                                <span className='text-xs text-muted-foreground'>
                                                    Image low quality
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dall-e-3">
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>dall-e-3</span>
                                                <span className='text-xs text-muted-foreground'>
                                                    Image high quality
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <CoverImageSection form={form} />
            </CardContent>
        </Card>
    )
}
