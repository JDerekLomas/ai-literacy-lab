import type { Message, Conversation } from '@/components/ClaudeUI';
import type { Achievement, UserProgress } from './achievements';
import { ACHIEVEMENTS, calculateLevel } from './achievements';

export class AchievementTracker {
  private progress: UserProgress;
  private newAchievements: Achievement[] = [];

  constructor(initialProgress?: UserProgress) {
    this.progress = initialProgress || this.getDefaultProgress();
  }

  private getDefaultProgress(): UserProgress {
    return {
      totalPoints: 0,
      level: 1,
      achievements: [],
      stats: {
        totalMessages: 0,
        artifactsCreated: 0,
        conversationCount: 0,
        followUpQuestions: 0,
        clarificationRequests: 0,
        iterativeRefinements: 0,
      },
    };
  }

  /**
   * Track a message and check for new achievements
   */
  trackMessage(message: Message, conversation: Conversation): Achievement[] {
    this.newAchievements = [];
    this.progress.stats.totalMessages++;

    // First message ever
    if (this.progress.stats.totalMessages === 1) {
      this.unlockAchievement('first-message');
    }

    // Track artifacts
    if (message.artifact) {
      this.progress.stats.artifactsCreated++;
      this.checkArtifactAchievements(message);
    }

    // Analyze user messages for achievements
    if (message.role === 'user') {
      this.analyzeUserMessage(message, conversation);
    }

    // Update level
    this.progress.level = calculateLevel(this.progress.totalPoints);

    return this.newAchievements;
  }

  /**
   * Track a new conversation
   */
  trackNewConversation(): Achievement[] {
    this.newAchievements = [];
    this.progress.stats.conversationCount++;

    // Conversation starter achievement
    const conversationAch = ACHIEVEMENTS.find(a => a.id === 'conversation-starter');
    if (conversationAch && conversationAch.total) {
      this.updateProgressAchievement(
        'conversation-starter',
        this.progress.stats.conversationCount,
        conversationAch.total
      );
    }

    return this.newAchievements;
  }

  private analyzeUserMessage(message: Message, conversation: Conversation) {
    const content = message.content.toLowerCase();
    const messageIndex = conversation.messages.findIndex(m => m.id === message.id);
    const isFollowUp = messageIndex > 0;

    // Check for clear, specific prompts (longer, detailed messages)
    if (content.length > 100 && this.hasContext(content)) {
      this.unlockAchievement('clear-prompt');
      this.unlockAchievement('context-builder');
    }

    // Follow-up questions
    if (isFollowUp) {
      this.progress.stats.followUpQuestions++;
      this.unlockAchievement('follow-up-question');

      // Deep diver achievement
      const deepDiver = ACHIEVEMENTS.find(a => a.id === 'deep-diver');
      if (deepDiver && deepDiver.total) {
        const userMessages = conversation.messages.filter(m => m.role === 'user').length;
        this.updateProgressAchievement('deep-diver', userMessages, deepDiver.total);
      }

      // Engaged learner achievement
      const engagedLearner = ACHIEVEMENTS.find(a => a.id === 'engaged-learner');
      if (engagedLearner && engagedLearner.total) {
        this.updateProgressAchievement(
          'engaged-learner',
          conversation.messages.length,
          engagedLearner.total
        );
      }
    }

    // Check for clarification requests
    if (this.isClarificationRequest(content)) {
      this.progress.stats.clarificationRequests++;
      this.unlockAchievement('clarification-seeker');
    }

    // Check for iterative refinement
    if (this.isRefinement(content)) {
      this.progress.stats.iterativeRefinements++;
      this.unlockAchievement('iterative-refinement');
    }

    // Check for fact-checking
    if (this.isFactChecking(content)) {
      this.unlockAchievement('fact-checker');
    }

    // Check for brainstorming
    if (this.isBrainstorming(content)) {
      this.unlockAchievement('brainstorm-session');
    }

    // Check for idea expansion
    if (this.isIdeaExpansion(content)) {
      this.unlockAchievement('idea-expansion');
    }

    // Check for task decomposition
    if (this.isTaskDecomposition(content)) {
      this.unlockAchievement('break-it-down');
    }

    // Check for questioning assumptions
    if (this.isQuestioningAssumption(content)) {
      this.unlockAchievement('question-assumptions');
    }

    // Check for seeking multiple perspectives
    if (this.isSeekingPerspectives(content)) {
      this.unlockAchievement('compare-perspectives');
    }
  }

