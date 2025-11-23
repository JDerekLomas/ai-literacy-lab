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
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return;

    let workingConversation = currentConversation;

    if (!workingConversation) {
      workingConversation = {
        id: Date.now().toString(),
        title: content.slice(0, 50),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentConversation(workingConversation);
      setConversations(prev => [workingConversation!, ...prev]);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message
    workingConversation.messages = [...workingConversation.messages, userMessage];
    workingConversation.updatedAt = new Date();
    setCurrentConversation({ ...workingConversation });
    updateConversationInList(workingConversation);

    setIsLoading(true);

    try {
      // Call Claude API
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'general',
          prompt: content,
          system: 'You are Claude, a helpful AI assistant created by Anthropic. You can create artifacts like code, HTML, React components, SVG graphics, and Mermaid diagrams to help users. When creating an artifact, use the format: [ARTIFACT:type:title] content [/ARTIFACT]',
          maxTokens: 2000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Parse artifacts from response
      const { content: messageContent, artifact } = parseArtifacts(data.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: messageContent,
        timestamp: new Date(),
        artifact,
      };

      // Add assistant message
      workingConversation.messages = [...workingConversation.messages, assistantMessage];
      workingConversation.updatedAt = new Date();
      setCurrentConversation({ ...workingConversation });
      updateConversationInList(workingConversation);

      // Auto-open artifact if one was created
      if (artifact) {
        setSelectedArtifact(artifact);
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      workingConversation.messages = [...workingConversation.messages, errorMessage];
      setCurrentConversation({ ...workingConversation });
      updateConversationInList(workingConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationInList = (conversation: Conversation) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== conversation.id);
      return [conversation, ...filtered];
    });
  };

  const parseArtifacts = (content: string): { content: string; artifact?: Artifact } => {
    const artifactRegex = /\[ARTIFACT:(code|html|react|mermaid|svg):([^\]]+)\]([\s\S]*?)\[\/ARTIFACT\]/;
    const match = content.match(artifactRegex);

    if (match) {
      const [fullMatch, type, title, artifactContent] = match;
      const artifact: Artifact = {
        id: Date.now().toString(),
        type: type as Artifact['type'],
        title: title.trim(),
        content: artifactContent.trim(),
        language: type === 'code' ? 'javascript' : type,
      };

      const cleanContent = content.replace(fullMatch, `\n\n✨ Created artifact: **${title}**\n`);
      return { content: cleanContent, artifact };
    }

    return { content };
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
          isLoading={isLoading}
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
