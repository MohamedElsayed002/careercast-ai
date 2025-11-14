"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    value: z.string().min(10, "API Key must be at least 10 characters"),
})

export const DialogCred = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            value: '',
        },
    })

    const { mutate: addCredentials } = useMutation(trpc.addCredentials.mutationOptions({
        onSuccess: () => {
            toast.success("Credential added successfully!")
            // Invalidate and refetch credentials query
            queryClient.invalidateQueries({
                queryKey: trpc.getUserCredentials.queryOptions(undefined).queryKey
            })
            form.reset()
            setOpen(false)
        },
        onError: (error) => {
            console.error("Error adding credential:", error)
            toast.error("Failed to add credential. Please try again.")
        }
    }))

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        addCredentials({
            name: values.name,
            value: values.value
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant='ghost' className="mt-4 border">Add Credit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white text-black">
                    <DialogHeader>
                        <DialogTitle>Add your API Key form OpenAI</DialogTitle>
                        <DialogDescription>
                            Your API Key is secured in the website. We decode the API Key for security purpose
                        </DialogDescription>
                    </DialogHeader>
                    <DialogContent className="flex flex-col bg-white text-black gap-y-4">
                        <Form  {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="API KEY" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Value</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="sk-..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}