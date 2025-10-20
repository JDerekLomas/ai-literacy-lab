'use client';

import React, { useState, useEffect, useRef } from 'react';
import { callClaudeAPI, ClaudeAPIResponse } from '@/lib/api-client';

interface GameExercise {
  id: string;
  title: string;
  phase: 'Foundation' | 'Design' | 'Implementation' | 'Evaluation';
  scenario: string;
  learningObjective: string;
  promptingTips: string[];
  examplePrompt: string;
  successCriteria: string[];
  difficulty: 1 | 2 | 3;
}

interface PromptFeedback {
  score: number;
  clarity: number;
  specificity: number;
  completeness: number;
  creativity: number;
  strengths: string[];
  improvements: string[];
  revisedPrompt: string;
}

const InteractiveGameDesigner: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<GameExercise | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [gameExplanation, setGameExplanation] = useState('');
  const [feedback, setFeedback] = useState<PromptFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExamplePrompt, setShowExamplePrompt] = useState(false);
  const [codeEditable, setCodeEditable] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const exercises: GameExercise[] = [
    {
      id: 'clicker-game',
      title: 'React Clicker Game',
      phase: 'Foundation',
      scenario: 'Create your first React game - a simple clicker that counts button presses and celebrates milestones with animations.',
      learningObjective: 'Learn to write prompts that describe React components with state management and interactive UI elements.',
      promptingTips: [
        'Describe the React component with useState for tracking score',
        'Specify visual elements and their styling (buttons, counters, animations)',
        'Define milestone behaviors and conditional rendering',
        'Request modern React patterns (hooks, functional components)'
      ],
      examplePrompt: 'Create a React clicker game component where users click a large animated button to earn points. Use useState to track the score. Display the current score prominently with animated number changes. When reaching milestones (10, 50, 100 clicks), show celebratory messages with fade-in animations and confetti effects. Style with Tailwind CSS using bright gradients and smooth transitions.',
      successCriteria: [
        'React functional component with hooks',
        'State management for score',
        'Click handler updates state',
        'Conditional rendering for milestones',
        'Smooth animations and transitions'
      ],
      difficulty: 1
    },
    {
      id: 'todo-game',
      title: 'Quest Tracker Game',
      phase: 'Foundation',
      scenario: 'Build a gamified todo list where completing tasks earns points and unlocks achievements.',
      learningObjective: 'Learn to describe complex React state with arrays, objects, and multiple interactions.',
      promptingTips: [
        'Describe state shape (array of tasks with properties)',
        'Explain CRUD operations (add, complete, delete tasks)',
        'Define point system and achievement logic',
        'Request proper React patterns (map, key props, event handlers)'
      ],
      examplePrompt: 'Create a Quest Tracker game in React. Users can add quest items, mark them complete (with strikethrough and celebration), and earn 10 points per quest. Display total points with an animated counter. Show achievement badges when reaching 50, 100, 200 points. Each quest has a text input to add, a checkbox to complete, and delete button. Style with modern UI - use card layouts, progress bars, and badge icons.',
      successCriteria: [
        'Array state for tasks',
        'Add/remove/complete functionality',
        'Point calculation system',
        'Achievement unlocking logic',
        'Clean component structure'
      ],
      difficulty: 1
    },
    {
      id: 'memory-cards',
      title: 'React Memory Match',
      phase: 'Design',
      scenario: 'Design a memory card game with flip animations and match detection using React state.',
      learningObjective: 'Master describing complex game state with multiple variables, timing logic, and conditional effects.',
      promptingTips: [
        'Describe card array structure (id, value, flipped, matched)',
        'Explain flip logic with useEffect for timing',
        'Detail matching algorithm with two-card comparison',
        'Request CSS transitions for card flips',
        'Specify win condition detection'
      ],
      examplePrompt: 'Build a Memory Match game in React with a 4x4 grid of cards. Each card has an emoji and flips when clicked. Use useState for cards array (tracking flipped/matched status) and selected cards. When two cards are flipped, check if they match after 1 second - if yes, mark as matched; if no, flip them back. Add flip animations with CSS transforms. Track moves and show victory message when all matched. Style with 3D card flip effects and colorful design.',
      successCriteria: [
        'Grid layout with card components',
        'Flip animation on click',
        'Two-card selection logic',
        'Match detection with timing',
        'Win condition and stats display'
      ],
      difficulty: 2
    },
    {
      id: 'reaction-game',
      title: 'Reaction Time Tester',
      phase: 'Design',
      scenario: 'Create a reaction speed game that tests how quickly players can click when colors change.',
      learningObjective: 'Learn to describe timing mechanics, random events, and performance measurement in React.',
      promptingTips: [
        'Describe game states (waiting, ready, testing, results)',
        'Explain setTimeout/useEffect for timing logic',
        'Detail random delay before color change',
        'Request timestamp tracking for reaction calculation',
        'Specify too-early detection (false start)'
      ],
      examplePrompt: 'Create a Reaction Time game in React. Show a box that changes from red to green after a random delay (2-5 seconds). User clicks when it turns green. Measure and display their reaction time in milliseconds. If they click while red, show "Too early! Wait for green" and restart. Track best time and average over 5 rounds. Use large colored boxes, clear instructions, and animated feedback. Show a leaderboard of attempts.',
      successCriteria: [
        'Multiple game states managed',
        'Random delay implementation',
        'Accurate time measurement',
        'False start detection',
        'Statistics tracking'
      ],
      difficulty: 2
    },
    {
      id: 'typing-game',
      title: 'Speed Typing Challenge',
      phase: 'Implementation',
      scenario: 'Build a typing speed game where players race against the clock to type words accurately.',
      learningObjective: 'Master describing real-time input validation, timer logic, and performance metrics in React.',
      promptingTips: [
        'Describe word/sentence generation system',
        'Explain character-by-character validation',
        'Detail timer implementation with countdown',
        'Request WPM (words per minute) calculation',
        'Specify visual feedback (correct/incorrect highlighting)',
        'Ask for accuracy percentage tracking'
      ],
      examplePrompt: 'Create a Speed Typing game in React. Display a random sentence that user must type. As they type, highlight correct letters in green and errors in red in real-time. Start a 60-second countdown timer when they begin typing. Calculate and display WPM (words per minute) and accuracy percentage. Show a new random sentence when completed. Track high scores. Style with a clean typing interface - monospace font, large text, progress bar for timer, and stats dashboard.',
      successCriteria: [
        'Real-time input validation',
        'Character highlighting system',
        'Countdown timer',
        'WPM calculation',
        'Accuracy tracking',
        'High score persistence'
      ],
      difficulty: 3
    },
    {
      id: 'quiz-game',
      title: 'Interactive Quiz Game',
      phase: 'Implementation',
      scenario: 'Design a multi-question quiz game with scoring, timer, and answer feedback.',
      learningObjective: 'Learn to structure complex React apps with multiple views, navigation, and data flow.',
      promptingTips: [
        'Describe quiz data structure (questions, answers, correct answer)',
        'Explain navigation between questions',
        'Detail answer selection and validation',
        'Request score calculation with bonus for speed',
        'Specify progress indicators',
        'Ask for results screen with performance breakdown'
      ],
      examplePrompt: 'Build a Quiz Game in React with 5 multiple-choice questions. Show one question at a time with 4 answer buttons. When user selects an answer, highlight correct (green) and incorrect (red) before moving to next question after 2 seconds. Include a 20-second timer per question - earn bonus points for fast answers. Track total score (10 points base + time bonus). Show progress bar of questions completed. At the end, display results with score, time taken, and percentage. Allow restart. Use vibrant UI with animations for feedback.',
      successCriteria: [
        'Question navigation system',
        'Answer validation',
        'Per-question timer',
        'Score with time bonus',
        'Progress tracking',
        'Results summary screen',
        'Smooth transitions'
      ],
      difficulty: 3
    }
  ];

  const selectExercise = (exercise: GameExercise) => {
    setCurrentExercise(exercise);
    setUserPrompt('');
    setGeneratedCode('');
    setEditedCode('');
    setGameExplanation('');
    setFeedback(null);
    setShowExamplePrompt(false);
    setCodeEditable(false);
  };

  const generateReactSandbox = (reactCode: string): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Game</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #root {
      width: 100%;
      max-width: 800px;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    ${reactCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Game />);
  </script>
