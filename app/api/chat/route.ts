import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: google("gemini-2.5-flash"),
        system: 'You are a helpful assistant.',
        messages: await convertToModelMessages(messages),
    });

    // return result.toUIMessageStreamResponse();
    return result.toUIMessageStreamResponse({
        // sendSources: true,
        messageMetadata: ({ part }) => {
            if (part.type === 'start') {
                return {
                    createdAt: Date.now(),
                    model: 'gpt-5.1',
                };
            }

            if (part.type === 'finish') {
                return {
                    totalTokens: part.totalUsage.totalTokens,
                };
            }
        },
    });
}

// Server: Send metadata about the message
// return result.toUIMessageStreamResponse({
//   messageMetadata: ({ part }) => {
//     if (part.type === 'start') {
//       return {
//         createdAt: Date.now(),
//         model: 'gpt-5.1',
//       };
//     }

//     if (part.type === 'finish') {
//       return {
//         totalTokens: part.totalUsage.totalTokens,
//       };
//     }
//   },
// });


// export async function POST(req: Request) {
//   const { id, message } = await req.json();

//   // Load existing messages and add the new one
//   const messages = await loadMessages(id);
//   messages.push(message);

//   const result = streamText({
//     model: google("gemini-3-pro-image"),
//     messages: await convertToModelMessages(messages),
//   });

//   return result.toUIMessageStreamResponse();
// }


// messages.map(message => (
//   <div key={message.id}>
//     {message.role === 'user' ? 'User: ' : 'AI: '}

//     {/* Render URL sources */}
//     {message.parts
//       .filter(part => part.type === 'source-url')
//       .map(part => (
//         <span key={`source-${part.id}`}>
//           [
//           <a href={part.url} target="_blank">
//             {part.title ?? new URL(part.url).hostname}
//           </a>
//           ]
//         </span>
//       ))}

//     {/* Render document sources */}
//     {message.parts
//       .filter(part => part.type === 'source-document')
//       .map(part => (
//         <span key={`source-${part.id}`}>
//           [<span>{part.title ?? `Document ${part.id}`}</span>]
//         </span>
//       ))}
//   </div>
// ));