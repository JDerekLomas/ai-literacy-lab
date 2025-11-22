'use client';

import React, { useState } from 'react';
import { Sidebar } from './claude-ui/Sidebar';
import { ChatArea } from './claude-ui/ChatArea';
import { ArtifactPanel } from './claude-ui/ArtifactPanel';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  artifact?: Artifact;
}

export interface Artifact {
  id: string;
  type: 'code' | 'html' | 'react' | 'mermaid' | 'svg';
  title: string;
  content: string;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function ClaudeUI() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
    setSelectedArtifact(null);
    setMobileMenuOpen(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMobileMenuOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) {
      handleNewChat();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedConversation = currentConversation || {
      id: Date.now().toString(),
      title: content.slice(0, 50),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updatedConversation.messages = [...updatedConversation.messages, userMessage];
    updatedConversation.updatedAt = new Date();

    setCurrentConversation(updatedConversation);
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== updatedConversation.id);
      return [updatedConversation, ...filtered];
    });

    // TODO: Call API and add assistant response
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Sidebar - Mobile (Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900">
            <Sidebar
              conversations={conversations}
              currentConversation={currentConversation}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              isOpen={true}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${selectedArtifact ? 'md:max-w-[50%]' : ''}`}>
        <ChatArea
          conversation={currentConversation}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarOpen={sidebarOpen}
          onSelectArtifact={setSelectedArtifact}
        />
      </div>

      {/* Artifact Panel */}
      {selectedArtifact && (
        <div className="hidden md:block w-[50%] border-l border-gray-200 dark:border-gray-700">
          <ArtifactPanel
            artifact={selectedArtifact}
            onClose={() => setSelectedArtifact(null)}
          />
        </div>
      )}

      {/* Artifact Panel - Mobile (Modal) */}
      {selectedArtifact && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <ArtifactPanel
            artifact={selectedArtifact}
            onClose={() => setSelectedArtifact(null)}
          />
        </div>
      )}
    </div>
  );
}