</body>
</html>`;
  };

  const generateGame = async () => {
    if (!userPrompt.trim() || !currentExercise) return;

    setIsGenerating(true);
    setGeneratedCode('');
    setGameExplanation('');

    try {
      const systemPrompt = `You are an expert React game developer. Generate a React component based on the user's prompt.

Requirements:
- Create a functional React component called "Game"
- Use React hooks (useState, useEffect, etc.) for state management
- Write modern, clean React code with proper patterns
- Use Tailwind CSS classes for styling
- Make it fully interactive and visually appealing
- Include animations and smooth transitions
- Ensure the game works completely without external dependencies
- Use emojis for visual elements when appropriate

Context: This is a learning exercise about "${currentExercise.title}". The user is learning to write prompts for AI-generated React code.

IMPORTANT: Return ONLY the React component code (the Game component function). Do NOT include imports, HTML structure, or explanations in the code. Just the component function.

Then, after the code block, provide a brief explanation in this format:

\`\`\`jsx
function Game() {
  // Your React component code here
}
\`\`\`

EXPLANATION: [Brief explanation of how it works]`;

      const response: ClaudeAPIResponse = await callClaudeAPI({
        agent: 'general',
        method: 'generate',
        prompt: userPrompt,
        systemPrompt
      });

      // Extract code and explanation
      const content = response.content;
      const codeMatch = content.match(/```(?:jsx|javascript|js)?\n([\s\S]*?)```/);

      if (codeMatch) {
        const code = codeMatch[1].trim();
        setGeneratedCode(code);
        setEditedCode(code);

        // Extract explanation after the code block
        const afterCode = content.substring(content.indexOf(codeMatch[0]) + codeMatch[0].length);
        const explanationMatch = afterCode.match(/EXPLANATION:\s*([\s\S]*?)(?:\n\n|$)/i) ||
                                 afterCode.match(/How it works:?\s*([\s\S]*?)(?:\n\n|$)/i);

        if (explanationMatch) {
          setGameExplanation(explanationMatch[1].trim());
        } else {
          setGameExplanation('Game generated successfully! Try it out in the preview window.');
        }
      } else {
        // No code block found, treat entire response as code
        setGeneratedCode(content);
        setEditedCode(content);
        setGameExplanation('Game generated successfully! Try it out in the preview window.');
      }
    } catch (error) {
      console.error('Error generating game:', error);
      alert('Failed to generate game. Please try again with a more detailed prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzePrompt = async () => {
    if (!userPrompt.trim() || !currentExercise) return;

    setIsAnalyzing(true);
    setFeedback(null);

    try {
      const systemPrompt = `You are an expert prompt engineering instructor. Analyze the user's prompt for creating a "${currentExercise.title}" React game.

Learning Objective: ${currentExercise.learningObjective}

Success Criteria:
${currentExercise.successCriteria.map(c => `- ${c}`).join('\n')}

Prompting Tips:
${currentExercise.promptingTips.map(t => `- ${t}`).join('\n')}

Evaluate the prompt on:
1. Clarity (0-100): Is it easy to understand what React game should be created?
2. Specificity (0-100): Does it include specific details about React patterns, state, interactions, styling?
3. Completeness (0-100): Does it cover all necessary game elements and React implementation details?
4. Creativity (0-100): Does it include interesting features, animations, or polish?

Return your response in this JSON format:
{
  "score": <overall score 0-100>,
  "clarity": <score 0-100>,
  "specificity": <score 0-100>,
  "completeness": <score 0-100>,
  "creativity": <score 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "revisedPrompt": "An improved version of their prompt incorporating your suggestions, written for generating a React component"
}`;

      const response: ClaudeAPIResponse = await callClaudeAPI({
        agent: 'general',
        method: 'analyze',
        prompt: userPrompt,
        systemPrompt
      });

      const parsed: PromptFeedback = JSON.parse(response.content);
      setFeedback(parsed);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      alert('Failed to analyze prompt. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updatePreview = () => {
    setGeneratedCode(editedCode);
  };

  // Update iframe when code changes
  useEffect(() => {
    if (generatedCode && iframeRef.current) {
      const sandboxHtml = generateReactSandbox(generatedCode);
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(sandboxHtml);
        doc.close();
      }
    }
  }, [generatedCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🎮
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Interactive Game Designer
              </h1>
              <p className="text-gray-600 mt-1">Learn prompt engineering by creating React games with AI</p>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>✨ React-Powered!</strong> This module generates real React components that run live in your browser - just like Claude artifacts!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Exercise Selection */}
        {!currentExercise ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a React Game to Create</h2>
              <p className="text-gray-600">
                Each exercise teaches you how to write effective prompts for AI-generated React games.
                Start with simple interactions and build up to complex game mechanics!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-purple-200 cursor-pointer"
                  onClick={() => selectExercise(exercise)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-2">
                          {exercise.phase}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{exercise.title}</h3>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(exercise.difficulty)].map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{exercise.scenario}</p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                      <p className="text-sm text-blue-900">
                        <strong>You'll learn:</strong> {exercise.learningObjective}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Exercise Header */}
            <div className="mb-6">
              <button
                onClick={() => selectExercise(null as any)}
                className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-flex items-center"
              >
                ← Back to Exercises
              </button>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-2">
                      {currentExercise.phase}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{currentExercise.title}</h2>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(currentExercise.difficulty)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-2xl">⭐</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scenario</h3>
                    <p className="text-gray-700">{currentExercise.scenario}</p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-semibold text-blue-900 mb-2">Learning Objective</h3>
                    <p className="text-blue-800">{currentExercise.learningObjective}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prompting Tips</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {currentExercise.promptingTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowExamplePrompt(!showExamplePrompt)}
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      {showExamplePrompt ? '− Hide' : '+ Show'} Example Prompt
                    </button>
                    {showExamplePrompt && (
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 italic">{currentExercise.examplePrompt}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Success Criteria</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {currentExercise.successCriteria.map((criterion, idx) => (
                        <li key={idx}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Input Area */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Prompt</h3>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Write your prompt here... Be specific about React components, state management, interactions, and styling!"
                    className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none font-mono text-sm"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={generateGame}
                      disabled={!userPrompt.trim() || isGenerating}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {isGenerating ? 'Generating React Game...' : '⚛️ Generate React Game'}
                    </button>
                    <button
                      onClick={analyzePrompt}
                      disabled={!userPrompt.trim() || isAnalyzing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {isAnalyzing ? 'Analyzing...' : '📊 Analyze Prompt'}
                    </button>
                  </div>
                </div>

                {/* Feedback Section */}
                {feedback && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Prompt Analysis</h3>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700">Overall Score</span>
                        <span className="text-2xl font-bold text-purple-600">{feedback.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${feedback.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Clarity', value: feedback.clarity },
                        { label: 'Specificity', value: feedback.specificity },
                        { label: 'Completeness', value: feedback.completeness },
                        { label: 'Creativity', value: feedback.creativity }
                      ].map((metric) => (
                        <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                            <span className="text-sm font-bold text-purple-600">{metric.value}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${metric.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {feedback.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">Suggestions for Improvement</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {feedback.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h4 className="font-semibold text-blue-900 mb-2">Revised Prompt Suggestion</h4>
                        <p className="text-blue-800 text-sm">{feedback.revisedPrompt}</p>
                        <button
                          onClick={() => setUserPrompt(feedback.revisedPrompt)}
                          className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Use this prompt →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Preview Area */}
              <div className="space-y-6">
                {generatedCode && (
                  <>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">⚛️ React Game Preview</h3>
                        <button
                          onClick={() => setCodeEditable(!codeEditable)}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                        >
                          {codeEditable ? '👁️ View Mode' : '✏️ Edit Code'}
                        </button>
                      </div>

                      {!codeEditable ? (
                        <div className="border-4 border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                          <iframe
                            ref={iframeRef}
                            className="w-full h-[600px]"
                            sandbox="allow-scripts"
                            title="React Game Preview"
                          />
                        </div>
                      ) : (
                        <div>
                          <textarea
                            value={editedCode}
                            onChange={(e) => setEditedCode(e.target.value)}
                            className="w-full h-[500px] p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none font-mono text-xs"
                            spellCheck={false}
                          />
                          <button
                            onClick={updatePreview}
                            className="mt-3 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-all"
                          >
                            Update Preview
                          </button>
                        </div>
                      )}

                      {gameExplanation && (
                        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                          <h4 className="font-semibold text-green-900 mb-2">How It Works</h4>
                          <p className="text-green-800 text-sm">{gameExplanation}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!generatedCode && (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">⚛️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No React Game Yet</h3>
                    <p className="text-gray-600">
                      Write a prompt and click "Generate React Game" to see your creation come to life!
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      Your game will run using React + Tailwind CSS
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGameDesigner;
