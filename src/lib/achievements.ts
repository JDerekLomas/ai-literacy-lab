export type AchievementCategory =
  | 'prompt-engineering'
  | 'critical-thinking'
  | 'creative-collaboration'
  | 'task-decomposition'
  | 'effective-questioning'
  | 'artifact-mastery'
  | 'conversation-skills';

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  stats: {
    totalMessages: number;
    artifactsCreated: number;
    conversationCount: number;
    followUpQuestions: number;
    clarificationRequests: number;
    iterativeRefinements: number;
  };
}

export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
  // Prompt Engineering
  {
    id: 'first-message',
    category: 'prompt-engineering',
    title: 'First Steps',
    description: 'Send your first message to Claude',
    icon: '🌟',
    points: 10,
  },
  {
    id: 'clear-prompt',
    category: 'prompt-engineering',
    title: 'Crystal Clear',
    description: 'Write a clear, specific prompt with context',
    icon: '💎',
    points: 25,
  },
  {
    id: 'iterative-refinement',
    category: 'prompt-engineering',
    title: 'Refiner',
    description: 'Refine a prompt based on initial response',
    icon: '🔄',
    points: 30,
  },
  {
    id: 'prompt-master',
    category: 'prompt-engineering',
    title: 'Prompt Master',
    description: 'Write 10 well-structured prompts',
    icon: '👑',
    points: 50,
    total: 10,
  },

  // Creative Collaboration
  {
    id: 'brainstorm-session',
    category: 'creative-collaboration',
    title: 'Brainstormer',
    description: 'Have a brainstorming conversation',
    icon: '💡',
    points: 20,
  },
  {
    id: 'idea-expansion',
    category: 'creative-collaboration',
    title: 'Idea Expander',
    description: 'Expand on ideas with follow-up questions',
    icon: '🌱',
    points: 25,
  },
  {
    id: 'creative-explorer',
    category: 'creative-collaboration',
    title: 'Creative Explorer',
    description: 'Explore multiple creative directions',
    icon: '🎨',
    points: 35,
  },

  // Critical Thinking
  {
    id: 'fact-checker',
    category: 'critical-thinking',
    title: 'Fact Checker',
    description: 'Ask for sources or verification',
    icon: '🔍',
    points: 30,
  },
  {
    id: 'question-assumptions',
    category: 'critical-thinking',
    title: 'Assumption Questioner',
    description: 'Challenge or question an assumption',
    icon: '🤔',
    points: 35,
  },
  {
    id: 'compare-perspectives',
    category: 'critical-thinking',
    title: 'Perspective Seeker',
    description: 'Ask for multiple perspectives on a topic',
    icon: '👁️',
    points: 40,
  },

  // Task Decomposition
  {
    id: 'break-it-down',
    category: 'task-decomposition',
    title: 'Task Breaker',
    description: 'Break a complex task into steps',
    icon: '🧩',
    points: 30,
  },
  {
    id: 'step-by-step',
    category: 'task-decomposition',
    title: 'Step Master',
    description: 'Work through a multi-step process',
    icon: '📋',
    points: 40,
  },
  {
    id: 'project-planner',
    category: 'task-decomposition',
    title: 'Project Planner',
    description: 'Plan a complete project with Claude',
    icon: '🗺️',
    points: 50,
  },

  // Effective Questioning
  {
    id: 'follow-up-question',
    category: 'effective-questioning',
    title: 'Curious Mind',
    description: 'Ask a thoughtful follow-up question',
    icon: '❓',
    points: 15,
  },
  {
    id: 'clarification-seeker',
    category: 'effective-questioning',
    title: 'Clarification Seeker',
    description: 'Ask for clarification or examples',
    icon: '💬',
    points: 20,
  },
  {
    id: 'deep-diver',
    category: 'effective-questioning',
    title: 'Deep Diver',
    description: 'Ask 5+ follow-up questions in one conversation',
    icon: '🏊',
    points: 45,
    total: 5,
  },

  // Artifact Mastery
  {
    id: 'first-artifact',
    category: 'artifact-mastery',
    title: 'Artifact Creator',
    description: 'Create your first artifact with Claude',
    icon: '✨',
    points: 25,
  },
  {
    id: 'code-creator',
    category: 'artifact-mastery',
    title: 'Code Creator',
    description: 'Create a code artifact',
    icon: '💻',
    points: 30,
  },
  {
    id: 'visual-designer',
    category: 'artifact-mastery',
    title: 'Visual Designer',
    description: 'Create HTML or React visual artifact',
    icon: '🎨',
    points: 35,
  },
  {
    id: 'artifact-refiner',
    category: 'artifact-mastery',
    title: 'Artifact Refiner',
    description: 'Iterate on an artifact to improve it',
    icon: '⚡',
    points: 40,
  },
  {
    id: 'artifact-master',
    category: 'artifact-mastery',
    title: 'Artifact Master',
    description: 'Create 5 different types of artifacts',
    icon: '🏆',
    points: 100,
    total: 5,
  },

  // Conversation Skills
  {
    id: 'context-builder',
    category: 'conversation-skills',
    title: 'Context Builder',
    description: 'Provide helpful context in your prompts',
    icon: '📚',
    points: 20,
  },
  {
    id: 'conversation-starter',
    category: 'conversation-skills',
    title: 'Conversation Starter',
    description: 'Start 5 conversations',
    icon: '🗨️',
    points: 30,
    total: 5,
  },
  {
    id: 'engaged-learner',
    category: 'conversation-skills',
    title: 'Engaged Learner',
    description: 'Have a conversation with 10+ messages',
    icon: '🎓',
    points: 50,
    total: 10,
  },
];

export function calculateLevel(points: number): number {
  // Level = floor(sqrt(points / 100))
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  return (currentLevel * currentLevel) * 100;
}

export function getCategoryColor(category: AchievementCategory): string {
  const colors: Record<AchievementCategory, string> = {
    'prompt-engineering': 'blue',
    'critical-thinking': 'purple',
    'creative-collaboration': 'pink',
    'task-decomposition': 'green',
    'effective-questioning': 'yellow',
    'artifact-mastery': 'orange',
    'conversation-skills': 'indigo',
  };
  return colors[category];
}

export function getCategoryName(category: AchievementCategory): string {
  const names: Record<AchievementCategory, string> = {
    'prompt-engineering': 'Prompt Engineering',
    'critical-thinking': 'Critical Thinking',
    'creative-collaboration': 'Creative Collaboration',
    'task-decomposition': 'Task Decomposition',
    'effective-questioning': 'Effective Questioning',
    'artifact-mastery': 'Artifact Mastery',
    'conversation-skills': 'Conversation Skills',
  };
  return names[category];
}
