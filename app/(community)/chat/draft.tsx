'use client';

import { useChat } from '@ai-sdk/react';
import type { MyUIMessage } from '../../api/chat/darft';
import { DefaultChatTransport } from 'ai';


// Text Streams
// useChat can handle plain text streams by setting the streamProtocol option text:
// 'use client';

// import { useChat } from '@ai-sdk/react';
// import { TextStreamChatTransport } from 'ai';

// export default function Chat() {
//   const { messages } = useChat({
//     transport: new TextStreamChatTransport({
//       api: '/api/chat',
//     }),
//   });

//   return <>...</>;
// }


export default function Chat() {
  // Use custom message type defined on the server (optional for type-safety)
  const { messages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: ({message}) => {
        console.log(message.metadata?.totalUsage)
    }
  });
;
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map(part => {
            if (part.type === 'text') {
              return part.text;
            }
          })}
          {/* Render usage via metadata */}
          {m.metadata?.totalUsage && (
            <div>Total usage: {m.metadata?.totalUsage.totalTokens} tokens</div>
          )}
        </div>
      ))}
    </div>
  );
}