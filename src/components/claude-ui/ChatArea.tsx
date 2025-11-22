'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, Artifact } from '../ClaudeUI';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatAreaProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  sidebarOpen: boolean;
  onSelectArtifact: (artifact: Artifact | null) => void;
}

export function ChatArea({
  conversation,
  onSendMessage,
  onToggleSidebar,
  onToggleMobileMenu,
  sidebarOpen,
  onSelectArtifact,
}: ChatAreaProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {conversation?.title || 'Claude'}
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="max-w-2xl text-center">
              <div className="mb-8">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation by typing a message below
              </p>
            </div>
          </div>
        ) : (
          <MessageList messages={conversation.messages} onSelectArtifact={onSelectArtifact} />
        )}
      </div>

      {/* Input */}
      <div className="flex-none border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
