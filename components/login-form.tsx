"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {  z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/utils/auth-client"
import { SocialMediaButtons } from "./social-media-buttons"

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Not a valid email"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters").max(32, "Password must be less than 32 characters")
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: '/podcast',
            rememberMe: false
        },{
            onSuccess: () => {
                router.push('/podcast')
            },
            onError:(ctx) => {
                if(ctx.error.status === 403) {
                    toast("Please verify your email address")
                }
                toast.error(ctx.error.message)
            }
        },
    )
    }

    const isPending = form.formState.isSubmitting

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Login to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <SocialMediaButtons/>
                                <div className="grid gap-6">

                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        autoFocus={true}
                                                        type='email'
                                                        placeholder="m@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder="******"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' className="w-full" disabled={isPending}>
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href='/sign-up' className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )

}