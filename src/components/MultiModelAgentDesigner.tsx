'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { useAuth } from './AuthProvider';
import { ProgressTracker } from '@/lib/progress';
import { availableModels, callMultiModelAPI, recommendModel, calculateCost, compareModels, type AIModel } from '@/lib/multi-model-client';

interface ModelExercise {
  id: string;
  title: string;
  phase: 'Foundation' | 'Optimization' | 'Cost-Engineering' | 'Production';
  scenario: string;
  learningObjective: string;
  modelConstraints: {
    maxBudget?: number;
    requiredFeatures?: string[];
    volumeRequirements?: string;
  };
  designChallenge: string;
  successCriteria: string[];
  costEfficiencyGoal: string;
  difficulty: 1 | 2 | 3;
}

interface ModelSelectionFeedback {
  score: number;
  costEfficiency: number;
  performanceMatch: number;
  technicalSuitability: number;
  businessViability: number;
  strengths: string[];
  improvements: string[];
  alternativeRecommendations: string[];
  budgetAnalysis: string;
}

export const MultiModelAgentDesigner: React.FC = () => {
  const { user } = useAuth();
  const [currentExercise, setCurrentExercise] = useState<ModelExercise | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [designRationale, setDesignRationale] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [costComparison, setCostComparison] = useState<AIModel[]>([]);

  const exercises: ModelExercise[] = [
    {
      id: 'budget-conscious-learning',
      title: 'Budget-Conscious Learning Assistant',
      phase: 'Foundation',
      scenario: 'A nonprofit educational organization wants to create an AI tutor for 10,000 students in developing countries. They have a limited budget of $500/month and need basic question answering and explanation capabilities.',
      learningObjective: 'Learn to select cost-effective models that maximize educational impact within strict budget constraints.',
      modelConstraints: {
        maxBudget: 500,
        requiredFeatures: ['Text generation', 'Educational content'],
        volumeRequirements: 'High volume (100k+ interactions/month)'
      },
      designChallenge: 'Select an AI model and design a system that can serve 10,000 students with quality educational interactions while staying within the $500 monthly budget. Consider token costs, response quality, and scaling factors.',
      successCriteria: [
        'Stays within $500 monthly budget',
        'Provides quality educational responses',
        'Can handle high volume of student interactions',
        'Considers regional latency and availability',
        'Includes cost monitoring and optimization strategies'
      ],
      costEfficiencyGoal: 'Achieve maximum educational impact per dollar spent, targeting <$0.0005 per meaningful student interaction.',
      difficulty: 1
    },
    {
      id: 'multilingual-wellbeing-support',
      title: 'Multilingual Wellbeing Support System',
      phase: 'Optimization',
      scenario: 'A global mental health platform needs to provide emotional support in 12 languages. They need empathetic responses, cultural sensitivity, and 24/7 availability for users across different economic backgrounds.',
      learningObjective: 'Optimize model selection for multilingual capabilities while balancing cost, quality, and cultural competency.',
      modelConstraints: {
        maxBudget: 2000,
        requiredFeatures: ['Multilingual support', 'Empathy modeling', 'Cultural sensitivity'],
        volumeRequirements: 'Medium volume (50k interactions/month)'
      },
      designChallenge: 'Design a multi-model system that uses different AI models for different languages and risk levels. Consider using cheaper models for basic support and premium models for crisis situations.',
      successCriteria: [
        'Supports 12 languages with cultural competency',
        'Escalates high-risk situations to premium models',
        'Optimizes cost by routing simple queries to cheaper models',
        'Maintains consistent empathy and safety across models',
        'Includes performance monitoring for each language'
      ],
      costEfficiencyGoal: 'Provide culturally competent support while reducing costs by 40% compared to single premium model approach.',
      difficulty: 2
    },
    {
      id: 'real-time-personalization-engine',
      title: 'Real-Time Learning Personalization Engine',
      phase: 'Cost-Engineering',
      scenario: 'An adaptive learning platform needs to personalize content for 100,000 active learners in real-time. The system must analyze learning patterns, generate custom explanations, and adapt difficulty instantly.',
      learningObjective: 'Engineer a cost-optimized multi-model architecture that delivers personalization at scale.',
      modelConstraints: {
        maxBudget: 5000,
        requiredFeatures: ['Real-time processing', 'Personalization', 'Learning analytics'],
        volumeRequirements: 'Very high volume (1M+ interactions/month)'
      },
      designChallenge: 'Design a tiered model architecture using different AI models for different personalization tasks. Use fast, cheap models for routine tasks and premium models for complex reasoning.',
      successCriteria: [
        'Handles 1M+ monthly interactions within budget',
        'Delivers personalized responses in <2 seconds',
        'Uses model routing based on query complexity',
        'Includes intelligent caching and optimization',
        'Maintains learning effectiveness metrics'
      ],
      costEfficiencyGoal: 'Achieve sub-$0.005 cost per personalized interaction while maintaining 85%+ learning effectiveness.',
      difficulty: 3
    },
    {
      id: 'enterprise-deployment-strategy',
      title: 'Enterprise AI Agent Deployment Strategy',
      phase: 'Production',
      scenario: 'A Fortune 500 company wants to deploy AI agents across 50,000 employees for various tasks: customer support, internal knowledge search, creative brainstorming, and strategic analysis. Different use cases have different quality and cost requirements.',
      learningObjective: 'Design a production-ready multi-model strategy that balances performance, cost, compliance, and scalability.',
      modelConstraints: {
        maxBudget: 25000,
        requiredFeatures: ['Enterprise compliance', 'Multi-use case support', 'High availability'],
        volumeRequirements: 'Enterprise scale (5M+ interactions/month)'
      },
      designChallenge: 'Create a comprehensive multi-model deployment strategy that routes different types of requests to optimal models based on complexity, sensitivity, and cost. Include fallback strategies, monitoring, and cost controls.',
      successCriteria: [
        'Serves 5M+ monthly interactions across diverse use cases',
        'Implements intelligent routing based on request type',
        'Maintains enterprise security and compliance',
        'Includes comprehensive cost monitoring and alerts',
        'Provides consistent user experience across models'
      ],
      costEfficiencyGoal: 'Optimize total cost of ownership while maintaining 95%+ user satisfaction across all use cases.',
      difficulty: 3
    }
  ];

  // Load user progress
  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setCompletedExercises([]);
      setAttempts({});
    }
    // Load cost comparison data
    setCostComparison(compareModels(availableModels, 'cost'));
  }, [user]);

  const loadUserProgress = async (): Promise<void> => {
    try {
      const completed = await ProgressTracker.getCompletedExercises();
      const multiModelCompleted = completed.filter(id =>
        exercises.some(ex => ex.id === id)
      );
      setCompletedExercises(multiModelCompleted);

      const allProgress = await ProgressTracker.getAllProgress();
      const attemptCounts: Record<string, number> = {};
      allProgress.forEach(progress => {
        if (exercises.some(ex => ex.id === progress.exercise_id)) {
          attemptCounts[progress.exercise_id] = progress.attempts;
        }
      });
      setAttempts(attemptCounts);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const analyzeModelSelection = useCallback(async (
    modelId: string,
    rationale: string,
    exercise: ModelExercise
  ): Promise<ModelSelectionFeedback> => {
    try {
      const selectedModelConfig = availableModels.find(m => m.id === modelId);
      if (!selectedModelConfig) {
        throw new Error('Invalid model selection');
      }

      const analysisPrompt = `
You are an expert in AI model selection, cost optimization, and system architecture. Analyze this model selection for a multi-model AI agent system.

EXERCISE: ${exercise.title}
SCENARIO: ${exercise.scenario}
BUDGET CONSTRAINT: $${exercise.modelConstraints.maxBudget}/month
VOLUME: ${exercise.modelConstraints.volumeRequirements}
REQUIRED FEATURES: ${exercise.modelConstraints.requiredFeatures?.join(', ')}

SELECTED MODEL: ${selectedModelConfig.name} (${selectedModelConfig.provider})
MODEL COST: $${selectedModelConfig.costPer1kTokens}/1k tokens
MODEL STRENGTHS: ${selectedModelConfig.strengths.join(', ')}

USER'S RATIONALE:
${rationale}

Analyze this selection considering:
1. Cost efficiency for the given volume
2. Technical suitability for requirements
3. Performance vs. cost trade-offs
4. Scalability and operational considerations
5. Alternative model recommendations

Provide feedback in this exact format:

COST_EFFICIENCY: [0-100 - How cost-effective is this choice?]
PERFORMANCE_MATCH: [0-100 - How well does model capability match needs?]
TECHNICAL_SUITABILITY: [0-100 - Technical fit for requirements?]
BUSINESS_VIABILITY: [0-100 - Viable for business constraints?]
OVERALL_SCORE: [0-100 - Overall quality of selection]

STRENGTHS:
- [Strength 1]
- [Strength 2]
- [Strength 3]

IMPROVEMENTS:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

ALTERNATIVES:
- [Alternative model recommendation 1 with rationale]
- [Alternative model recommendation 2 with rationale]

BUDGET_ANALYSIS:
[Detailed analysis of projected costs and budget efficiency]
      `;

      const response = await callMultiModelAPI({
        model: 'claude-3-5-sonnet-20241022', // Use premium model for analysis
        prompt: analysisPrompt,
        system: 'You are an expert AI consultant specializing in model selection and cost optimization.',
        maxTokens: 1500
      });

      if (response.error) {
        return {
          score: 50,
          costEfficiency: 50,
          performanceMatch: 50,
          technicalSuitability: 50,
          businessViability: 50,
          strengths: ['Analysis attempted'],
          improvements: ['API unavailable - check configuration'],
          alternativeRecommendations: ['Please configure API access'],
          budgetAnalysis: 'Analysis unavailable due to API error.'
        };
      }

      const content = response.content;

      // Parse structured response
      const costMatch = content.match(/COST_EFFICIENCY:\s*(\d+)/);
      const performanceMatch = content.match(/PERFORMANCE_MATCH:\s*(\d+)/);
      const technicalMatch = content.match(/TECHNICAL_SUITABILITY:\s*(\d+)/);
      const businessMatch = content.match(/BUSINESS_VIABILITY:\s*(\d+)/);
      const overallMatch = content.match(/OVERALL_SCORE:\s*(\d+)/);

      const strengthsMatch = content.match(/STRENGTHS:\s*((?:- .+\n?)+)/);
      const improvementsMatch = content.match(/IMPROVEMENTS:\s*((?:- .+\n?)+)/);
      const alternativesMatch = content.match(/ALTERNATIVES:\s*((?:- .+\n?)+)/);
      const budgetMatch = content.match(/BUDGET_ANALYSIS:\s*([\\s\\S]+?)(?:\\n\\n|$)/);

      const parseList = (match: RegExpMatchArray | null): string[] => {
        if (!match) return [];
        return match[1].split('\\n').filter(s => s.trim()).map(s => s.replace('- ', '').trim());
      };

      return {
        score: overallMatch ? parseInt(overallMatch[1]) : 50,
        costEfficiency: costMatch ? parseInt(costMatch[1]) : 50,
        performanceMatch: performanceMatch ? parseInt(performanceMatch[1]) : 50,
        technicalSuitability: technicalMatch ? parseInt(technicalMatch[1]) : 50,
        businessViability: businessMatch ? parseInt(businessMatch[1]) : 50,
        strengths: parseList(strengthsMatch),
        improvements: parseList(improvementsMatch),
        alternativeRecommendations: parseList(alternativesMatch),
        budgetAnalysis: budgetMatch ? budgetMatch[1].trim() : 'Budget analysis unavailable.'
      };
    } catch (error) {
      console.error('Model selection analysis error:', error);
      return {
        score: 50,
        costEfficiency: 50,
        performanceMatch: 50,
        technicalSuitability: 50,
        businessViability: 50,
        strengths: ['Analysis attempted'],
        improvements: ['Error analyzing selection'],
        alternativeRecommendations: ['Please try again'],
        budgetAnalysis: 'Analysis failed due to error.'
      };
    }
  }, []);

  const submitSelection = useCallback(async () => {
    if (!currentExercise || !selectedModel || !designRationale.trim()) return;

    setIsLoading(true);
    try {
      const currentAttempts = (attempts[currentExercise.id] || 0) + 1;
      setAttempts(prev => ({
        ...prev,
        [currentExercise.id]: currentAttempts
      }));

      if (user) {
        await ProgressTracker.incrementAttempts(currentExercise.id);
      }

      const feedback = await analyzeModelSelection(selectedModel, designRationale, currentExercise);
      setApiResponse(JSON.stringify(feedback));
      setShowFeedback(true);

      const isCompleted = feedback.score >= 75;
      const wasAlreadyCompleted = completedExercises.includes(currentExercise.id);

      if (isCompleted && !wasAlreadyCompleted) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);

        if (user) {
          await ProgressTracker.saveProgress({
            exerciseId: currentExercise.id,
            completed: true,
            score: feedback.score,
            attempts: currentAttempts
          });
        }
      } else if (user) {
        await ProgressTracker.saveProgress({
          exerciseId: currentExercise.id,
          completed: false,
          score: feedback.score,
          attempts: currentAttempts
        });
      }
    } catch (error) {
      console.error('Error submitting selection:', error);
      setApiResponse('Error analyzing selection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, designRationale, currentExercise, analyzeModelSelection, completedExercises, attempts, user]);

  const selectExercise = useCallback((exercise: ModelExercise) => {
    setCurrentExercise(exercise);
    setSelectedModel('');
    setDesignRationale('');
    setShowFeedback(false);
    setApiResponse('');
    setIsLoading(false);
  }, []);

  const renderModelSelector = () => {
    if (!currentExercise) return null;

    const budget = currentExercise.modelConstraints.maxBudget || 1000;
    const estimatedVolume = currentExercise.modelConstraints.volumeRequirements?.includes('100k') ? 100000 :
      currentExercise.modelConstraints.volumeRequirements?.includes('1M') ? 1000000 :
      currentExercise.modelConstraints.volumeRequirements?.includes('5M') ? 5000000 : 50000;

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Select AI Model</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModels.map((model) => {
            const estimatedCost = calculateCost(150, 300, model) * (estimatedVolume / 1000); // Rough estimate
            const isAffordable = estimatedCost <= budget;

            return (
              <div
                key={model.id}
                className={clsx(
                  "p-4 border-2 rounded-lg cursor-pointer transition-all",
                  selectedModel === model.id
                    ? "border-purple-500 bg-purple-50"
                    : isAffordable
                    ? "border-gray-300 hover:border-purple-300"
                    : "border-red-300 bg-red-50"
                )}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800 text-sm">{model.name}</h5>
                  <span className={clsx(
                    "text-xs px-2 py-1 rounded",
                    model.provider === 'qwen' && "bg-orange-100 text-orange-700",
                    model.provider === 'anthropic' && "bg-blue-100 text-blue-700",
                    model.provider === 'openai' && "bg-green-100 text-green-700"
                  )}>
                    {model.provider}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per 1k tokens:</span>
                    <span className="font-medium">${model.costPer1kTokens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. monthly cost:</span>
                    <span className={clsx(
                      "font-medium",
                      isAffordable ? "text-green-600" : "text-red-600"
                    )}>
                      ${estimatedCost.toFixed(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Strengths:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.strengths.slice(0, 2).map((strength, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {!isAffordable && (
                  <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                    Exceeds budget by ${(estimatedCost - budget).toFixed(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExerciseList = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ⚡ Multi-Model AI Skills
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Master cost-effective AI agent design by learning to select and optimize different AI models
          (Claude, Qwen, GPT) for maximum impact within budget constraints.
        </p>
      </div>

      {!user && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-orange-800 mb-2">
            <strong>Sign in to track your multi-model expertise!</strong>
          </p>
          <p className="text-orange-600 text-sm">
            Guest mode: Progress won't be saved between sessions.
          </p>
        </div>
      )}

      {/* Cost Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Model Cost Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Model</th>
                <th className="text-left py-2">Provider</th>
                <th className="text-left py-2">Cost/1k Tokens</th>
                <th className="text-left py-2">Best For</th>
                <th className="text-left py-2">Savings vs Premium</th>
              </tr>
            </thead>
            <tbody>
              {costComparison.slice(0, 6).map((model, index) => {
                const premiumCost = availableModels.find(m => m.id === 'claude-3-5-sonnet-20241022')?.costPer1kTokens || 0.003;
                const savings = Math.round(((premiumCost - model.costPer1kTokens) / premiumCost) * 100);

                return (
                  <tr key={model.id} className="border-b">
                    <td className="py-2 font-medium">{model.name}</td>
                    <td className="py-2">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs",
                        model.provider === 'qwen' && "bg-orange-100 text-orange-700",
                        model.provider === 'anthropic' && "bg-blue-100 text-blue-700",
                        model.provider === 'openai' && "bg-green-100 text-green-700"
                      )}>
                        {model.provider}
                      </span>
                    </td>
                    <td className="py-2">${model.costPer1kTokens}</td>
                    <td className="py-2 text-xs text-gray-600">{model.bestFor[0]}</td>
                    <td className="py-2">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs",
                        savings > 70 ? "bg-green-100 text-green-700" :
                        savings > 30 ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {savings > 0 ? `${savings}% savings` : 'Premium'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exercises.map((exercise) => {
          const attemptCount = attempts[exercise.id] || 0;
          const isCompleted = completedExercises.includes(exercise.id);

          return (
            <div
              key={exercise.id}
              className={clsx(
                "bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg p-6",
                isCompleted
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-orange-400"
              )}
              onClick={() => selectExercise(exercise)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {exercise.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded-full",
                      exercise.phase === 'Foundation' && "bg-blue-100 text-blue-700",
                      exercise.phase === 'Optimization' && "bg-purple-100 text-purple-700",
                      exercise.phase === 'Cost-Engineering' && "bg-orange-100 text-orange-700",
                      exercise.phase === 'Production' && "bg-green-100 text-green-700"
                    )}>
                      {exercise.phase}
                    </span>
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded-full",
                      exercise.difficulty === 1 && "bg-gray-100 text-gray-700",
                      exercise.difficulty === 2 && "bg-yellow-100 text-yellow-700",
                      exercise.difficulty === 3 && "bg-red-100 text-red-700"
                    )}>
                      Level {exercise.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-green-600 text-lg">✓</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">{exercise.scenario}</p>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Budget:</span>
                  <span className="text-green-600 ml-1">${exercise.modelConstraints.maxBudget}/month</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Volume:</span>
                  <span className="text-blue-600 ml-1">{exercise.modelConstraints.volumeRequirements}</span>
                </div>

                <div>
                  <span className="font-medium text-orange-700">Cost Goal:</span>
                  <p className="text-orange-600">{exercise.costEfficiencyGoal}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                  Optimize Model Selection →
                </span>
                {attemptCount > 0 && (
                  <span className="text-xs text-gray-500">
                    {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedExercises.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-2">⚡ Multi-Model Mastery Progress</h3>
          <p className="text-orange-700 mb-2">
            Completed: {completedExercises.length}/{exercises.length} optimization challenges
          </p>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
            />
          </div>
          <p className="text-orange-600 text-sm mt-2">
            Master cost-effective AI for maximum impact! 🚀
          </p>
        </div>
      )}
    </div>
  );

  const renderExerciseDetail = () => {
    if (!currentExercise) return null;

    const feedback = showFeedback && apiResponse ? (() => {
      try {
        return JSON.parse(apiResponse);
      } catch (error) {
        console.error('Error parsing feedback:', error);
        return null;
      }
    })() : null;

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => setCurrentExercise(null)}
          className="text-orange-600 hover:text-orange-800 flex items-center"
        >
          ← Back to Multi-Model Challenges
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentExercise.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "text-sm px-3 py-1 rounded-full",
                  currentExercise.phase === 'Foundation' && "bg-blue-100 text-blue-700",
                  currentExercise.phase === 'Optimization' && "bg-purple-100 text-purple-700",
                  currentExercise.phase === 'Cost-Engineering' && "bg-orange-100 text-orange-700",
                  currentExercise.phase === 'Production' && "bg-green-100 text-green-700"
                )}>
                  {currentExercise.phase} Phase
                </span>
                <span className="text-sm text-gray-500">Level {currentExercise.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Scenario & Constraints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">📖 Scenario</h3>
                <p className="text-gray-600 text-sm">{currentExercise.scenario}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Learning Objective</h3>
                <p className="text-blue-600 text-sm font-medium">{currentExercise.learningObjective}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">💰 Budget Constraints</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Budget:</span>
                    <span className="font-medium text-green-600">${currentExercise.modelConstraints.maxBudget}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium text-blue-600">{currentExercise.modelConstraints.volumeRequirements}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">⚡ Required Features</h3>
                <ul className="space-y-1">
                  {currentExercise.modelConstraints.requiredFeatures?.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">🎨 Optimization Challenge</h3>
            <p className="text-orange-700 text-sm mb-3">{currentExercise.designChallenge}</p>

            <h4 className="font-medium text-orange-800 mb-2">Success Criteria:</h4>
            <ul className="space-y-1">
              {currentExercise.successCriteria.map((criteria, index) => (
                <li key={index} className="text-sm text-orange-600 flex items-start">
                  <span className="text-orange-500 mr-2 mt-1">✓</span>
                  {criteria}
                </li>
              ))}
            </ul>

            <div className="mt-3 p-3 bg-orange-100 rounded">
              <h4 className="font-medium text-orange-800 mb-1">Cost Efficiency Goal:</h4>
              <p className="text-sm text-orange-700">{currentExercise.costEfficiencyGoal}</p>
            </div>
          </div>

          {/* Model Selection */}
          {renderModelSelector()}

          {/* Design Rationale */}
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Rationale & Architecture (Explain your model choice, cost optimization strategy, and implementation approach):
              </label>
              <textarea
                value={designRationale}
                onChange={(e) => setDesignRationale(e.target.value)}
                placeholder="Explain your model selection rationale, cost optimization strategy, scaling approach, and how you'll monitor performance..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            <button
              onClick={submitSelection}
              disabled={!selectedModel || !designRationale.trim() || isLoading}
              className={clsx(
                "w-full py-3 px-6 rounded-lg font-medium",
                selectedModel && designRationale.trim() && !isLoading
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Analyzing Model Selection...
                </div>
              ) : (
                'Get Expert Cost Optimization Feedback'
              )}
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-800">🔍 Model Selection Analysis</h3>
                <div className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  feedback.score >= 85 && "bg-green-100 text-green-700",
                  feedback.score >= 70 && feedback.score < 85 && "bg-yellow-100 text-yellow-700",
                  feedback.score < 70 && "bg-red-100 text-red-700"
                )}>
                  Overall Score: {feedback.score}/100
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{feedback.costEfficiency}</div>
                  <div className="text-xs text-gray-600">Cost Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{feedback.performanceMatch}</div>
                  <div className="text-xs text-gray-600">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{feedback.technicalSuitability}</div>
                  <div className="text-xs text-gray-600">Technical Fit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{feedback.businessViability}</div>
                  <div className="text-xs text-gray-600">Business Viability</div>
                </div>
              </div>

              {feedback.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">✅ Selection Strengths:</h4>
                  <ul className="text-sm text-green-600 space-y-1">
                    {feedback.strengths.map((strength: string, index: number) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">🔧 Optimization Opportunities:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    {feedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.alternativeRecommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">🔄 Alternative Models to Consider:</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {feedback.alternativeRecommendations.map((alt: string, index: number) => (
                      <li key={index}>• {alt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.budgetAnalysis && (
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">💰 Budget Analysis:</h4>
                  <p className="text-sm text-purple-600 bg-purple-100 p-3 rounded">
                    {feedback.budgetAnalysis}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!currentExercise ? renderExerciseList() : renderExerciseDetail()}
      </div>
    </div>
  );
};

export default MultiModelAgentDesigner;