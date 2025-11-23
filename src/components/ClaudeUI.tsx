'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './claude-ui/Sidebar';
import { ChatArea } from './claude-ui/ChatArea';
import { ArtifactPanel } from './claude-ui/ArtifactPanel';
import { AchievementNotification } from './claude-ui/AchievementNotification';
import { AchievementsPanel } from './claude-ui/AchievementsPanel';
import { AchievementTracker } from '@/lib/achievement-tracker';
import type { Achievement, UserProgress } from '@/lib/achievements';

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
  const [achievementTracker, setAchievementTracker] = useState<AchievementTracker | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);

  // Load progress and conversations from localStorage
  useEffect(() => {
    // Load achievement progress
    const saved = localStorage.getItem('ai-literacy-progress');
    const tracker = saved
      ? AchievementTracker.loadProgress(saved)
      : new AchievementTracker();
    setAchievementTracker(tracker);
    setUserProgress(tracker.getProgress());

    // Load conversations
    const savedConversations = localStorage.getItem('claude-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Restore Date objects
        const restored = parsed.map((c: Conversation) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setConversations(restored);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (achievementTracker) {
      localStorage.setItem('ai-literacy-progress', achievementTracker.saveProgress());
    }
  }, [userProgress]);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('claude-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

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

    // Track new conversation achievement
    if (achievementTracker) {
      const newAchievements = achievementTracker.trackNewConversation();
      if (newAchievements.length > 0) {
        setPendingAchievements(prev => [...prev, ...newAchievements]);
        setUserProgress(achievementTracker.getProgress());
      }
    }
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

    // Track user message achievements
    if (achievementTracker) {
      const newAchievements = achievementTracker.trackMessage(userMessage, workingConversation);
      if (newAchievements.length > 0) {
        setPendingAchievements(prev => [...prev, ...newAchievements]);
        setUserProgress(achievementTracker.getProgress());
      }
    }

    setIsLoading(true);

    try {
      // Call Claude API
      console.log('🚀 Sending request to /api/claude...');
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: 'general',
          prompt: content,
          system: `You are Claude, a helpful AI assistant created by Anthropic.

You can create interactive artifacts like code, HTML pages, React components, SVG graphics, and Mermaid diagrams.

When you create an artifact, wrap it in these tags:
[ARTIFACT:type:title]
...artifact content...
[/ARTIFACT]

Types available:
- code: JavaScript/Python/any code
- html: Complete HTML pages
- react: React components (use JSX, will run with React 18)
- svg: SVG graphics
- mermaid: Mermaid diagrams

Example:
[ARTIFACT:react:Interactive Counter]
function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
[/ARTIFACT]

The artifact will appear in a panel next to the chat where users can interact with it. Use artifacts for substantial content like complete programs, visualizations, or interactive demos.`,
          maxTokens: 2000,
          temperature: 0.7,
        }),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);

      // If API returns an error in the response
      if (data.error) {
        console.error('❌ API Error:', data.error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || `Error: ${data.error}`,
          timestamp: new Date(),
        };
        workingConversation.messages = [...workingConversation.messages, errorMessage];
        setCurrentConversation({ ...workingConversation });
        updateConversationInList(workingConversation);
        setIsLoading(false);
        return;
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

      // Track assistant message achievements (especially artifacts)
      if (achievementTracker) {
        const newAchievements = achievementTracker.trackMessage(assistantMessage, workingConversation);
        if (newAchievements.length > 0) {
          setPendingAchievements(prev => [...prev, ...newAchievements]);
          setUserProgress(achievementTracker.getProgress());
        }
      }

      // Auto-open artifact if one was created
      if (artifact) {
        setSelectedArtifact(artifact);
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Error: ${error instanceof Error ? error.message : 'Failed to connect to API'}

Please check:
- Is the ANTHROPIC_API_KEY set in Vercel environment variables?
- Is the API endpoint accessible?
- Check browser console for details.`,
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

  const dismissAchievement = () => {
    setPendingAchievements(prev => prev.slice(1));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Achievement Notifications */}
      {pendingAchievements.length > 0 && (
        <AchievementNotification
          achievement={pendingAchievements[0]}
          onDismiss={dismissAchievement}
        />
      )}

      {/* Achievements Panel */}
      {showAchievementsPanel && userProgress && (
        <AchievementsPanel
          progress={userProgress}
          onClose={() => setShowAchievementsPanel(false)}
        />
      )}
      {/* Sidebar - Desktop */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userProgress={userProgress}
          onShowAchievements={() => setShowAchievementsPanel(true)}
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
              userProgress={userProgress}
              onShowAchievements={() => {
                setMobileMenuOpen(false);
                setShowAchievementsPanel(true);
              }}
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
