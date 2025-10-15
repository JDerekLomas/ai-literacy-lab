'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  visualType: 'ladder' | 'building' | 'navigation' | 'screen';
  knownValues: {
    a?: number;
    b?: number;
    c?: number;
    labels: { a: string; b: string; c: string };
  };
  realWorldConnection: string;
  careerConnection: string[];
}

interface StudentResponse {
  answer: number;
  reasoning: string;
  confidence: 1 | 2 | 3 | 4 | 5;
}

export const RealWorldApplicationAgent: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [studentResponse, setStudentResponse] = useState<StudentResponse>({
    answer: 0,
    reasoning: '',
    confidence: 3
  });
  const [showSolution, setShowSolution] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const scenarios: Scenario[] = [
    {
      id: 'ladder-safety',
      title: 'Ladder Safety',
      description: 'A firefighter needs to position a 25-foot ladder against a building. The base of the ladder should be 7 feet from the wall for safety. How high up the wall will the ladder reach?',
      context: 'Proper ladder positioning is crucial for safety in emergency situations.',
      visualType: 'ladder',
      knownValues: {
        b: 7,
        c: 25,
        labels: { a: 'Height on wall', b: 'Distance from wall', c: 'Ladder length' }
      },
      realWorldConnection: 'Firefighters, construction workers, and maintenance professionals use this calculation daily to ensure safe ladder placement.',
      careerConnection: ['Firefighter', 'Construction Worker', 'Electrician', 'Window Cleaner', 'Roofer']
    },
    {
      id: 'building-diagonal',
      title: 'Construction Planning',
      description: 'An architect is designing a rectangular building foundation that is 40 feet long and 30 feet wide. What is the diagonal distance across the foundation?',
      context: 'Diagonal measurements ensure the foundation is perfectly rectangular.',
      visualType: 'building',
      knownValues: {
        a: 30,
        b: 40,
        labels: { a: 'Width', b: 'Length', c: 'Diagonal' }
      },
      realWorldConnection: 'Architects and builders use diagonal measurements to verify that foundations and structures are square and properly aligned.',
      careerConnection: ['Architect', 'Civil Engineer', 'General Contractor', 'Surveyor', 'Urban Planner']
    },
    {
      id: 'navigation',
      title: 'Navigation Distance',
      description: 'A hiker walks 3 miles east and then 4 miles north. What is the straight-line distance back to their starting point?',
      context: 'Understanding direct distances helps with navigation and trip planning.',
      visualType: 'navigation',
      knownValues: {
        a: 3,
        b: 4,
        labels: { a: 'East distance', b: 'North distance', c: 'Direct distance' }
      },
      realWorldConnection: 'GPS systems, pilots, ship captains, and outdoor enthusiasts use pythagorean calculations for navigation and distance planning.',
      careerConnection: ['Pilot', 'Ship Captain', 'GPS Developer', 'Park Ranger', 'Adventure Guide']
    },
    {
      id: 'screen-size',
      title: 'Screen Diagonal',
      description: 'A smartphone screen is 2.4 inches wide and 4.3 inches tall. What is the diagonal screen size that manufacturers advertise?',
      context: 'Screen sizes are always measured diagonally in the technology industry.',
      visualType: 'screen',
      knownValues: {
        a: 2.4,
        b: 4.3,
        labels: { a: 'Width', b: 'Height', c: 'Diagonal size' }
      },
      realWorldConnection: 'Technology companies use diagonal measurements for all screens - phones, tablets, TVs, and computer monitors.',
      careerConnection: ['Product Designer', 'Electrical Engineer', 'UX Designer', 'Manufacturing Engineer', 'Quality Assurance']
    }
  ];

  const calculateCorrectAnswer = useCallback((scenario: Scenario): number => {
    const { a, b, c } = scenario.knownValues;

    if (a !== undefined && b !== undefined) {
      return Math.sqrt(a * a + b * b);
    } else if (a !== undefined && c !== undefined) {
      return Math.sqrt(c * c - a * a);
    } else if (b !== undefined && c !== undefined) {
      return Math.sqrt(c * c - b * b);
    }
    return 0;
  }, []);

  const assessAnswer = useCallback((answer: number, scenario: Scenario): { isCorrect: boolean; feedback: string } => {
    const correctAnswer = calculateCorrectAnswer(scenario);
    const tolerance = 0.1;
    const isCorrect = Math.abs(answer - correctAnswer) <= tolerance;

    if (isCorrect) {
      return {
        isCorrect: true,
        feedback: `Excellent! You correctly calculated ${correctAnswer.toFixed(2)} ${scenario.knownValues.labels.c.toLowerCase()}.`
      };
    } else {
      const difference = Math.abs(answer - correctAnswer);
      if (difference < 1) {
        return {
          isCorrect: false,
          feedback: `Very close! The correct answer is ${correctAnswer.toFixed(2)}. Check your calculation.`
        };
      } else {
        return {
          isCorrect: false,
          feedback: `Not quite right. The correct answer is ${correctAnswer.toFixed(2)}. Let's review the process together.`
        };
      }
    }
  }, [calculateCorrectAnswer]);

  const generatePersonalizedFeedback = useCallback((scenario: Scenario, response: StudentResponse): string => {
    const confidenceLevel = response.confidence;
    const reasoningQuality = response.reasoning.length > 20 ? 'detailed' : 'brief';

    const feedback = [
      `I appreciate your ${reasoningQuality} reasoning process.`,
      confidenceLevel >= 4
        ? "Your confidence shows you're developing strong mathematical intuition!"
        : "It's perfectly normal to feel uncertain - mathematics takes practice!",
      `This type of problem is exactly what ${scenario.careerConnection[0].toLowerCase()}s encounter in their work.`
    ];

    return feedback.join(' ');
  }, []);

  const renderScenarioVisual = useCallback((scenario: Scenario) => {
    const { visualType, knownValues } = scenario;

    switch (visualType) {
      case 'ladder':
        return (
          <div className="relative h-48 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden">
            <div className="absolute bottom-0 left-12 w-2 h-32 bg-yellow-600"></div>
            <div className="absolute bottom-0 left-14 w-24 h-2 bg-gray-700"></div>
            <div
              className="absolute bottom-0 left-14 w-1 bg-red-500 transform-gpu"
              style={{
                height: '120px',
                transformOrigin: 'bottom',
                transform: 'rotate(75deg)'
              }}
            ></div>
            <div className="absolute bottom-4 left-4 text-xs">
              Base: {knownValues.b}ft
            </div>
            <div className="absolute top-4 left-20 text-xs">
              Ladder: {knownValues.c}ft
            </div>
          </div>
        );

      case 'building':
        return (
          <div className="relative h-48 bg-gradient-to-b from-blue-300 to-green-300 rounded-lg overflow-hidden">
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-16 bg-gray-600 border-2 border-gray-800"></div>
              <div className="absolute -bottom-1 -left-1 w-26 h-18 border-2 border-dashed border-red-500"></div>
              <div className="absolute top-0 left-0 w-24 h-1 bg-red-500"></div>
              <div className="absolute top-0 left-0 w-1 h-16 bg-red-500"></div>
            </div>
            <div className="absolute bottom-2 left-4 text-xs">
              Width: {knownValues.a}ft
            </div>
            <div className="absolute bottom-2 right-4 text-xs">
              Length: {knownValues.b}ft
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="relative h-48 bg-gradient-to-br from-green-200 to-brown-200 rounded-lg overflow-hidden">
            <div className="absolute bottom-12 left-12 w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="absolute bottom-12 left-14 w-16 h-1 bg-blue-500"></div>
            <div className="absolute bottom-14 right-20 w-1 h-16 bg-blue-500"></div>
            <div className="absolute bottom-12 left-12 w-20 h-16 border-2 border-dashed border-red-500"></div>
            <div className="absolute bottom-2 left-20 text-xs">
              East: {knownValues.a} miles
            </div>
            <div className="absolute top-4 right-8 text-xs">
              North: {knownValues.b} miles
            </div>
          </div>
        );

      case 'screen':
        return (
          <div className="relative h-48 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-16 h-28 bg-black rounded border-4 border-gray-600 relative">
              <div className="w-full h-full bg-blue-400 rounded"></div>
              <div className="absolute -bottom-6 left-0 text-xs text-white">
                W: {knownValues.a}"
              </div>
              <div className="absolute -right-8 top-0 text-xs text-white transform rotate-90 origin-left">
                H: {knownValues.b}"
              </div>
              <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-red-400"></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, []);

  const selectScenario = useCallback((scenario: Scenario) => {
    setCurrentScenario(scenario);
    setShowSolution(false);
    setStudentResponse({
      answer: 0,
      reasoning: '',
      confidence: 3
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (currentScenario) {
      setShowSolution(true);
      if (!completedScenarios.includes(currentScenario.id)) {
        setCompletedScenarios(prev => [...prev, currentScenario.id]);
      }
    }
  }, [currentScenario, completedScenarios]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Real-World Application Agent
        </h1>
        <p className="text-gray-600">
          Discover how the Pythagorean theorem solves real problems in careers and daily life
        </p>
      </div>

      {!currentScenario ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={clsx(
                "p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg",
                completedScenarios.includes(scenario.id)
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-white hover:border-blue-400"
              )}
              onClick={() => selectScenario(scenario)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {scenario.title}
                </h3>
                {completedScenarios.includes(scenario.id) && (
                  <span className="text-green-600 text-2xl">✓</span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{scenario.description}</p>

              <div className="mb-4">
                {renderScenarioVisual(scenario)}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {scenario.careerConnection.slice(0, 3).map((career) => (
                    <span
                      key={career}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <button
              onClick={() => setCurrentScenario(null)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              ← Back to Scenarios
            </button>

            <div className="p-6 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-3">
                {currentScenario.title}
              </h2>
              <p className="text-blue-700 mb-4">
                {currentScenario.description}
              </p>
              <p className="text-blue-600 text-sm italic">
                {currentScenario.context}
              </p>
            </div>

            <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
              {renderScenarioVisual(currentScenario)}
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Given Information</h3>
              <div className="space-y-1 text-yellow-700">
                {Object.entries(currentScenario.knownValues).map(([key, value]) => {
                  if (key === 'labels' || value === undefined) return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span>{currentScenario.knownValues.labels[key as keyof typeof currentScenario.knownValues.labels]}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Your Solution</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer ({currentScenario.knownValues.labels.c}):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={studentResponse.answer || ''}
                    onChange={(e) => setStudentResponse(prev => ({
                      ...prev,
                      answer: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your answer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explain your reasoning:
                  </label>
                  <textarea
                    value={studentResponse.reasoning}
                    onChange={(e) => setStudentResponse(prev => ({
                      ...prev,
                      reasoning: e.target.value
                    }))}
                    placeholder="How did you solve this problem?"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confidence Level:
                  </label>
                  <select
                    value={studentResponse.confidence}
                    onChange={(e) => setStudentResponse(prev => ({
                      ...prev,
                      confidence: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
                    }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value={1}>1 - Not confident</option>
                    <option value={2}>2 - Somewhat uncertain</option>
                    <option value={3}>3 - Moderately confident</option>
                    <option value={4}>4 - Very confident</option>
                    <option value={5}>5 - Completely certain</option>
                  </select>
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={!studentResponse.answer || !studentResponse.reasoning.trim()}
                  className={clsx(
                    "w-full py-2 px-4 rounded font-medium",
                    studentResponse.answer && studentResponse.reasoning.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Submit Answer
                </button>
              </div>
            </div>

            {showSolution && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">AI Feedback</h3>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium text-gray-800 mb-1">Assessment:</h4>
                    <p className="text-sm text-gray-700">
                      {assessAnswer(studentResponse.answer, currentScenario).feedback}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium text-gray-800 mb-1">Personalized Feedback:</h4>
                    <p className="text-sm text-gray-700">
                      {generatePersonalizedFeedback(currentScenario, studentResponse)}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border">
                    <h4 className="font-medium text-gray-800 mb-1">Career Connection:</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {currentScenario.realWorldConnection}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {currentScenario.careerConnection.map((career) => (
                        <span
                          key={career}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Why This Matters</h3>
              <p className="text-purple-700 text-sm">
                Real-world applications like this show how mathematical concepts directly
                support human flourishing through safer construction, better navigation,
                and more precise engineering. Every calculation contributes to human welfare
                and technological advancement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealWorldApplicationAgent;