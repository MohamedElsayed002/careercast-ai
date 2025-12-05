"use client"

import { useState, useEffect } from "react"
import { useTRPC } from "@/trpc/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { UploadButton } from "@/utils/uploadthing"
import { ClientUploadedFileData } from "uploadthing/types"
import Image from "next/image"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Mail, Crown, CreditCard, Calendar, Shield, ImageIcon, Save } from "lucide-react"
import Header from "../header"

export const EditUser = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    const { data: user, isLoading } = useQuery(trpc.getUser.queryOptions())
    const updateUser = useMutation(trpc.updateUser.mutationOptions({
        onSuccess: (data) => {
            toast.success('Profile updated successfully!')
            queryClient.invalidateQueries({ queryKey: ['getUser'] })
            // Reset form with new data
            setName(data.name)
            if (data.image) {
                setImageUrl(data.image)
            }
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
            toast.error(errorMessage)
        }
    }))

    // Initialize form when user data loads
    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setImageUrl(user.image || null)
        }
    }, [user])

    const handleImageUpload = (res: ClientUploadedFileData<{ uploadedBy: string }>[]) => {
        if (res && res.length > 0) {
            const uploadedImageUrl = res[0].url
            setImageUrl(uploadedImageUrl)
            setIsUploadingImage(false)
            toast.success('Image uploaded successfully! Click "Update Image" to save.')
        }
    }

    const handleUpdateName = () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty')
            return
        }
        if (name === user?.name) {
            toast.info('No changes to save')
            return
        }
        updateUser.mutate({ name: name.trim() })
    }

    const handleUpdateImage = () => {
        if (!imageUrl) {
            toast.error('Please upload an image first')
            return
        }
        if (imageUrl === user?.image) {
            toast.info('No changes to save')
            return
        }
        updateUser.mutate({ image: imageUrl })
    }

    const formatDate = (dateString: string | Date | null | undefined) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')[0]
            .substring(0, 2)
            .toUpperCase()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">User not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
                    <p className="text-muted-foreground">Update your profile information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name Update Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Update Name
                                </CardTitle>
                                <CardDescription>
                                    Change your display name
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="mt-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleUpdateName}
                                    disabled={updateUser.isPending || !name.trim() || name === user.name}
                                    className="w-full"
                                >
                                    {updateUser.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Name
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Image Update Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Update Profile Image
                                </CardTitle>
                                <CardDescription>
                                    Upload a new profile picture
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Current/Preview Image */}
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={name || "Profile"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                                                {getInitials(name || user.email)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Button */}
                                <div className="flex flex-col items-center gap-2">
                                    <UploadButton
                                        endpoint="imageUpload"
                                        onUploadBegin={() => {
                                            setIsUploadingImage(true)
                                            toast.info('Uploading image...')
                                        }}
                                        onClientUploadComplete={handleImageUpload}
                                        onUploadError={(error) => {
                                            setIsUploadingImage(false)
                                            toast.error(`Upload failed: ${error.message}`)
                                        }}
                                        content={{
                                            button: ({ ready }) => (
                                                ready ? "Upload Image" : "Preparing..."
                                            ),
                                            allowedContent: "Image (4MB max)"
                                        }}
                                    />
                                    {isUploadingImage && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </div>
                                    )}
                                </div>

                                {/* Update Image Button */}
                                {imageUrl && imageUrl !== user.image && (
                                    <Button
                                        onClick={handleUpdateImage}
                                        disabled={updateUser.isPending}
                                        className="w-full"
                                        variant="default"
                                    >
                                        {updateUser.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Update Image
                                            </>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - User Info */}
                    <div className="space-y-6">
                        {/* Account Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground text-sm">Email</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Role</Label>
                                    <div className="mt-1">
                                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Member Since</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Email Verified</Label>
                                    <div className="mt-1">
                                        <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
                                            {user.emailVerified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subscription Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Subscription
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-muted-foreground text-sm">Podcast Pro</Label>
                                    <div className="mt-1">
                                        {user.isProPodcast ? (
                                            <Badge className="bg-yellow-500">
                                                <Crown className="w-3 h-3 mr-1" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">CV Reviewer Pro</Label>
                                    <div className="mt-1">
                                        {user.isProCVReviewer ? (
                                            <Badge className="bg-yellow-500">
                                                <Crown className="w-3 h-3 mr-1" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                                            {user.subscriptionStatus ? user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1) : 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                                {user.subscriptionEndsAt && (
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Subscription Ends</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">{formatDate(user.subscriptionEndsAt)}</p>
                                        </div>
                                    </div>
                                )}
                                {user.lastPaymentAt && (
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Last Payment</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">{formatDate(user.lastPaymentAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Usage Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Trials Used</Label>
                                    <p className="text-2xl font-bold mt-1">{user.trialsUsed || 0}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
