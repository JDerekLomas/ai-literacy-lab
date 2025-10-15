'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { PromptMasterClient } from '@/lib/api-client';

interface PromptExercise {
  id: string;
  title: string;
  scenario: string;
  goal: string;
  badExample: string;
  goodExample: string;
  principles: string[];
  userPrompt: string;
  feedback: string;
  difficulty: 1 | 2 | 3;
}

interface PromptFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  rewriteSuggestion: string;
}

export const PromptMasterAgent: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<PromptExercise | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');

  const exercises: PromptExercise[] = [
    {
      id: 'clarity-basics',
      title: 'Clear Communication Fundamentals',
      scenario: 'You want to learn a new skill for your career.',
      goal: 'Get a specific, actionable learning plan from Claude.',
      badExample: 'Help me learn programming.',
      goodExample: 'I\'m a marketing professional with no coding experience. I want to learn Python to automate my data analysis tasks. Can you create a 12-week learning plan with specific weekly goals, recommended resources, and practice projects that relate to marketing analytics?',
      principles: [
        'Be specific about your context and background',
        'Define clear, measurable outcomes',
        'Specify timeframes and constraints',
        'Ask for structured, actionable responses'
      ],
      userPrompt: '',
      feedback: '',
      difficulty: 1
    },
    {
      id: 'context-setting',
      title: 'Context Setting for Better Results',
      scenario: 'You need help making a difficult personal decision.',
      goal: 'Get thoughtful guidance that considers your specific situation.',
      badExample: 'Should I change careers?',
      goodExample: 'I\'m a 32-year-old software engineer at a stable company, but I\'m passionate about environmental conservation. I have a mortgage and two young children. I\'m considering transitioning to a role in clean energy, but I\'m worried about financial stability and starting over. Can you help me think through this decision by asking clarifying questions and then providing a framework for evaluating this choice?',
      principles: [
        'Provide relevant personal context',
        'Explain your constraints and concerns',
        'Ask for structured thinking approaches',
        'Request clarifying questions when needed'
      ],
      userPrompt: '',
      feedback: '',
      difficulty: 2
    },
    {
      id: 'iterative-refinement',
      title: 'Iterative Refinement Mastery',
      scenario: 'You\'re writing a proposal and need it to be compelling.',
      goal: 'Use follow-up prompts to refine and improve your work.',
      badExample: 'Make this proposal better.',
      goodExample: 'I\'m writing a proposal to implement a remote work policy at my traditional office-based company. Here\'s my draft: [draft]. Please analyze this for: 1) Clarity of benefits, 2) Addressing likely concerns, 3) Strength of evidence. Then suggest specific improvements for the weakest area.',
      principles: [
        'Share your work for specific feedback',
        'Ask for targeted analysis areas',
        'Request prioritized improvement suggestions',
        'Build on previous responses iteratively'
      ],
      userPrompt: '',
      feedback: '',
      difficulty: 3
    },
    {
      id: 'goal-decomposition',
      title: 'Breaking Down Complex Goals',
      scenario: 'You have a big life goal that feels overwhelming.',
      goal: 'Transform a vague aspiration into actionable steps.',
      badExample: 'I want to be healthier.',
      goodExample: 'I want to improve my overall health and energy levels. I currently work a sedentary desk job, eat irregularly due to a busy schedule, and sleep 5-6 hours nightly. My goal is to feel more energetic and reduce stress over the next 6 months. Can you help me break this into 3-4 specific, measurable sub-goals and create action plans for each?',
      principles: [
        'Start with current state description',
        'Define specific timeframes',
        'Ask for measurable sub-goals',
        'Request action plans for each area'
      ],
      userPrompt: '',
      feedback: '',
      difficulty: 2
    },
    {
      id: 'creative-collaboration',
      title: 'Creative Collaboration with AI',
      scenario: 'You need creative ideas for a project or problem.',
      goal: 'Generate innovative solutions through collaborative brainstorming.',
      badExample: 'Give me ideas for my business.',
      goodExample: 'I run a small local bookstore struggling to compete with online retailers. I want to create unique experiences that draw people to physical visits. My space includes a café area, and my customers value community connection. Let\'s brainstorm creative revenue streams and experiences. Please suggest 5 ideas, then we can build on the most promising ones together.',
      principles: [
        'Describe your constraints and assets',
        'Specify the type of creativity needed',
        'Ask for a specific number of initial ideas',
        'Plan for collaborative development'
      ],
      userPrompt: '',
      feedback: '',
      difficulty: 3
    }
  ];

  const analyzePrompt = useCallback(async (prompt: string, exercise: PromptExercise): Promise<PromptFeedback> => {
    try {
      const response = await PromptMasterClient.analyzePrompt(prompt, exercise.scenario);

      if (response.error) {
        // Fallback to simulated analysis if API fails
        return {
          score: 50,
          strengths: ['Attempted prompt analysis'],
          improvements: ['API unavailable - check your configuration'],
          rewriteSuggestion: 'Please configure your Claude API key to get real feedback.'
        };
      }

      // Parse Claude's response
      const content = response.content;
      const scoreMatch = content.match(/SCORE:\s*(\d+)/);
      const strengthsMatch = content.match(/STRENGTHS:\s*((?:- .+\n?)+)/);
      const improvementsMatch = content.match(/IMPROVEMENTS:\s*((?:- .+\n?)+)/);
      const rewrittenMatch = content.match(/REWRITTEN:\s*([\s\S]+?)(?:\n\n|$)/);

      return {
        score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
        strengths: strengthsMatch
          ? strengthsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace('- ', '').trim())
          : ['Analysis completed'],
        improvements: improvementsMatch
          ? improvementsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace('- ', '').trim())
          : ['Continue practicing'],
        rewriteSuggestion: rewrittenMatch ? rewrittenMatch[1].trim() : 'Keep refining your approach.'
      };
    } catch (error) {
      console.error('Prompt analysis error:', error);
      return {
        score: 50,
        strengths: ['Attempted analysis'],
        improvements: ['There was an error analyzing your prompt'],
        rewriteSuggestion: 'Please try again or check your API configuration.'
      };
    }
  }, []);

  const submitPrompt = useCallback(async () => {
    if (!currentExercise || !userPrompt.trim()) return;

    setIsLoading(true);
    try {
      const feedback = await analyzePrompt(userPrompt, currentExercise);
      setApiResponse(JSON.stringify(feedback));
      setShowFeedback(true);
      setPromptHistory(prev => [...prev, userPrompt]);

      if (feedback.score >= 70 && !completedExercises.includes(currentExercise.id)) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setApiResponse('Error analyzing prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, currentExercise, analyzePrompt, completedExercises]);

  const selectExercise = useCallback((exercise: PromptExercise) => {
    setCurrentExercise(exercise);
    setUserPrompt('');
    setShowFeedback(false);
    setApiResponse('');
    setIsLoading(false);
  }, []);

  const renderExerciseList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className={clsx(
            "p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg",
            completedExercises.includes(exercise.id)
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-white hover:border-blue-400"
          )}
          onClick={() => selectExercise(exercise)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {exercise.title}
            </h3>
            <div className="flex items-center gap-2">
              {completedExercises.includes(exercise.id) && (
                <span className="text-green-600 text-xl">✓</span>
              )}
              <span className={clsx(
                "px-2 py-1 text-xs rounded",
                exercise.difficulty === 1 && "bg-green-100 text-green-700",
                exercise.difficulty === 2 && "bg-yellow-100 text-yellow-700",
                exercise.difficulty === 3 && "bg-red-100 text-red-700"
              )}>
                Level {exercise.difficulty}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-3">{exercise.scenario}</p>
          <p className="text-sm text-blue-600 font-medium">
            Goal: {exercise.goal}
          </p>
        </div>
      ))}
    </div>
  );

  const renderExerciseDetail = () => {
    if (!currentExercise) return null;

    const feedback = showFeedback && apiResponse ? (() => {
      try {
        return JSON.parse(apiResponse);
      } catch (error) {
        console.error('Error parsing feedback:', error);
        return {
          score: 50,
          strengths: ['Analysis completed'],
          improvements: ['Error parsing response'],
          rewriteSuggestion: 'Please try again.'
        };
      }
    })() : null;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentExercise(null)}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          ← Back to Exercises
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentExercise.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Scenario</h3>
              <p className="text-gray-600 mb-4">{currentExercise.scenario}</p>

              <h3 className="font-semibold text-gray-800 mb-2">Your Goal</h3>
              <p className="text-blue-600 font-medium">{currentExercise.goal}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Key Principles</h3>
              <ul className="space-y-1">
                {currentExercise.principles.map((principle, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="text-blue-500 mr-2">•</span>
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-700 mb-2">❌ Weak Example</h4>
                <p className="text-sm text-gray-600 italic">"{currentExercise.badExample}"</p>
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-2">✅ Strong Example</h4>
                <p className="text-sm text-gray-600 italic">"{currentExercise.goodExample}"</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Prompt (try to apply the principles above):
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Write your prompt here..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={submitPrompt}
              disabled={!userPrompt.trim() || isLoading}
              className={clsx(
                "w-full py-3 px-6 rounded-lg font-medium",
                userPrompt.trim() && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Analyzing with Claude...
                </div>
              ) : (
                'Analyze My Prompt'
              )}
            </button>
          </div>

          {feedback && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-800">Prompt Analysis</h3>
                <div className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  feedback.score >= 80 && "bg-green-100 text-green-700",
                  feedback.score >= 60 && feedback.score < 80 && "bg-yellow-100 text-yellow-700",
                  feedback.score < 60 && "bg-red-100 text-red-700"
                )}>
                  Score: {feedback.score}/100
                </div>
              </div>

              {feedback.strengths.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-green-700 mb-1">Strengths:</h4>
                  <ul className="text-sm text-green-600">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-orange-700 mb-1">Areas for Improvement:</h4>
                  <ul className="text-sm text-orange-600">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.rewriteSuggestion && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-1">Suggested Approach:</h4>
                  <p className="text-sm text-blue-600 italic">{feedback.rewriteSuggestion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Prompt Mastery Agent
          </h1>
          <p className="text-gray-600">
            Master the art of communicating effectively with AI to achieve your goals
          </p>
        </div>

        {!currentExercise ? renderExerciseList() : renderExerciseDetail()}

        {completedExercises.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Progress</h3>
            <p className="text-green-700">
              Completed: {completedExercises.length}/{exercises.length} exercises
            </p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptMasterAgent;