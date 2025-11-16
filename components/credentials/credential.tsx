import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface CredentialProps {
    id: string;
    name: string;
    createdAt: string;
    value: string;
}

export const Credential = ({ cred }: { cred: CredentialProps }) => {

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation(trpc.deleteCredential.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: trpc.getUserCredentials.queryOptions(undefined).queryKey
            })
            toast.success("Credential deleted successfully!")
        },
        onError: (error) => {
            toast.error(`Error deleting credential: ${error.message}`)
        }
    }))

    return (
        <div key={cred.id} className="bg-white/10 p-4 rounded-lg shadow-md border border-white/20 mt-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">{cred.name}</h3>
                    <p className="text-white/70">ID: {cred.id}</p>
                    <p className="text-white/50 text-sm">Created: {new Date(cred.createdAt).toLocaleDateString()}</p>
                </div>
                <div className='mt-4 md:mt-0'>
                    <Button
                        variant="destructive"
                        onClick={() => mutate({ id: cred.id })}
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : (
                            <div className="flex items-center gap-2">
                                <Trash className="w-4 h-4" />
                                Delete
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}