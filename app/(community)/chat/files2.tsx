'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { FileUIPart } from 'ai';

export default function Page() {
  const { messages, sendMessage, status } = useChat();

  const [input, setInput] = useState('');
  const [files] = useState<FileUIPart[]>([
    {
      type: 'file',
      filename: 'earth.png',
      mediaType: 'image/png',
      url: 'https://example.com/earth.png',
    },
    {
      type: 'file',
      filename: 'moon.png',
      mediaType: 'image/png',
      url: 'data:image/png;base64,iVBORw0KGgo...',
    },
  ]);

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>

            <div>
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <span key={index}>{part.text}</span>;
                }

                if (
                  part.type === 'file' &&
                  part.mediaType?.startsWith('image/')
                ) {
                  return <img key={index} src={part.url} alt={part.filename} />;
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={event => {
          event.preventDefault();
          if (input.trim()) {
            sendMessage({
              text: input,
              files,
            });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          placeholder="Send message..."
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
      </form>
    </div>
  );
}