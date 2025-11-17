"use client"

import { UseFormReturn } from "react-hook-form"
import { z } from 'zod'
import { useState } from "react"
import { UploadButton } from "@/utils/uploadthing"
import { ClientUploadedFileData } from "uploadthing/types"
import Image from "next/image"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles } from "lucide-react"
import { formSchema } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

interface CoverImageSectionProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const CoverImageSection = ({ form }: CoverImageSectionProps) => {
    const [uploadImage, setUploadImage] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [imagePrompt, setImagePrompt] = useState('')

    const trpc = useTRPC()
    const mutate = useMutation(trpc.generateImage.mutationOptions({
        onSuccess: (data) => {
            setImages([data.url])
            form.setValue('image', data.url)
            toast.success('Image Generated Successfully')
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.message)
        }
    }))


    const handleUploadthing = (res: ClientUploadedFileData<{ uploadedBy: string; }>[]) => {
        const image = res.map((photo) => photo.url)
        setImages(image)
        if (image.length > 0) {
            form.setValue('image', image[0])
        }
        toast.success(`${image.length} image(s) uploaded successfully!`)
    }

    const handleGenerateImage = async () => {
        if (!imagePrompt.trim()) {
            toast.error('Please enter a prompt to generate an image')
            return
        }
        mutate.mutate({message: imagePrompt})
    }

    return (
        <div className="mt-8">
            <Card className="shadow-lg border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Cover Image</CardTitle>
                    <CardDescription>
                        Upload a cover image for your podcast (optional)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Tab Switch */}
                    <div className='flex gap-2 mb-6 bg-muted rounded-lg p-1 max-w-md'>
                        <Button
                            type="button"
                            onClick={() => setUploadImage(false)}
                            className={`flex-1 px-4 py-2 rounded-md transition-all font-medium ${!uploadImage
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Upload Image
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setUploadImage(true)}
                            className={`relative flex-1 px-4 py-2 rounded-md transition-all font-medium ${uploadImage
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Badge className='absolute bg-blue-500 -top-2 -right-5 text-white'>Pro</Badge>
                            Generate Image
                        </Button>
                    </div>

                    {/* Upload Content */}
                    {uploadImage ? (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type='text'
                                    placeholder="Paused / Just upload image..."
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    className="flex-1"
                                    disabled={true}
                                    // disabled={!hasActiveSubscription}
                                />
                                <Button
                                    type="button"
                                    onClick={() => console.log('Paused for now')}
                                    disabled={mutate.isPending || !imagePrompt.trim()}
                                >
                                    {mutate.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate
                                        </>
                                    )}
                                </Button>
                            </div>
                            {images.length > 0 && (
                                <div className="grid grid-cols-1 gap-4 mt-4">
                                    {images.map((item, idx) => (
                                        <div key={item || idx} className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                            <Image
                                                src={item}
                                                fill
                                                alt='Generated Image'
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <UploadButton
                                endpoint='imageUpload'
                                onClientUploadComplete={(res) => {
                                    handleUploadthing(res)
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error('Upload failed: ' + error.message)
                                }}
                            />
                            {images.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    {images.map((item, idx) => (
                                        <div key={item || idx} className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                            <Image
                                                src={item}
                                                fill
                                                alt='Uploaded Image'
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
