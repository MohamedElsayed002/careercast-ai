"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'

import { Button } from "./ui/button"
import { Form } from "./ui/form"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { useState } from "react"
import {
    Mic,
    Music2,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { formSchema } from "@/types"
import { PodcastDetailsSection } from "./podcast-form/podcast-details-section"
import { CoverImageSection } from "./podcast-form/cover-image-section"
import { GeneratedContentSection } from "./podcast-form/generated-content-section"
import Header from "./header"




export const CreatePodcastForm = () => {
    const [data, setData] = useState({
        audioURL: "",
        audioID: "",
        pdfURL: "",
        pdfId: ""
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            voice1: '',
            voice2: '',
            image: '',
        }
    })

    const trpc = useTRPC()
    const mutate = useMutation(trpc.createPodcast.mutationOptions({
        onSuccess: (data) => {
            toast.success('Podcast Created Successfully! 🎉')
            setData({
                audioURL: data.audioUrl,
                audioID: data.audioId || '',
                pdfURL: data.pdfUrl,
                pdfId: data.pdfId || ''
            })
            form.reset()
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create podcast';
            toast.error(errorMessage)
        }
    }))

    function onSubmit(values: z.infer<typeof formSchema>) {
        if(!values.image) {
            toast.error('Image is required')
            return
        }
        mutate.mutate({ title: values.title,message: values.description, voice1: values.voice1, voice2: values.voice2, image: values.image })
    }

    return (
        <div className='bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900'>
            <Header/>
            <div className='w-full max-w-4xl mx-auto px-4 sm:px-6'>
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3 pt-10">
                        <Mic className="w-10 h-10 text-white" />
                        <h1 className="text-4xl font-bold text-foreground">Create Your Podcast</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Create realistic debate podcasts between two AI voices discussing your topic
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <PodcastDetailsSection form={form} />
                        <CoverImageSection form={form} />

                        {/* Generate Podcast Button */}
                        <div className="mt-8">
                            <Button
                                disabled={mutate.isPending}
                                type="submit"
                                className="w-full text-lg h-12 font-semibold bg-blue-500 cursor-button mb-4"
                                size="lg"
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
                        </div>
                    </form>
                </Form>
                <h1 className='flex gap-2 pb-4'>
                    <AlertCircle/>
                    I reduced the audio duration and image quality because each time cost me 0.20$ 
                </h1>
                <GeneratedContentSection audioURL={data.audioURL} pdfURL={data.pdfURL} />
            </div>
        </div>
    )
}