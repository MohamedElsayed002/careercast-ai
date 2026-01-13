'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';

// Attachments
// The useChat hook supports sending file attachments along with a message as well as 
// rendering them on the client. This can be useful for building applications that involve
// sending images, files or other media content to the AI Provider

// There are two ways to send files with a message: using a FileList object from file inputs 
// or using an array of file objects

// FileList
// By using FileList. you can send multiple files as attachments along with a message
// using the file input element. The `useChat` hook will automatically convert them into data
// URLs and send them to the AI provider


export default function Page() {
  const { messages, sendMessage, status } = useChat();

  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            setFiles(undefined);

            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }}
      >
        <input
          type="file"
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
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