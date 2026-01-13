"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"

// import { useChat } from '@ai-sdk/react';
// import { DefaultChatTransport } from 'ai';

// const { messages, sendMessage } = useChat({
//   transport: new DefaultChatTransport({
//     api: '/api/custom-chat',
//     headers: () => ({
//       Authorization: `Bearer ${getAuthToken()}`,
//       'X-User-ID': getCurrentUserId(),
//     }),
//     body: () => ({
//       sessionId: getCurrentSessionId(),
//       preferences: getUserPreferences(),
//     }),
//     credentials: () => 'include',
//   }),
// });

const ChatPage = () => {


    const { messages, sendMessage, status, stop, error, regenerate, reload } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
            // Body
            // headers: {
            //     Authorization: "token"
            // },
            // body: {
            //     user_id: '123'
            // }
            // Transport Configuration 
            // You can configure custom transport behavior using the transport option to customize how 
            // messages are sent to your API
            // prepareSendMessagesRequest: ({id,messages}) => {
            //     return {
            //         body: {
            //             id,
            //             message: messages[messages.length - 1]
            //         }
            //     }
            // }
        }),
        onFinish: ({ message, messages, isAbort, isDisconnect, isError }) => {
            console.log({
                message,
                messages,
                isAbort,
                isDisconnect,
                isError
            })
        },
        onError: (error) => {
            console.log('An error occured', error)
        },
        onData: (data) => {
            console.log('Received data part from server', data)
        }
    })

    console.log({ messages, error })

    const [input, setInput] = useState('')



    return (
        <div>
            {/* {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.parts.map((part, index) =>
                        part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                    )}
                </div>
            ))} */}
            {
                messages.map(message => (
                    <div key={message.id}>
                        {message.role}:{' '}
                        {message.metadata?.createdAt &&
                            new Date(message.metadata?.createdAt).toLocaleTimeString()}
                        {/* Render message content */}
                        {message.parts.map((part, index) =>
                            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                        )}
                        {/* Show token count if available */}
                        {message.metadata?.totalTokens && (
                            <span>{message.metadata.totalTokens} tokens</span>
                        )}
                    </div>
                ))
            }

            {/* Images */}
            {/* {
                messages.map(message => (
                    <div key={message.id}>
                        {message.role === 'user' ? 'User: ' : 'AI: '}
                        {message.parts.map((part, index) => {
                            if (part.type === 'text') {
                                return <div key={index}>{part.text}</div>;
                            } else if (part.type === 'file' && part.mediaType.startsWith('image/')) {
                                return <img key={index} src={part.url} alt="Generated image" />;
                            }
                        })}
                    </div>
                ));
            } */}

            {(status === 'streaming' || status === 'submitted') && (
                <div>
                    {status === 'submitted' && <h1>Loading</h1>}
                    <button type='button' onClick={() => stop()}>
                        Stop
                    </button>
                </div>
            )}

            {error && (
                <>
                    <div>An error occurred</div>
                    <button
                        type='button'
                        onClick={() => reload()}
                    >
                        Retry
                    </button>
                </>
            )}

            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (input.trim()) {
                        sendMessage({ text: input }
                            // {
                            //     headers: {
                            //         Authorization: 'Bearer token123',
                            //         'X-Custom-Header': 'custom-value',
                            //     },
                            //     body: {
                            //         temperature: 0.7,
                            //         max_tokens: 100,
                            //         user_id: '123'
                            //     },
                            //     metadata: {
                            //         userId: 'user123',
                            //         sessionId: 'session456'
                            //     }
                            // }
                        )
                        setInput('')
                    }
                }}
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== "ready"}
                    placeholder="Say something"
                />
                <button
                    type="submit"
                    disabled={status !== "ready" || error != null}
                >Submit</button>
                <button onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>
                <button
                    onClick={() => regenerate()}
                    disabled={!(status === 'ready' || status === 'error')}
                >
                    Regenerate
                </button>
            </form>
        </div>
    )
}

export default ChatPage