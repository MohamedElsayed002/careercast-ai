"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'

import { Button } from "../ui/button"
import { Form } from "../ui/form"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useCallback, useEffect, useState } from "react"
import {
    Mic,
    Music2,
    Loader2,
} from "lucide-react"
import { formSchema } from "@/types"
import { PodcastDetailsSection } from "../podcast-form/podcast-details-section"
import { GeneratedContentSection } from "../podcast-form/generated-content-section"
import Header from "../header"
import { useInngestSubscription } from "@inngest/realtime/hooks"
import { PodcastProgress } from "./podcast-progress"




export const CreatePodcastForm = () => {
    const [data, setData] = useState({
        audioURL: "",
        audioID: "",
        pdfURL: "",
        pdfId: ""
    })


    const [isGenerating, setIsGenerating] = useState(false)
    const [expectedLastStep, setExpectedLastStep] = useState<number | null>(null)

    const fetchSubscriptionToken = useCallback(async () => {
        const res = await fetch("/api/inngest/token")
        if (!res.ok) {
            const payload = await res.json().catch(() => ({}))
            const message = typeof payload?.error === "string"
                ? payload.error
                : "Failed to get subscription token"
            throw new Error(message)
        }
        return res.json()
    }, [])


    const { latestData, error: subscriptionError } = useInngestSubscription({
        refreshToken: fetchSubscriptionToken,
        enabled: isGenerating
    })

    const latestPayload = latestData?.data as { step?: number; stepName?: string } | undefined
    const currentStep = typeof latestPayload?.step === "number" ? latestPayload.step : null
    const includeSummary = expectedLastStep === 8

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            voiceSpeed: 1,
            description: '',
            duration: '1',
            voice1: '',
            voice2: '',
            image: '',
            credential: '',
            imageModel: 'dall-e-2',
            audioModel: 'gpt-4o-mini-tts',
            textModel: 'gpt-4o-mini',
        }
    })

    const trpc = useTRPC()
    const mutate = useMutation(trpc.createPodcast.mutationOptions({
        onSuccess: (data) => {
            toast.success('Podcast Created Successfully! 🎉')
            // setData({
            //     audioURL: data.audioUrl,
            //     audioID: data.audioId || '',
            //     pdfURL: data.pdfUrl,
            //     pdfId: data.pdfId || ''
            // })
            form.reset()
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create podcast';
            toast.error(errorMessage)
            setIsGenerating(false)
        }
    }))

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.image) {
            toast.error('Image is required')
            return
        }

        setIsGenerating(true)
        setExpectedLastStep(values.duration === "1" ? 7 : 8)

        mutate.mutate({
            title: values.title,
            message: values.description,
            duration: values.duration as "1" | "5" | "10" | "20",
            voice1: values.voice1,
            voice2: values.voice2,
            image: values.image,
            credential: values.credential,
            voiceSpeed: values.voiceSpeed,
            audioModel: values.audioModel,
            textModel: values.textModel
        })
    }

    useEffect(() => {
        if (!isGenerating || !expectedLastStep) return
        if (typeof currentStep === "number" && currentStep >= expectedLastStep) {
            setIsGenerating(false)
        }
    }, [currentStep, expectedLastStep, isGenerating])

    useEffect(() => {
        if (subscriptionError) {
            setIsGenerating(false)
        }
    }, [subscriptionError])

    return (
        <div className='bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900'>
            <Header />
            <div className='w-full max-w-4xl mx-auto px-4 sm:px-6'>
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3 pt-10">
                        <Mic className="w-10 h-10 text-white" />
                        <h1 className="text-4xl font-bold text-white">Create Your Podcast</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Create realistic debate podcasts between two AI voices discussing your topic
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <PodcastDetailsSection form={form} />

                        {/* Generate Podcast Button */}
                        <div className="mt-8">
                            <Button
                                disabled={mutate.isPending}
                                type="submit"
                                className="w-full text-lg h-12 font-semibold bg-blue-500 text-white cursor-button mb-4"
                                size="lg"
                                aria-label="Generate Podcast"
                            >
                                {mutate.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating Podcast...
                                    </>
                                ) : (
                                    <>
                                        <Music2 className="w-5 h-5 mr-2" />
                                        Generate Podcast
                                    </>
                                )}
                            </Button>
                            <PodcastProgress
                                isGenerating={isGenerating}
                                currentStep={currentStep}
                                includeSummary={includeSummary}
                                errorMessage={subscriptionError?.message}
                            />
                        </div>
                    </form>
                </Form>
                <GeneratedContentSection audioURL={data.audioURL} pdfURL={data.pdfURL} />
            </div>
        </div>
    )
}
