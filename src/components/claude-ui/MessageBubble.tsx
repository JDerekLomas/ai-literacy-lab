'use client';

import React from 'react';
import type { Message, Artifact } from '../ClaudeUI';
import { CodeBlock } from './CodeBlock';
import { MarkdownContent } from './MarkdownContent';

interface MessageBubbleProps {
  message: Message;
  onSelectArtifact: (artifact: Artifact | null) => void;
}

export function MessageBubble({ message, onSelectArtifact }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-none">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-500'
            : 'bg-gradient-to-br from-orange-400 to-pink-500'
        }`}>
          {isUser ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`inline-block max-w-full ${
          isUser
            ? 'ml-auto'
            : ''
        }`}>
          {/* Message text */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}>
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-normal">
                <MarkdownContent content={message.content} />
              </div>
            )}
          </div>

          {/* Artifact preview */}
          {message.artifact && (
            <button
              onClick={() => onSelectArtifact(message.artifact!)}
              className="mt-3 w-full text-left border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.artifact.title}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900">
                <CodeBlock
                  code={message.artifact.content.slice(0, 200) + (message.artifact.content.length > 200 ? '...' : '')}
                  language={message.artifact.language || 'plaintext'}
                  compact
                />
              </div>
            </button>
          )}

          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'text-right' : ''}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
