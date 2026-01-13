import { openai } from "@ai-sdk/openai"
import {
    convertToModelMessages,
    streamText,
    UIMessage,
    type LanguageModelUsage
} from "ai"
import { google} from "@ai-sdk/google"

type MyMetadata = {
    totalUsage: LanguageModelUsage
}

// Create a new custom message type with your own metadata
export type MyUIMessage = UIMessage<MyMetadata>

export async function POST(req: Request) {
    const { messages }: { messages: MyUIMessage[] } = await req.json()

    const result = streamText({
        model: google("gemini-2.5-flash"),
        messages: await convertToModelMessages(messages)
    })

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        messageMetadata: ({part}) => {
            // Send total usage when generation is finished
            if(part.type === 'finish') {
                return {
                    totalUsage: part.totalUsage
                }
            }
        }
    })
}