  private checkArtifactAchievements(message: Message) {
    if (!message.artifact) return;

    // First artifact
    if (this.progress.stats.artifactsCreated === 1) {
      this.unlockAchievement('first-artifact');
    }

    // Specific artifact types
    const type = message.artifact.type;
    if (type === 'code') {
      this.unlockAchievement('code-creator');
    } else if (type === 'html' || type === 'react') {
      this.unlockAchievement('visual-designer');
    }

    // Track artifact mastery
    const artifactMaster = ACHIEVEMENTS.find(a => a.id === 'artifact-master');
    if (artifactMaster && artifactMaster.total) {
      // Count unique artifact types
      const uniqueTypes = new Set<string>();
      this.progress.achievements
        .filter(a => a.category === 'artifact-mastery')
        .forEach(() => uniqueTypes.add(type));
      this.updateProgressAchievement('artifact-master', uniqueTypes.size, artifactMaster.total);
    }
  }

  private hasContext(content: string): boolean {
    const contextIndicators = [
      'i want to',
      'i need to',
      'help me',
      'can you help',
      'i\'m trying to',
      'i\'m working on',
      'my goal is',
      'the context is',
      'background:',
      'specifically',
    ];
    return contextIndicators.some(indicator => content.includes(indicator));
  }

  private isClarificationRequest(content: string): boolean {
    const patterns = [
      'can you explain',
      'what do you mean',
      'could you clarify',
      'can you elaborate',
      'tell me more about',
      'what does that mean',
      'can you give an example',
      'show me an example',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isRefinement(content: string): boolean {
    const patterns = [
      'actually',
      'instead',
      'change',
      'modify',
      'update',
      'revise',
      'adjust',
      'tweak',
      'make it',
      'try again',
      'let\'s try',
      'can we make it',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isFactChecking(content: string): boolean {
    const patterns = [
      'is that correct',
      'are you sure',
      'can you verify',
      'source',
      'evidence',
      'prove',
      'how do you know',
      'where did you get',
      'is that accurate',
      'fact check',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isBrainstorming(content: string): boolean {
    const patterns = [
      'brainstorm',
      'ideas for',
      'what are some',
      'suggest',
      'come up with',
      'think of',
      'possibilities',
      'options',
      'alternatives',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isIdeaExpansion(content: string): boolean {
    const patterns = [
      'expand on',
      'tell me more',
      'go deeper',
      'elaborate',
      'explore this',
      'what about',
      'what if',
      'how could',
      'building on',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isTaskDecomposition(content: string): boolean {
    const patterns = [
      'break down',
      'step by step',
      'steps to',
      'how do i',
      'process for',
      'plan for',
      'outline',
      'roadmap',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isQuestioningAssumption(content: string): boolean {
    const patterns = [
      'what if',
      'but what about',
      'why assume',
      'is it necessary',
      'do we need to',
      'why not',
      'couldn\'t we',
      'what about',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private isSeekingPerspectives(content: string): boolean {
    const patterns = [
      'different perspective',
      'other viewpoints',
      'alternative view',
      'different angle',
      'pros and cons',
      'advantages and disadvantages',
      'both sides',
      'multiple perspectives',
    ];
    return patterns.some(pattern => content.includes(pattern));
  }

  private unlockAchievement(id: string) {
    // Check if already unlocked
    if (this.progress.achievements.some(a => a.id === id)) {
      return;
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    const unlockedAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date(),
    };

    this.progress.achievements.push(unlockedAchievement);
    this.progress.totalPoints += achievement.points;
    this.newAchievements.push(unlockedAchievement);
  }

  private updateProgressAchievement(id: string, current: number, total: number) {
    const existing = this.progress.achievements.find(a => a.id === id);

    if (existing) {
      // Update progress
      existing.progress = Math.min(current, total);
    } else if (current >= total) {
      // Unlock if threshold reached
      this.unlockAchievement(id);
    } else {
      // Create progress achievement
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (!achievement) return;

      const progressAchievement: Achievement = {
        ...achievement,
        progress: current,
      };

      this.progress.achievements.push(progressAchievement);
    }

    // Check if we should unlock
    if (current >= total) {
      this.unlockAchievement(id);
    }
  }

  getProgress(): UserProgress {
    return this.progress;
  }

  saveProgress(): string {
    return JSON.stringify(this.progress);
  }

  static loadProgress(json: string): AchievementTracker {
    try {
      const progress = JSON.parse(json);
      // Restore Date objects
      progress.achievements = progress.achievements.map((a: Achievement) => ({
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
      }));
      return new AchievementTracker(progress);
    } catch (error) {
      console.error('Failed to load progress:', error);
      return new AchievementTracker();
    }
  }
}
