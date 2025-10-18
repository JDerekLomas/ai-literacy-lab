'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import WellbeingAgentDesigner from './WellbeingAgentDesigner';
import LearningAgentDesigner from './LearningAgentDesigner';
import ConnectionAgentDesigner from './ConnectionAgentDesigner';
import PurposeAgentDesigner from './PurposeAgentDesigner';
import MultiModelAgentDesigner from './MultiModelAgentDesigner';

type AgentTrack = 'overview' | 'wellbeing' | 'learning' | 'connection' | 'purpose' | 'multimodel';

interface DesignProgress {
  wellbeingAgents: number;
  learningAgents: number;
  connectionAgents: number;
  purposeAgents: number;
  multiModelSkills: number;
  overallFlourishingDesign: number;
}

interface TrackInfo {
  id: AgentTrack;
  title: string;
  description: string;
  icon: string;
  researchBase: string[];
  designSkills: string[];
  flourishingOutcomes: string[];
  timeEstimate: string;
  difficulty: 'Foundation' | 'Practitioner' | 'Expert';
  ethicalFocus: string[];
}

const AgentDesignAcademy: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<AgentTrack>('overview');
  const [progress, setProgress] = useState<DesignProgress>({
    wellbeingAgents: 0,
    learningAgents: 0,
    connectionAgents: 0,
    purposeAgents: 0,
    multiModelSkills: 0,
    overallFlourishingDesign: 0
  });

  const tracks: TrackInfo[] = [
    {
      id: 'wellbeing',
      title: 'Wellbeing Agent Designer',
      description: 'Design AI companions that support mental health, resilience, and personal growth through evidence-based psychological principles.',
      icon: '🌱',
      researchBase: [
        'Positive Psychology (PERMA model)',
        'Therapeutic Communication',
        'Crisis Intervention Protocols',
        'Habit Formation Science'
      ],
      designSkills: [
        'Empathy modeling and validation',
        'Safety protocol implementation',
        'Mental health screening design',
        'Personalized intervention strategies'
      ],
      flourishingOutcomes: [
        'Reduced anxiety and depression symptoms',
        'Improved emotional regulation',
        'Stronger resilience and coping skills',
        'Enhanced self-awareness and growth'
      ],
      timeEstimate: '8-12 weeks',
      difficulty: 'Practitioner',
      ethicalFocus: [
        'Privacy in mental health data',
        'Crisis escalation protocols',
        'Avoiding replacement of human therapy',
        'Cultural sensitivity in wellbeing'
      ]
    },
    {
      id: 'learning',
      title: 'Learning Agent Designer',
      description: 'Create personalized AI tutors that adapt to individual learning styles and promote deep understanding and skill mastery.',
      icon: '🧠',
      researchBase: [
        'Educational Psychology',
        'Spaced Repetition Research',
        'Flow Theory and Engagement',
        'Motivation and Self-Determination Theory'
      ],
      designSkills: [
        'Adaptive learning algorithms',
        'Engagement mechanics design',
        'Knowledge assessment methods',
        'Personalization without bias'
      ],
      flourishingOutcomes: [
        'Accelerated skill acquisition',
        'Increased learning motivation',
        'Better knowledge retention',
        'Growth mindset development'
      ],
      timeEstimate: '6-10 weeks',
      difficulty: 'Foundation',
      ethicalFocus: [
        'Educational equity and access',
        'Avoiding algorithmic bias in assessment',
        'Protecting student privacy',
        'Supporting diverse learning needs'
      ]
    },
    {
      id: 'connection',
      title: 'Connection Agent Designer',
      description: 'Build AI facilitators that strengthen authentic human relationships and foster inclusive, supportive communities.',
      icon: '🤝',
      researchBase: [
        'Social Psychology Research',
        'Community Building Studies',
        'Conflict Resolution Theory',
        'Cross-Cultural Communication'
      ],
      designSkills: [
        'Social dynamics modeling',
        'Inclusive conversation design',
        'Bias detection and mitigation',
        'Community health measurement'
      ],
      flourishingOutcomes: [
        'Stronger social connections',
        'Reduced loneliness and isolation',
        'More inclusive communities',
        'Better conflict resolution skills'
      ],
      timeEstimate: '10-14 weeks',
      difficulty: 'Expert',
      ethicalFocus: [
        'Privacy in social interactions',
        'Preventing echo chambers',
        'Supporting vulnerable populations',
        'Cultural competency requirements'
      ]
    },
    {
      id: 'purpose',
      title: 'Purpose Agent Designer',
      description: 'Design AI guides that help people discover their values, find meaning, and pursue goals aligned with their authentic selves.',
      icon: '🎯',
      researchBase: [
        'Meaning-Making Research',
        'Values Clarification Studies',
        'Goal Setting Psychology',
        'Behavioral Change Science'
      ],
      designSkills: [
        'Values exploration frameworks',
        'Goal alignment algorithms',
        'Motivation system design',
        'Progress tracking and reflection'
      ],
      flourishingOutcomes: [
        'Clearer sense of purpose and direction',
        'Better goal achievement rates',
        'Increased life satisfaction',
        'Stronger value-behavior alignment'
      ],
      timeEstimate: '8-12 weeks',
      difficulty: 'Practitioner',
      ethicalFocus: [
        'Respecting diverse value systems',
        'Avoiding manipulation of goals',
        'Supporting autonomous choice',
        'Cultural sensitivity in meaning-making'
      ]
    },
    {
      id: 'multimodel',
      title: 'Multi-Model AI Skills',
      description: 'Master cost-effective AI agent design by learning to select and optimize different AI models (Claude, Qwen, GPT) for maximum impact within budget constraints.',
      icon: '⚡',
      researchBase: [
        'Derek Lomas Learning Engineering Research',
        'Cost Optimization Methodologies',
        'Model Performance Analysis',
        'Scalability Engineering Principles'
      ],
      designSkills: [
        'Model selection and comparison',
        'Cost-benefit analysis for AI systems',
        'Multi-model architecture design',
        'Performance optimization strategies'
      ],
      flourishingOutcomes: [
        'Accessible AI for resource-constrained organizations',
        'Democratized access to AI capabilities',
        'Optimized performance-to-cost ratios',
        'Sustainable and scalable AI implementations'
      ],
      timeEstimate: '4-6 weeks',
      difficulty: 'Practitioner',
      ethicalFocus: [
        'Equitable access to AI technology',
        'Transparent cost structures',
        'Avoiding vendor lock-in',
        'Environmental impact of model choices'
      ]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI Agent Design Academy
        </h1>
        <h2 className="text-2xl text-purple-600 mb-6">
          For Human Flourishing
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-6">
          Learn to design AI agents that actively promote human wellbeing, authentic relationships,
          meaningful learning, and purposeful living through research-based design principles.
        </p>
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Based on Harvard & MIT Research
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            PERMA+ Framework
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Human-Centered Ethics
          </div>
        </div>
      </div>

      {/* Learning Philosophy */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🧠 Research-Based Learning Philosophy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🔬</div>
            <h4 className="font-medium text-gray-800">Scientific Foundation</h4>
            <p className="text-sm text-gray-600">Grounded in positive psychology, HCI research, and ethical AI principles</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-medium text-gray-800">Human-Centered Design</h4>
            <p className="text-sm text-gray-600">Always prioritize human needs, values, and wellbeing over technical metrics</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">⚖️</div>
            <h4 className="font-medium text-gray-800">Ethics-First Approach</h4>
            <p className="text-sm text-gray-600">Integrate fairness, transparency, and safety into every design decision</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-800">Impact Measurement</h4>
            <p className="text-sm text-gray-600">Learn to measure and optimize for genuine human flourishing outcomes</p>
          </div>
        </div>
      </div>

      {/* Specialization Tracks */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Choose Your Agent Design Specialization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 p-6 cursor-pointer transition-all hover:shadow-md"
              onClick={() => setCurrentTrack(track.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{track.icon}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{track.title}</h4>
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded-full",
                      track.difficulty === 'Foundation' && "bg-green-100 text-green-700",
                      track.difficulty === 'Practitioner' && "bg-blue-100 text-blue-700",
                      track.difficulty === 'Expert' && "bg-purple-100 text-purple-700"
                    )}>
                      {track.difficulty}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{track.timeEstimate}</span>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{track.description}</p>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Research Foundation:</h5>
                  <div className="flex flex-wrap gap-1">
                    {track.researchBase.slice(0, 2).map((research, index) => (
                      <span key={index} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                        {research}
                      </span>
                    ))}
                    {track.researchBase.length > 2 && (
                      <span className="text-xs text-gray-500">+{track.researchBase.length - 2} more</span>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Flourishing Outcomes:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {track.flourishingOutcomes.slice(0, 2).map((outcome, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Start Designing →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      {(progress.wellbeingAgents > 0 || progress.learningAgents > 0 || progress.connectionAgents > 0 || progress.purposeAgents > 0) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Agent Design Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.wellbeingAgents}</div>
              <div className="text-sm text-gray-600">Wellbeing Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.learningAgents}</div>
              <div className="text-sm text-gray-600">Learning Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{progress.connectionAgents}</div>
              <div className="text-sm text-gray-600">Connection Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{progress.purposeAgents}</div>
              <div className="text-sm text-gray-600">Purpose Agents</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Flourishing Design Mastery</span>
              <span>{progress.overallFlourishingDesign}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.overallFlourishingDesign}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentTrack = () => {
    switch (currentTrack) {
      case 'wellbeing':
        return <WellbeingAgentDesigner />;
      case 'learning':
        return <LearningAgentDesigner />;
      case 'connection':
        return <ConnectionAgentDesigner />;
      case 'purpose':
        return <PurposeAgentDesigner />;
      case 'multimodel':
        return <MultiModelAgentDesigner />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentTrack !== 'overview' && (
          <div className="mb-6">
            <button
              onClick={() => setCurrentTrack('overview')}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              ← Back to Academy Overview
            </button>
          </div>
        )}

        {renderCurrentTrack()}
      </div>
    </div>
  );
};

export default AgentDesignAcademy;