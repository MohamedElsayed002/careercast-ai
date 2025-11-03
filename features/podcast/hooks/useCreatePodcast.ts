import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type Variables = { message: string, voice: string };
type Result = { audioUrl?: string; pdfUrl?: string,audioId: string, pdfId: string };

export function useCreatePodcast(
    options?: UseMutationOptions<Result, unknown, Variables, unknown>,
) {
    return useMutation<Result, unknown, Variables, unknown>({
        mutationFn: async ({ message,voice }) => {
            const client = createTRPCClient<AppRouter>({
                links: [httpBatchLink({ url: "/api/trpc" })],
            });
            const result = await client.createPodcast.mutate({ message, voice });

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


