'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'learning' | 'creative' | 'financial' | 'relationships';
  priority: 1 | 2 | 3;
  timeframe: string;
  currentState: string;
  desiredState: string;
  aiTasks: AITask[];
  progress: number;
}

interface AITask {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
  expectedOutcome: string;
  completed: boolean;
  aiResponse?: string;
}

interface ConversationTurn {
  prompt: string;
  response: string;
  timestamp: Date;
}

export const GoalCoachAgent: React.FC = () => {
  const [currentGoal, setCurrentGoal] = useState<PersonalGoal | null>(null);
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [activeTask, setActiveTask] = useState<AITask | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  const goalTemplates: Omit<PersonalGoal, 'id' | 'progress'>[] = [
    {
      title: "Career Transition",
      description: "Navigate a career change with AI-powered research and planning",
      category: "career",
      priority: 1,
      timeframe: "6-12 months",
      currentState: "Feeling stuck in current role",
      desiredState: "Successfully transitioned to fulfilling career",
      aiTasks: [
        {
          id: 'research-careers',
          title: 'Career Research & Analysis',
          description: 'Use AI to research potential career paths based on your skills and interests',
          promptTemplate: 'I currently work as [current role] with skills in [list skills]. I\'m interested in [interests/values]. Can you analyze 5 potential career paths that would be good fits, including required skills, typical salary ranges, job market outlook, and transition strategies for each?',
          expectedOutcome: 'Detailed analysis of 5 career options with actionable transition plans',
          completed: false
        },
        {
          id: 'skill-gap-analysis',
          title: 'Skill Gap Analysis',
          description: 'Identify what skills you need to develop for your target career',
          promptTemplate: 'Based on my target career of [chosen career], here are my current skills: [list current skills]. Can you provide a comprehensive skill gap analysis and create a learning roadmap with specific resources, timelines, and milestones?',
          expectedOutcome: 'Personalized learning roadmap with timeline and resources',
          completed: false
        },
        {
          id: 'networking-strategy',
          title: 'Networking Strategy',
          description: 'Develop a strategic approach to building professional connections',
          promptTemplate: 'I want to transition into [target field]. I\'m [introvert/extrovert] and prefer [communication styles]. Can you create a networking strategy that includes: 1) Types of events/platforms to focus on, 2) Conversation starters, 3) Follow-up templates, 4) A 90-day action plan?',
          expectedOutcome: 'Complete networking strategy with templates and action plan',
          completed: false
        }
      ]
    },
    {
      title: "Health & Wellness Transformation",
      description: "Create sustainable health habits with AI guidance and accountability",
      category: "health",
      priority: 2,
      timeframe: "3-6 months",
      currentState: "Inconsistent health habits, low energy",
      desiredState: "Consistent healthy lifestyle with high energy",
      aiTasks: [
        {
          id: 'wellness-assessment',
          title: 'Personal Wellness Assessment',
          description: 'Get AI analysis of your current health patterns and personalized recommendations',
          promptTemplate: 'Here\'s my current lifestyle: Sleep: [hours and quality], Exercise: [current activity], Diet: [eating patterns], Stress: [stress levels and sources], Energy: [energy patterns]. Can you analyze this and provide a prioritized list of 3-5 changes that would have the biggest impact on my health and energy?',
          expectedOutcome: 'Prioritized health improvement recommendations based on your specific situation',
          completed: false
        },
        {
          id: 'habit-design',
          title: 'Sustainable Habit Design',
          description: 'Design small, sustainable habits that build toward your health goals',
          promptTemplate: 'I want to improve my [specific health area]. My schedule is [describe schedule constraints]. I\'ve failed at [past attempts] because [reasons]. Can you design 3 micro-habits that are so small I can\'t fail, plus a progression plan for building them into my routine?',
          expectedOutcome: 'Micro-habit system designed for your specific constraints and past challenges',
          completed: false
        },
        {
          id: 'accountability-system',
          title: 'Accountability & Tracking System',
          description: 'Create a system for tracking progress and staying motivated',
          promptTemplate: 'I\'m motivated by [what motivates you] and struggle with [what derails you]. Can you design an accountability system that includes: 1) Simple tracking methods, 2) Milestone celebrations, 3) Strategies for getting back on track, 4) Ways to involve others for support?',
          expectedOutcome: 'Personalized accountability system with tracking tools',
          completed: false
        }
      ]
    },
    {
      title: "Learn a New Skill",
      description: "Master any skill efficiently using AI-powered learning strategies",
      category: "learning",
      priority: 2,
      timeframe: "2-4 months",
      currentState: "Want to learn but overwhelmed by options",
      desiredState: "Confident competency in chosen skill",
      aiTasks: [
        {
          id: 'learning-strategy',
          title: 'Personalized Learning Strategy',
          description: 'Get an AI-designed learning plan tailored to your style and schedule',
          promptTemplate: 'I want to learn [specific skill] to [specific goal/application]. I learn best through [learning style preferences]. I can dedicate [time available] per week. I have experience with [related skills]. Can you create a learning strategy that includes: 1) Learning sequence, 2) Best resources for my style, 3) Practice projects, 4) Progress milestones?',
          expectedOutcome: 'Complete learning strategy with timeline and resources',
          completed: false
        },
        {
          id: 'practice-projects',
          title: 'Progressive Practice Projects',
          description: 'Design projects that build skills incrementally',
          promptTemplate: 'For learning [skill], I want hands-on projects that progressively build complexity. My interests include [your interests] and I\'d like the projects to be relevant to [your goals]. Can you design 5 projects from beginner to intermediate, each building on the last, with clear learning objectives and success criteria?',
          expectedOutcome: 'Series of progressive projects with learning objectives',
          completed: false
        },
        {
          id: 'learning-optimization',
          title: 'Learning Optimization & Troubleshooting',
          description: 'Get help when you\'re stuck or want to accelerate progress',
          promptTemplate: 'I\'m learning [skill] and I\'m struggling with [specific challenges]. My current approach is [describe what you\'re doing]. Can you analyze what might be going wrong and suggest: 1) Alternative learning approaches, 2) Resources for my specific struggle, 3) Ways to practice this concept, 4) How to know when I\'ve mastered it?',
          expectedOutcome: 'Targeted solutions for learning challenges',
          completed: false
        }
      ]
    }
  ];

  const simulateAIResponse = useCallback((prompt: string, task: AITask): string => {
    // Simulated AI response - in real implementation, this would call Claude API
    const responses: Record<string, string> = {
      'research-careers': `Based on your background and interests, here are 5 potential career paths:

1. **Product Manager** - Leverage your analytical skills and business understanding
   - Avg Salary: $95k-140k
   - Growth: High demand (15% growth projected)
   - Transition: Consider PM bootcamp or certification

2. **Data Analyst** - Use your problem-solving abilities with growing data needs
   - Avg Salary: $70k-95k
   - Growth: Very high (25% growth projected)
   - Transition: Learn SQL, Python, Tableau

3. **UX Researcher** - Apply analytical thinking to user behavior
   - Avg Salary: $85k-120k
   - Growth: Strong (13% growth projected)
   - Transition: Build portfolio with user research projects

[Continues with detailed analysis for each path...]`,

      'wellness-assessment': `Analysis of your wellness patterns:

**Priority Impact Areas:**
1. **Sleep Quality** (Highest Impact) - Your 5-6 hours is significantly below optimal
2. **Consistent Movement** (High Impact) - Desk job requires intentional activity
3. **Stress Management** (Medium Impact) - Address work stress patterns

**Top 3 Recommendations:**
1. Establish consistent sleep schedule (target 7-8 hours)
2. Add 10-minute morning movement routine
3. Implement 5-minute stress breaks every 2 hours

[Detailed implementation strategies follow...]`,

      'learning-strategy': `Personalized Learning Strategy for [Skill]:

**Phase 1: Foundation (Weeks 1-3)**
- Core concepts through visual tutorials
- Daily 30-minute focused sessions
- Simple practice exercises

**Phase 2: Application (Weeks 4-8)**
- Project-based learning
- Real-world application
- Weekly review and adjustment

**Phase 3: Mastery (Weeks 9-12)**
- Complex projects
- Teaching others (best retention method)
- Building portfolio pieces

[Specific resources and milestones follow...]`
    };

    return responses[task.id] || `Here's a detailed response to your prompt about ${task.title}. This AI guidance will help you move forward with specific, actionable steps...`;
  }, []);

  const executeAITask = useCallback(() => {
    if (!activeTask || !userPrompt.trim()) return;

    const response = simulateAIResponse(userPrompt, activeTask);

    setConversation(prev => [...prev, {
      prompt: userPrompt,
      response,
      timestamp: new Date()
    }]);

    // Mark task as completed
    if (currentGoal) {
      const updatedGoal = {
        ...currentGoal,
        aiTasks: currentGoal.aiTasks.map(task =>
          task.id === activeTask.id
            ? { ...task, completed: true, aiResponse: response }
            : task
        )
      };

      // Update progress
      const completedTasks = updatedGoal.aiTasks.filter(t => t.completed).length;
      updatedGoal.progress = Math.round((completedTasks / updatedGoal.aiTasks.length) * 100);

      setCurrentGoal(updatedGoal);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    }

    setUserPrompt('');
    setActiveTask(null);
  }, [activeTask, userPrompt, currentGoal, simulateAIResponse]);

  const createNewGoal = useCallback((template: Omit<PersonalGoal, 'id' | 'progress'>) => {
    const newGoal: PersonalGoal = {
      ...template,
      id: `goal-${Date.now()}`,
      progress: 0
    };

    setGoals(prev => [...prev, newGoal]);
    setCurrentGoal(newGoal);
    setShowNewGoalForm(false);
  }, []);

  const renderGoalSelection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Personal Goals</h2>
        <p className="text-gray-600">
          Use AI to break down big goals into achievable steps with guided conversations
        </p>
      </div>

      {goals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="p-4 bg-white rounded-lg border border-gray-300 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setCurrentGoal(goal)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{goal.title}</h4>
                  <span className={clsx(
                    "px-2 py-1 text-xs rounded",
                    goal.category === 'career' && "bg-blue-100 text-blue-700",
                    goal.category === 'health' && "bg-green-100 text-green-700",
                    goal.category === 'learning' && "bg-purple-100 text-purple-700"
                  )}>
                    {goal.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Start a New Goal</h3>
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showNewGoalForm ? 'Hide Templates' : 'Choose Template'}
          </button>
        </div>

        {showNewGoalForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalTemplates.map((template, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                onClick={() => createNewGoal(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{template.title}</h4>
                  <span className={clsx(
                    "px-2 py-1 text-xs rounded",
                    template.category === 'career' && "bg-blue-100 text-blue-700",
                    template.category === 'health' && "bg-green-100 text-green-700",
                    template.category === 'learning' && "bg-purple-100 text-purple-700"
                  )}>
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <p className="text-xs text-gray-500">
                  {template.aiTasks.length} AI-guided tasks • {template.timeframe}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderGoalDetail = () => {
    if (!currentGoal) return null;

    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setCurrentGoal(null)}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          ← Back to Goals
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentGoal.title}</h2>
              <p className="text-gray-600 mt-1">{currentGoal.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{currentGoal.progress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Current State</h3>
              <p className="text-sm text-gray-600">{currentGoal.currentState}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Desired State</h3>
              <p className="text-sm text-gray-600">{currentGoal.desiredState}</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentGoal.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI-Guided Tasks</h3>

          <div className="space-y-4">
            {currentGoal.aiTasks.map(task => (
              <div
                key={task.id}
                className={clsx(
                  "p-4 rounded-lg border-2 transition-all",
                  task.completed
                    ? "border-green-300 bg-green-50"
                    : activeTask?.id === task.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300 cursor-pointer"
                )}
                onClick={() => !task.completed && setActiveTask(task)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  {task.completed && <span className="text-green-600 text-xl">✓</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <p className="text-xs text-blue-600">Expected: {task.expectedOutcome}</p>

                {activeTask?.id === task.id && (
                  <div className="mt-4 p-4 bg-white rounded border">
                    <h5 className="font-medium text-gray-800 mb-2">Conversation with Claude</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Use this template as a starting point, but customize it with your specific details:
                    </p>
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm text-gray-700 italic">"{task.promptTemplate}"</p>
                    </div>

                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Customize the prompt template above with your specific details..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-3"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={executeAITask}
                        disabled={!userPrompt.trim()}
                        className={clsx(
                          "flex-1 py-2 px-4 rounded font-medium",
                          userPrompt.trim()
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                      >
                        Send to Claude
                      </button>
                      <button
                        onClick={() => setActiveTask(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {task.completed && task.aiResponse && (
                  <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">Claude's Response:</h5>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                      {task.aiResponse.substring(0, 200)}...
                      <button className="text-green-600 hover:underline ml-1">
                        View Full Response
                      </button>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {conversation.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation History</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversation.map((turn, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="text-sm text-gray-500 mb-1">
                    {turn.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-blue-700">You:</span>
                    <p className="text-gray-700 mt-1">{turn.prompt}</p>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Claude:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{turn.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Goal Coach Agent
          </h1>
          <p className="text-gray-600">
            Transform big goals into achievable steps with AI-powered guidance and conversation
          </p>
        </div>

        {!currentGoal ? renderGoalSelection() : renderGoalDetail()}
      </div>
    </div>
  );
};

export default GoalCoachAgent;