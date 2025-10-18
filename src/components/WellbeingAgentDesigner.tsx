'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { PromptMasterClient } from '@/lib/api-client';
import { useAuth } from './AuthProvider';
import { ProgressTracker } from '@/lib/progress';

interface WellbeingDesignExercise {
  id: string;
  title: string;
  phase: 'Foundation' | 'Design' | 'Implementation' | 'Evaluation';
  scenario: string;
  learningObjective: string;
  researchBase: string[];
  ethicalConsiderations: string[];
  designChallenge: string;
  successCriteria: string[];
  flourishingOutcome: string;
  difficulty: 1 | 2 | 3;
}

interface DesignFeedback {
  score: number;
  empathyAlignment: number;
  safetyConsiderations: number;
  ethicalAwareness: number;
  flourishingPotential: number;
  strengths: string[];
  improvements: string[];
  researchRecommendations: string[];
  redesignSuggestion: string;
}

export const WellbeingAgentDesigner: React.FC = () => {
  const { user } = useAuth();
  const [currentExercise, setCurrentExercise] = useState<WellbeingDesignExercise | null>(null);
  const [userDesign, setUserDesign] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const exercises: WellbeingDesignExercise[] = [
    {
      id: 'empathy-foundation',
      title: 'Empathy-First System Design',
      phase: 'Foundation',
      scenario: 'A university student named Alex is struggling with anxiety about upcoming exams and feels isolated from peers. They need an AI companion that can provide emotional support.',
      learningObjective: 'Design an AI system prompt that demonstrates genuine empathy while maintaining appropriate boundaries and safety protocols.',
      researchBase: [
        'Carl Rogers\' Core Conditions (empathy, unconditional positive regard, congruence)',
        'Emotional validation techniques from DBT therapy',
        'Crisis risk assessment protocols',
        'PERMA model for positive emotion cultivation'
      ],
      ethicalConsiderations: [
        'When should the AI escalate to human support?',
        'How do we avoid replacing human connections?',
        'What privacy safeguards are needed for emotional data?',
        'How do we prevent over-dependence on the AI?'
      ],
      designChallenge: 'Create a system prompt for an AI companion that can recognize Alex\'s emotional state, provide empathetic responses, validate their feelings, and gently guide them toward evidence-based coping strategies. The AI should know when to suggest human support.',
      successCriteria: [
        'Demonstrates genuine empathy and emotional validation',
        'Includes clear crisis escalation protocols',
        'Suggests evidence-based coping strategies',
        'Maintains appropriate boundaries (not therapy replacement)',
        'Promotes human connection alongside AI support'
      ],
      flourishingOutcome: 'Alex feels genuinely understood, learns healthy coping skills, and is encouraged to build real human connections.',
      difficulty: 1
    },
    {
      id: 'habit-formation-coach',
      title: 'Personalized Habit Formation Agent',
      phase: 'Design',
      scenario: 'Maria is a busy working parent who wants to build a consistent meditation practice but struggles with motivation and finding time. She needs an AI coach that adapts to her unpredictable schedule.',
      learningObjective: 'Design a behavior change system that applies habit formation science while respecting individual autonomy and diverse life circumstances.',
      researchBase: [
        'James Clear\'s Atomic Habits methodology',
        'BJ Fogg\'s Behavior Model (motivation + ability + trigger)',
        'Self-Determination Theory (autonomy, competence, relatedness)',
        'Habit stacking and environmental design research'
      ],
      ethicalConsiderations: [
        'How do we motivate without manipulating?',
        'What if the user\'s goals aren\'t objectively "healthy"?',
        'How do we adapt to different cultural values around habits?',
        'When should we suggest the user modify vs. abandon a goal?'
      ],
      designChallenge: 'Design an AI habit coach that can dynamically adjust Maria\'s meditation practice based on her daily circumstances, energy levels, and available time. The system should use positive psychology principles to maintain motivation while respecting her autonomy to choose her own path.',
      successCriteria: [
        'Personalizes approach based on individual circumstances',
        'Uses evidence-based habit formation techniques',
        'Maintains user autonomy and choice',
        'Adapts to failure with compassion, not guilt',
        'Connects habits to deeper values and meaning'
      ],
      flourishingOutcome: 'Maria develops a sustainable meditation practice that fits her life and enhances her overall wellbeing and family relationships.',
      difficulty: 2
    },
    {
      id: 'crisis-intervention-system',
      title: 'Crisis Detection and Response System',
      phase: 'Implementation',
      scenario: 'You\'re designing an AI wellbeing companion that needs to identify when users are in mental health crisis and respond appropriately while maintaining trust and avoiding false alarms.',
      learningObjective: 'Implement robust crisis detection with appropriate human escalation while maintaining therapeutic relationship and user agency.',
      researchBase: [
        'Suicide risk assessment protocols (Columbia Scale, etc.)',
        'Crisis intervention best practices',
        'Trauma-informed care principles',
        'Cultural competency in mental health crisis'
      ],
      ethicalConsiderations: [
        'Balancing user privacy with safety obligations',
        'Handling false positives without damaging trust',
        'Respecting cultural differences in expressing distress',
        'Maintaining agency for users who refuse help'
      ],
      designChallenge: 'Design a crisis detection and intervention system that can identify concerning language patterns, assess risk level, provide immediate support, and seamlessly connect users to appropriate human resources. The system must be culturally sensitive and trauma-informed.',
      successCriteria: [
        'Accurate risk assessment with minimal false positives',
        'Culturally sensitive crisis recognition',
        'Smooth human escalation process',
        'Maintains therapeutic relationship during crisis',
        'Provides immediate coping resources'
      ],
      flourishingOutcome: 'Users in crisis receive timely, appropriate support that potentially saves lives while maintaining trust in the AI system.',
      difficulty: 3
    },
    {
      id: 'resilience-building-program',
      title: 'Resilience and Post-Traumatic Growth Agent',
      phase: 'Evaluation',
      scenario: 'Design an AI system that helps users build psychological resilience and find meaning in difficult experiences, inspired by post-traumatic growth research.',
      learningObjective: 'Create a comprehensive resilience-building program that measures and optimizes for genuine psychological growth and meaning-making.',
      researchBase: [
        'Tedeschi & Calhoun\'s Post-Traumatic Growth model',
        'Viktor Frankl\'s logotherapy and meaning-making',
        'Resilience research (Connor-Davidson scale)',
        'Narrative therapy techniques'
      ],
      ethicalConsiderations: [
        'Avoiding toxic positivity about trauma',
        'Respecting different healing timelines',
        'Cultural sensitivity in defining "growth"',
        'Supporting users who don\'t experience growth'
      ],
      designChallenge: 'Design an AI program that guides users through a resilience-building journey, helping them reframe challenges, discover personal strengths, deepen relationships, and find meaning. Include measurement tools to track genuine psychological growth over time.',
      successCriteria: [
        'Promotes genuine resilience without toxic positivity',
        'Helps users find personal meaning in struggles',
        'Strengthens social connections and support systems',
        'Includes validated measurement of psychological growth',
        'Adapts to individual values and cultural background'
      ],
      flourishingOutcome: 'Users develop genuine resilience, find meaning in their struggles, and experience post-traumatic growth that enhances their overall life satisfaction.',
      difficulty: 3
    }
  ];

  // Load user progress when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setCompletedExercises([]);
      setAttempts({});
    }
  }, [user]);

  const loadUserProgress = async (): Promise<void> => {
    try {
      const completed = await ProgressTracker.getCompletedExercises();
      const wellbeingCompleted = completed.filter(id =>
        exercises.some(ex => ex.id === id)
      );
      setCompletedExercises(wellbeingCompleted);

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

  const analyzeDesign = useCallback(async (design: string, exercise: WellbeingDesignExercise): Promise<DesignFeedback> => {
    try {
      const analysisPrompt = `
You are an expert in AI ethics, positive psychology, and human-centered design. Analyze this AI agent design for promoting human wellbeing.

EXERCISE: ${exercise.title}
SCENARIO: ${exercise.scenario}
RESEARCH BASE: ${exercise.researchBase.join(', ')}
ETHICAL CONSIDERATIONS: ${exercise.ethicalConsiderations.join(', ')}

USER'S DESIGN:
${design}

Provide feedback in this exact format:

EMPATHY_SCORE: [0-100 - How well does this demonstrate genuine empathy?]
SAFETY_SCORE: [0-100 - How well does this address safety concerns?]
ETHICS_SCORE: [0-100 - How well does this handle ethical considerations?]
FLOURISHING_SCORE: [0-100 - How likely is this to promote human flourishing?]
OVERALL_SCORE: [0-100 - Overall quality of the design]

STRENGTHS:
- [Strength 1]
- [Strength 2]
- [Strength 3]

IMPROVEMENTS:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

RESEARCH_RECOMMENDATIONS:
- [Research-based suggestion 1]
- [Research-based suggestion 2]

REDESIGN_SUGGESTION:
[A specific, actionable suggestion for improving the design based on research and ethics]
      `;

      const response = await PromptMasterClient.analyzePrompt(analysisPrompt, exercise.scenario);

      if (response.error) {
        return {
          score: 50,
          empathyAlignment: 50,
          safetyConsiderations: 50,
          ethicalAwareness: 50,
          flourishingPotential: 50,
          strengths: ['Design analysis attempted'],
          improvements: ['API unavailable - check configuration'],
          researchRecommendations: ['Please configure your Claude API key'],
          redesignSuggestion: 'Please configure your Claude API key to get real feedback.'
        };
      }

      const content = response.content;

      // Parse the structured response
      const empathyMatch = content.match(/EMPATHY_SCORE:\s*(\d+)/);
      const safetyMatch = content.match(/SAFETY_SCORE:\s*(\d+)/);
      const ethicsMatch = content.match(/ETHICS_SCORE:\s*(\d+)/);
      const flourishingMatch = content.match(/FLOURISHING_SCORE:\s*(\d+)/);
      const overallMatch = content.match(/OVERALL_SCORE:\s*(\d+)/);

      const strengthsMatch = content.match(/STRENGTHS:\s*((?:- .+\n?)+)/);
      const improvementsMatch = content.match(/IMPROVEMENTS:\s*((?:- .+\n?)+)/);
      const researchMatch = content.match(/RESEARCH_RECOMMENDATIONS:\s*((?:- .+\n?)+)/);
      const redesignMatch = content.match(/REDESIGN_SUGGESTION:\s*([\\s\\S]+?)(?:\\n\\n|$)/);

      const parseList = (match: RegExpMatchArray | null): string[] => {
        if (!match) return [];
        return match[1].split('\\n').filter(s => s.trim()).map(s => s.replace('- ', '').trim());
      };

      return {
        score: overallMatch ? parseInt(overallMatch[1]) : 50,
        empathyAlignment: empathyMatch ? parseInt(empathyMatch[1]) : 50,
        safetyConsiderations: safetyMatch ? parseInt(safetyMatch[1]) : 50,
        ethicalAwareness: ethicsMatch ? parseInt(ethicsMatch[1]) : 50,
        flourishingPotential: flourishingMatch ? parseInt(flourishingMatch[1]) : 50,
        strengths: parseList(strengthsMatch),
        improvements: parseList(improvementsMatch),
        researchRecommendations: parseList(researchMatch),
        redesignSuggestion: redesignMatch ? redesignMatch[1].trim() : 'Continue refining your approach.'
      };
    } catch (error) {
      console.error('Design analysis error:', error);
      return {
        score: 50,
        empathyAlignment: 50,
        safetyConsiderations: 50,
        ethicalAwareness: 50,
        flourishingPotential: 50,
        strengths: ['Analysis attempted'],
        improvements: ['Error analyzing design'],
        researchRecommendations: ['Please try again'],
        redesignSuggestion: 'Please try again or check your API configuration.'
      };
    }
  }, []);

  const submitDesign = useCallback(async () => {
    if (!currentExercise || !userDesign.trim()) return;

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

      const feedback = await analyzeDesign(userDesign, currentExercise);
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
      console.error('Error submitting design:', error);
      setApiResponse('Error analyzing design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userDesign, currentExercise, analyzeDesign, completedExercises, attempts, user]);

  const selectExercise = useCallback((exercise: WellbeingDesignExercise) => {
    setCurrentExercise(exercise);
    setUserDesign('');
    setShowFeedback(false);
    setApiResponse('');
    setIsLoading(false);
  }, []);

  const renderExerciseList = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌱 Wellbeing Agent Designer
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Learn to design AI companions that promote mental health, resilience, and personal growth
          through evidence-based psychological principles and human-centered ethics.
        </p>
      </div>

      {!user && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-purple-800 mb-2">
            <strong>Sign in to save your design progress!</strong>
          </p>
          <p className="text-purple-600 text-sm">
            Guest mode: Your progress won't be saved between sessions.
          </p>
        </div>
      )}

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
                  : "border-gray-300 hover:border-purple-400"
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
                      exercise.phase === 'Design' && "bg-purple-100 text-purple-700",
                      exercise.phase === 'Implementation' && "bg-orange-100 text-orange-700",
                      exercise.phase === 'Evaluation' && "bg-green-100 text-green-700"
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
                  <span className="font-medium text-gray-700">Learning Goal:</span>
                  <p className="text-gray-600">{exercise.learningObjective}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Research Base:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.researchBase.slice(0, 2).map((research, index) => (
                      <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {research}
                      </span>
                    ))}
                    {exercise.researchBase.length > 2 && (
                      <span className="text-gray-500">+{exercise.researchBase.length - 2} more</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-green-700">Flourishing Outcome:</span>
                  <p className="text-green-600">{exercise.flourishingOutcome}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Start Designing →
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">🌟 Your Wellbeing Design Progress</h3>
          <p className="text-green-700 mb-2">
            Completed: {completedExercises.length}/{exercises.length} design challenges
          </p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
            />
          </div>
          <p className="text-green-600 text-sm mt-2">
            Keep designing to master human-centered AI for wellbeing! 🚀
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
          className="text-purple-600 hover:text-purple-800 flex items-center"
        >
          ← Back to Wellbeing Design Challenges
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
                  currentExercise.phase === 'Design' && "bg-purple-100 text-purple-700",
                  currentExercise.phase === 'Implementation' && "bg-orange-100 text-orange-700",
                  currentExercise.phase === 'Evaluation' && "bg-green-100 text-green-700"
                )}>
                  {currentExercise.phase} Phase
                </span>
                <span className="text-sm text-gray-500">Level {currentExercise.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Scenario & Context */}
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

              <div>
                <h3 className="font-semibold text-green-700 mb-2">🌟 Flourishing Outcome</h3>
                <p className="text-green-600 text-sm">{currentExercise.flourishingOutcome}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🔬 Research Foundation</h3>
                <ul className="space-y-1">
                  {currentExercise.researchBase.map((research, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      {research}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">⚖️ Ethical Considerations</h3>
                <ul className="space-y-1">
                  {currentExercise.ethicalConsiderations.map((consideration, index) => (
                    <li key={index} className="text-sm text-orange-600 flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2">🎨 Design Challenge</h3>
            <p className="text-purple-700 text-sm mb-3">{currentExercise.designChallenge}</p>

            <h4 className="font-medium text-purple-800 mb-2">Success Criteria:</h4>
            <ul className="space-y-1">
              {currentExercise.successCriteria.map((criteria, index) => (
                <li key={index} className="text-sm text-purple-600 flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">✓</span>
                  {criteria}
                </li>
              ))}
            </ul>
          </div>

          {/* Design Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your AI Agent Design (System prompt, interaction flow, safety measures, etc.):
              </label>
              <textarea
                value={userDesign}
                onChange={(e) => setUserDesign(e.target.value)}
                placeholder="Design your wellbeing AI agent here. Consider the research base, ethical considerations, and success criteria..."
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <button
              onClick={submitDesign}
              disabled={!userDesign.trim() || isLoading}
              className={clsx(
                "w-full py-3 px-6 rounded-lg font-medium",
                userDesign.trim() && !isLoading
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Analyzing Design with Research-Based AI...
                </div>
              ) : (
                'Get Expert Feedback on Your Design'
              )}
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-800">🔍 Expert Design Analysis</h3>
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
                  <div className="text-lg font-bold text-purple-600">{feedback.empathyAlignment}</div>
                  <div className="text-xs text-gray-600">Empathy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{feedback.safetyConsiderations}</div>
                  <div className="text-xs text-gray-600">Safety</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{feedback.ethicalAwareness}</div>
                  <div className="text-xs text-gray-600">Ethics</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{feedback.flourishingPotential}</div>
                  <div className="text-xs text-gray-600">Flourishing</div>
                </div>
              </div>

              {feedback.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">✅ Design Strengths:</h4>
                  <ul className="text-sm text-green-600 space-y-1">
                    {feedback.strengths.map((strength: string, index: number) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">🔧 Areas for Improvement:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    {feedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.researchRecommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">📚 Research-Based Recommendations:</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {feedback.researchRecommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.redesignSuggestion && (
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">💡 Redesign Suggestion:</h4>
                  <p className="text-sm text-purple-600 italic bg-purple-100 p-3 rounded">
                    {feedback.redesignSuggestion}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!currentExercise ? renderExerciseList() : renderExerciseDetail()}
      </div>
    </div>
  );
};

export default WellbeingAgentDesigner;