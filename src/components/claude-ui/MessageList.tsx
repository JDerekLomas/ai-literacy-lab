'use client';

import React, { useRef, useEffect } from 'react';
import type { Message, Artifact } from '../ClaudeUI';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  onSelectArtifact: (artifact: Artifact | null) => void;
}

export function MessageList({ messages, onSelectArtifact }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSelectArtifact={onSelectArtifact}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
