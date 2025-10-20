'use client';

import React, { useState } from 'react';
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

interface GeneratedGame {
  html: string;
  explanation: string;
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

  const exercises: GameExercise[] = [
    {
      id: 'clicker-game',
      title: 'Simple Clicker Game',
      phase: 'Foundation',
      scenario: 'A user wants to create their first interactive game - a simple clicker that counts button presses and celebrates milestones.',
      learningObjective: 'Learn to write clear, specific prompts that define basic game mechanics, user interactions, and visual feedback.',
      promptingTips: [
        'Clearly describe the main interaction (what happens when user clicks)',
        'Specify visual elements (buttons, counters, colors)',
        'Define any special behaviors (milestones, animations, sounds)',
        'Mention the overall layout and styling preferences'
      ],
      examplePrompt: 'Create a clicker game where users click a large colorful button to earn points. Display the current score prominently. When the user reaches milestones (10, 50, 100 clicks), show celebratory messages with different colors. Use a fun, playful design with bright colors and rounded corners.',
      successCriteria: [
        'Game displays a clickable button',
        'Score counter updates with each click',
        'Visual feedback on milestones',
        'Clean, attractive layout'
      ],
      difficulty: 1
    },
    {
      id: 'guess-number',
      title: 'Guess the Number',
      phase: 'Foundation',
      scenario: 'Create a classic guessing game where the computer picks a random number and gives hints to help the player find it.',
      learningObjective: 'Practice describing game rules, win/lose conditions, and feedback mechanisms in your prompts.',
      promptingTips: [
        'Explain the game rules clearly (range, number of guesses)',
        'Describe the hint system (higher/lower feedback)',
        'Define win and lose conditions',
        'Specify how the game resets or restarts',
        'Request user-friendly error handling'
      ],
      examplePrompt: 'Build a number guessing game where the computer randomly picks a number between 1 and 100. The player has 10 guesses to find it. After each guess, tell them if their guess was too high or too low. Show the number of remaining guesses. When they win, display a congratulations message. If they run out of guesses, reveal the number and offer to play again. Use a clean interface with a number input field and a submit button.',
      successCriteria: [
        'Random number generation',
        'Input validation',
        'Higher/lower hints',
        'Win/lose detection',
        'Restart functionality'
      ],
      difficulty: 1
    },
    {
      id: 'memory-cards',
      title: 'Memory Card Game',
      phase: 'Design',
      scenario: 'Design a memory matching game that tests players\' ability to remember card positions.',
      learningObjective: 'Learn to describe complex game states, animations, and multi-step interactions in prompts.',
      promptingTips: [
        'Describe the game grid layout (e.g., 4x4 cards)',
        'Explain the card flipping interaction',
        'Detail the matching logic and timing',
        'Request visual transitions and animations',
        'Specify scoring or move counting',
        'Define the win condition'
      ],
      examplePrompt: 'Create a memory card game with a 4x4 grid (8 pairs). Each card should have a colorful emoji on one side and a question mark on the back. When a player clicks a card, it flips to reveal the emoji. If two flipped cards match, they stay revealed. If they don\'t match, they flip back after 1 second. Track the number of moves. When all pairs are found, show a victory message with the total moves. Cards should flip with a smooth animation. Use a modern, minimal design.',
      successCriteria: [
        'Grid of cards rendered',
        'Card flip animation',
        'Match detection logic',
        'Non-matching cards flip back',
        'Move counter',
        'Win detection'
      ],
      difficulty: 2
    },
    {
      id: 'snake-game',
      title: 'Classic Snake Game',
      phase: 'Implementation',
      scenario: 'Build the classic Snake game where the player controls a growing snake that must eat food while avoiding walls and its own tail.',
      learningObjective: 'Master describing complex game mechanics, continuous movement, collision detection, and keyboard controls.',
      promptingTips: [
        'Describe the game canvas/grid system',
        'Explain snake movement and keyboard controls',
        'Detail food spawning mechanics',
        'Describe growth and scoring behavior',
        'Specify collision detection (walls, self)',
        'Request appropriate game speed and difficulty',
        'Ask for pause/restart functionality'
      ],
      examplePrompt: 'Create a Snake game on a 20x20 grid canvas. The snake starts as 3 segments and moves continuously in the direction set by arrow keys. Place food (a red square) at random positions. When the snake eats food, it grows by one segment and the score increases. The game ends if the snake hits the wall or its own body. Display the current score prominently. Add a start/restart button and show game over message. Use a dark background with bright colors for the snake and food. Snake should move at a moderate speed (not too fast).',
      successCriteria: [
        'Snake moves continuously',
        'Arrow key controls work',
        'Food appears randomly',
        'Snake grows when eating',
        'Collision detection (walls and self)',
        'Score tracking',
        'Game over state',
        'Restart functionality'
      ],
      difficulty: 3
    },
    {
      id: 'breakout-game',
      title: 'Breakout/Brick Breaker',
      phase: 'Implementation',
      scenario: 'Create a Breakout-style game where the player uses a paddle to bounce a ball and break bricks.',
      learningObjective: 'Learn to describe physics-based game mechanics, real-time interactions, and level design through detailed prompts.',
      promptingTips: [
        'Describe the game layout (paddle, ball, bricks)',
        'Explain ball physics and bouncing behavior',
        'Detail paddle controls (mouse or keyboard)',
        'Describe brick breaking mechanics',
        'Specify win/lose conditions',
        'Request lives or health system',
        'Ask for visual effects on brick breaks',
        'Mention score calculation'
      ],
      examplePrompt: 'Build a Breakout game with a paddle at the bottom controlled by mouse movement. A ball bounces around, destroying colorful bricks arranged in 5 rows at the top. The ball bounces off the paddle, walls, and bricks. When a brick is hit, it disappears and the score increases. The player has 3 lives - they lose a life if the ball falls below the paddle. The game is won when all bricks are destroyed. Show score and remaining lives. Add visual effects when bricks break. Use vibrant colors for different brick rows and a smooth ball movement.',
      successCriteria: [
        'Paddle movement (mouse or keyboard)',
        'Ball physics and bouncing',
        'Brick collision and destruction',
        'Wall collision',
        'Lives system',
        'Score calculation',
        'Win/lose detection',
        'Visual feedback',
        'Smooth animations'
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

  const generateGame = async () => {
    if (!userPrompt.trim() || !currentExercise) return;

    setIsGenerating(true);
    setGeneratedCode('');
    setGameExplanation('');

    try {
      const systemPrompt = `You are an expert game developer. Generate a complete, self-contained HTML file for a simple browser game based on the user's prompt.

Requirements:
- Create a SINGLE HTML file with embedded CSS and JavaScript
- The game must be fully functional and playable
- Use vanilla JavaScript (no external libraries)
- Include clear, commented code
- Make it visually appealing with good UI/UX
- Ensure the game works without any external resources
- Use modern HTML5, CSS3, and ES6+ JavaScript

Context: This is a learning exercise about "${currentExercise.title}". The user is learning to write prompts for AI code generation.

Return your response in this JSON format:
{
  "html": "<!DOCTYPE html>...",
  "explanation": "Brief explanation of how the game works and what features were implemented"
}`;

      const response: ClaudeAPIResponse = await callClaudeAPI({
        agent: 'general',
        method: 'generate',
        prompt: userPrompt,
        systemPrompt
      });

      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(response.content);
        setGeneratedCode(parsed.html);
        setEditedCode(parsed.html);
        setGameExplanation(parsed.explanation);
      } catch {
        // If not JSON, treat entire response as HTML
        const content = response.content;
        if (content.includes('<!DOCTYPE html>') || content.includes('<html>')) {
          setGeneratedCode(content);
          setEditedCode(content);
          setGameExplanation('Game generated successfully. Play it in the preview window!');
        } else {
          throw new Error('Generated content does not appear to be valid HTML');
        }
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
      const systemPrompt = `You are an expert prompt engineering instructor. Analyze the user's prompt for creating a "${currentExercise.title}" game.

Learning Objective: ${currentExercise.learningObjective}

Success Criteria:
${currentExercise.successCriteria.map(c => `- ${c}`).join('\n')}

Prompting Tips:
${currentExercise.promptingTips.map(t => `- ${t}`).join('\n')}

Evaluate the prompt on:
1. Clarity (0-100): Is it easy to understand what game should be created?
2. Specificity (0-100): Does it include specific details about mechanics, visuals, interactions?
3. Completeness (0-100): Does it cover all necessary game elements?
4. Creativity (0-100): Does it include interesting features or polish?

Return your response in this JSON format:
{
  "score": <overall score 0-100>,
  "clarity": <score 0-100>,
  "specificity": <score 0-100>,
  "completeness": <score 0-100>,
  "creativity": <score 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "revisedPrompt": "An improved version of their prompt incorporating your suggestions"
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
              <p className="text-gray-600 mt-1">Learn prompt engineering by creating games with AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Exercise Selection */}
        {!currentExercise ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Game to Create</h2>
              <p className="text-gray-600">
                Each exercise teaches you how to write effective prompts for AI code generation.
                Start with simple games and work your way up!
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
                    placeholder="Write your prompt here... Be specific about game mechanics, visuals, and interactions!"
                    className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none font-mono text-sm"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={generateGame}
                      disabled={!userPrompt.trim() || isGenerating}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {isGenerating ? 'Generating Game...' : '🎮 Generate Game'}
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
                        <h3 className="text-xl font-bold text-gray-900">Game Preview</h3>
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
                            srcDoc={generatedCode}
                            className="w-full h-[600px]"
                            sandbox="allow-scripts"
                            title="Game Preview"
                          />
                        </div>
                      ) : (
                        <div>
                          <textarea
                            value={editedCode}
                            onChange={(e) => setEditedCode(e.target.value)}
                            className="w-full h-[500px] p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none font-mono text-xs"
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
                    <div className="text-6xl mb-4">🎮</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Game Yet</h3>
                    <p className="text-gray-600">
                      Write a prompt and click "Generate Game" to see your creation come to life!
                    </p>
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
