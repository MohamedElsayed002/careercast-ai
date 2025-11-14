import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type Variables = { 
    title: string,
    message: string,
    duration: "1" | "5" | "10" | "20",
    voice1: string,
    voice2: string,
    image: string,
    credential: string
    };
type Result = { audioUrl?: string; pdfUrl?: string,audioId: string, pdfId: string };

export function useCreatePodcast(
    options?: UseMutationOptions<Result, unknown, Variables, unknown>,
) {
    return useMutation<Result, unknown, Variables, unknown>({
        mutationFn: async ({ title,message,duration,voice1,voice2,image,credential }) => {
            const client = createTRPCClient<AppRouter>({
                links: [httpBatchLink({ url: "/api/trpc" })],
            });
            const result = await client.createPodcast.mutate({ 
                title,
                message,
                voice1,
                voice2,
                image,
                credential,
                duration
            });
 
            return {
                audioUrl: result.audioUrl,
                pdfUrl: result.pdfUrl,
                audioId: result.audioId ?? "",
                pdfId: result.pdfId ?? "",
            };
        },
        ...options,
    });
}


