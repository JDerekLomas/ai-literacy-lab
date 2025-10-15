'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import PromptMasterAgent from './PromptMasterAgent';
import GoalCoachAgent from './GoalCoachAgent';
import CreativeCollaboratorAgent from './CreativeCollaboratorAgent';
import AIProductivityAgent from './AIProductivityAgent';

type AgentType = 'overview' | 'prompts' | 'goals' | 'creative' | 'productivity';

interface LearningProgress {
  promptMastery: number;
  goalAchievement: number;
  creativeCollaboration: number;
  productivityWorkflows: number;
  overallAILiteracy: number;
}

interface AgentInfo {
  id: AgentType;
  title: string;
  description: string;
  icon: string;
  features: string[];
  learningOutcomes: string[];
  timeEstimate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
}

const MathLearningDashboard: React.FC = () => {
  const [currentAgent, setCurrentAgent] = useState<AgentType>('overview');
  const [progress, setProgress] = useState<LearningProgress>({
    promptMastery: 25,
    goalAchievement: 15,
    creativeCollaboration: 10,
    productivityWorkflows: 35,
    overallAILiteracy: 21
  });

  const agents: AgentInfo[] = [
    {
      id: 'prompts',
      title: 'Prompt Mastery Agent',
      description: 'Master the art of communicating effectively with AI through structured prompt engineering exercises.',
      icon: '💬',
      features: [
        'Prompt engineering principles',
        'Real-time feedback analysis',
        'Progressive skill building',
        'Best practice examples'
      ],
      learningOutcomes: [
        'Write clear, effective prompts',
        'Get better AI responses',
        'Understand prompt structure',
        'Build AI communication skills'
      ],
      timeEstimate: '20-30 minutes',
      difficulty: 'Beginner'
    },
    {
      id: 'goals',
      title: 'Goal Coach Agent',
      description: 'Transform big personal goals into achievable steps with AI-guided conversation and planning.',
      icon: '🎯',
      features: [
        'Goal decomposition frameworks',
        'AI-guided conversation templates',
        'Progress tracking systems',
        'Personalized action plans'
      ],
      learningOutcomes: [
        'Break down complex goals',
        'Create actionable plans',
        'Use AI for personal growth',
        'Track meaningful progress'
      ],
      timeEstimate: '30-45 minutes',
      difficulty: 'Intermediate',
      prerequisites: ['Basic prompt writing skills']
    },
    {
      id: 'creative',
      title: 'Creative Collaborator Agent',
      description: 'Partner with AI for brainstorming, problem-solving, and creative content creation through structured sessions.',
      icon: '🎨',
      features: [
        'Brainstorming frameworks',
        'Creative thinking techniques',
        'Collaborative iteration',
        'Multi-step creative processes'
      ],
      learningOutcomes: [
        'Generate innovative ideas',
        'Solve problems creatively',
        'Collaborate with AI effectively',
        'Create compelling content'
      ],
      timeEstimate: '25-40 minutes',
      difficulty: 'Intermediate',
      prerequisites: ['Comfortable with open-ended prompts']
    },
    {
      id: 'productivity',
      title: 'AI Productivity Agent',
      description: 'Learn proven workflows for using AI to accelerate learning, decision-making, and problem-solving.',
      icon: '⚡',
      features: [
        'Productivity workflows',
        'Decision-making frameworks',
        'Learning acceleration',
        'Professional applications'
      ],
      learningOutcomes: [
        'Boost personal productivity',
        'Make better decisions faster',
        'Accelerate skill development',
        'Apply AI to work challenges'
      ],
      timeEstimate: '35-50 minutes',
      difficulty: 'Advanced',
      prerequisites: ['Experience with goal-oriented AI use']
    }
  ];

  const updateProgress = useCallback((agentType: AgentType, progressValue: number) => {
    setProgress(prev => {
      const newProgress = { ...prev };

      switch (agentType) {
        case 'prompts':
          newProgress.promptMastery = Math.max(newProgress.promptMastery, progressValue);
          break;
        case 'goals':
          newProgress.goalAchievement = Math.max(newProgress.goalAchievement, progressValue);
          break;
        case 'creative':
          newProgress.creativeCollaboration = Math.max(newProgress.creativeCollaboration, progressValue);
          break;
        case 'productivity':
          newProgress.productivityWorkflows = Math.max(newProgress.productivityWorkflows, progressValue);
          break;
      }

      // Calculate overall AI literacy
      newProgress.overallAILiteracy = Math.round(
        (newProgress.promptMastery +
         newProgress.goalAchievement +
         newProgress.creativeCollaboration +
         newProgress.productivityWorkflows) / 4
      );

      return newProgress;
    });
  }, []);

  const renderAgentContent = () => {
    switch (currentAgent) {
      case 'prompts':
        return <PromptMasterAgent />;
      case 'goals':
        return <GoalCoachAgent />;
      case 'creative':
        return <CreativeCollaboratorAgent />;
      case 'productivity':
        return <AIProductivityAgent />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          AI Literacy Learning Lab
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Master the art of using AI effectively to achieve your goals through hands-on
          practice with conversational agents designed to support human flourishing.
        </p>

        {/* Overall Progress */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Learning Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{progress.promptMastery}%</div>
              <div className="text-sm text-gray-600">Prompt Mastery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{progress.goalAchievement}%</div>
              <div className="text-sm text-gray-600">Goal Achievement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{progress.creativeCollaboration}%</div>
              <div className="text-sm text-gray-600">Creative Collaboration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{progress.productivityWorkflows}%</div>
              <div className="text-sm text-gray-600">Productivity Workflows</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallAILiteracy}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Overall AI Literacy: {progress.overallAILiteracy}%
          </p>
        </div>
      </div>

      {/* Agent Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            onClick={() => setCurrentAgent(agent.id)}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{agent.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{agent.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx(
                      "px-2 py-1 text-xs rounded-full",
                      agent.difficulty === 'Beginner' && "bg-green-100 text-green-700",
                      agent.difficulty === 'Intermediate' && "bg-yellow-100 text-yellow-700",
                      agent.difficulty === 'Advanced' && "bg-red-100 text-red-700"
                    )}>
                      {agent.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{agent.timeEstimate}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{agent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {agent.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Learning Outcomes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {agent.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {agent.prerequisites && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-1">Prerequisites</h4>
                  <ul className="text-sm text-yellow-700">
                    {agent.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Philosophy Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          AI Literacy Philosophy: Using AI to Support Human Flourishing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Human-AI Partnership</h3>
            <p className="text-gray-600 text-sm">
              Learn to collaborate with AI as a thinking partner, amplifying your capabilities
              while maintaining human agency, creativity, and decision-making.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Goal-Oriented Learning</h3>
            <p className="text-gray-600 text-sm">
              Every interaction teaches practical skills you can immediately apply to your
              personal and professional goals, making AI a tool for achieving what matters to you.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Practical Wisdom</h3>
            <p className="text-gray-600 text-sm">
              Move beyond AI basics to develop the judgment and skills needed to use AI
              effectively, ethically, and creatively in real-world situations.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Learning Path */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Recommended Learning Path
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          {[
            { agent: 'prompts', title: 'Prompt Mastery', step: 1 },
            { agent: 'goals', title: 'Goal Coaching', step: 2 },
            { agent: 'creative', title: 'Creative Collaboration', step: 3 },
            { agent: 'productivity', title: 'Productivity Workflows', step: 4 }
          ].map((item, index) => (
            <div key={item.agent} className="flex items-center">
              <div
                className="bg-white rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setCurrentAgent(item.agent as AgentType)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {item.step}
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {item.title}
                  </div>
                </div>
              </div>
              {index < 3 && (
                <div className="hidden md:block text-2xl text-gray-400 mx-4">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentAgent('overview')}
                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                🤖 AI Literacy Lab
              </button>
            </div>

            <div className="flex space-x-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: '🏠' },
                { id: 'prompts', label: 'Prompts', icon: '💬' },
                { id: 'goals', label: 'Goals', icon: '🎯' },
                { id: 'creative', label: 'Creative', icon: '🎨' },
                { id: 'productivity', label: 'Productivity', icon: '⚡' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentAgent(item.id as AgentType)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    currentAgent === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen">
        {renderAgentContent()}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-sm">
            AI literacy training designed to support human flourishing through effective AI collaboration
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Built with conversational AI agents and practical, goal-oriented learning experiences
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MathLearningDashboard;