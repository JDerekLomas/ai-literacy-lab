'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface TutorState {
  currentLesson: string;
  studentProgress: Record<string, number>;
  currentProblem: Problem | null;
  hints: string[];
  encouragement: string[];
}

interface Problem {
  id: string;
  type: 'find-hypotenuse' | 'find-leg' | 'identify-triangle' | 'real-world';
  sideA?: number;
  sideB?: number;
  sideC?: number;
  context?: string;
  difficulty: 1 | 2 | 3;
}

export const PythagoreanTutor: React.FC = () => {
  const [tutorState, setTutorState] = useState<TutorState>({
    currentLesson: 'introduction',
    studentProgress: {},
    currentProblem: null,
    hints: [],
    encouragement: []
  });

  const generateProblem = useCallback((type: Problem['type'], difficulty: 1 | 2 | 3): Problem => {
    const problemSets = {
      'find-hypotenuse': [
        { sideA: 3, sideB: 4, difficulty: 1 },
        { sideA: 5, sideB: 12, difficulty: 2 },
        { sideA: 8, sideB: 15, difficulty: 3 }
      ],
      'find-leg': [
        { sideB: 4, sideC: 5, difficulty: 1 },
        { sideB: 12, sideC: 13, difficulty: 2 },
        { sideB: 24, sideC: 25, difficulty: 3 }
      ],
      'identify-triangle': [
        { sideA: 3, sideB: 4, sideC: 5, difficulty: 1 },
        { sideA: 7, sideB: 24, sideC: 25, difficulty: 2 },
        { sideA: 9, sideB: 40, sideC: 41, difficulty: 3 }
      ],
      'real-world': [
        {
          sideA: 6,
          sideB: 8,
          context: "A ladder against a wall",
          difficulty: 1
        },
        {
          sideA: 15,
          sideB: 20,
          context: "Diagonal of a rectangular garden",
          difficulty: 2
        },
        {
          sideA: 30,
          sideB: 40,
          context: "Cable length for a bridge support",
          difficulty: 3
        }
      ]
    };

    const problemSet = problemSets[type];
    const selectedProblem = problemSet[difficulty - 1];

    return {
      id: `${type}-${difficulty}-${Date.now()}`,
      type,
      ...selectedProblem,
      difficulty
    };
  }, []);

  const provideHint = useCallback((problem: Problem): string => {
    const hints: Record<Problem['type'], string[]> = {
      'find-hypotenuse': [
        "Remember: a² + b² = c²",
        "Square both legs, add them together, then find the square root",
        "The hypotenuse is always the longest side"
      ],
      'find-leg': [
        "Use: a² = c² - b² or b² = c² - a²",
        "The hypotenuse squared minus the known leg squared",
        "Don't forget to take the square root at the end"
      ],
      'identify-triangle': [
        "Check if a² + b² = c²",
        "Try all combinations of sides",
        "The longest side should be c in the formula"
      ],
      'real-world': [
        "Identify which measurements are the legs and which is the hypotenuse",
        "Draw a diagram to visualize the problem",
        "Real-world problems often involve distance or length calculations"
      ]
    };

    const typeHints = hints[problem.type];
    return typeHints[Math.floor(Math.random() * typeHints.length)];
  }, []);

  const assessAnswer = useCallback((userAnswer: number, problem: Problem): boolean => {
    let correctAnswer: number;

    switch (problem.type) {
      case 'find-hypotenuse':
        correctAnswer = Math.sqrt((problem.sideA || 0) ** 2 + (problem.sideB || 0) ** 2);
        break;
      case 'find-leg':
        if (problem.sideA === undefined) {
          correctAnswer = Math.sqrt((problem.sideC || 0) ** 2 - (problem.sideB || 0) ** 2);
        } else {
          correctAnswer = Math.sqrt((problem.sideC || 0) ** 2 - (problem.sideA || 0) ** 2);
        }
        break;
      default:
        return false;
    }

    return Math.abs(userAnswer - correctAnswer) < 0.1;
  }, []);

  const adaptDifficulty = useCallback((isCorrect: boolean, currentDifficulty: 1 | 2 | 3): 1 | 2 | 3 => {
    if (isCorrect && currentDifficulty < 3) {
      return (currentDifficulty + 1) as 1 | 2 | 3;
    } else if (!isCorrect && currentDifficulty > 1) {
      return (currentDifficulty - 1) as 1 | 2 | 3;
    }
    return currentDifficulty;
  }, []);

  const generateEncouragement = useCallback((isCorrect: boolean, streak: number): string => {
    const positive = [
      "Excellent work! You're mastering the Pythagorean theorem!",
      "Great job! Your understanding is really developing!",
      "Perfect! You're thinking like a mathematician!",
      "Outstanding! Keep up this excellent progress!"
    ];

    const constructive = [
      "Not quite, but you're on the right track! Try again.",
      "Close! Let me give you a hint to help you succeed.",
      "Math takes practice - you're building important skills!",
      "Every mistake is a learning opportunity. Let's try a different approach."
    ];

    if (isCorrect) {
      return streak > 3
        ? `${positive[Math.floor(Math.random() * positive.length)]} You're on a ${streak} problem streak!`
        : positive[Math.floor(Math.random() * positive.length)];
    } else {
      return constructive[Math.floor(Math.random() * constructive.length)];
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pythagorean Theorem Tutor
        </h1>
        <p className="text-gray-600">
          Your personal AI tutor for mastering the Pythagorean theorem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current Lesson</h3>
            <p className="text-blue-600">
              {tutorState.currentLesson.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Progress Tracker</h3>
            <div className="space-y-2">
              {Object.entries(tutorState.studentProgress).map(([skill, progress]) => (
                <div key={skill} className="flex justify-between items-center">
                  <span className="text-green-700">{skill}</span>
                  <div className="w-20 h-2 bg-green-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Adaptive Learning</h3>
            <p className="text-yellow-700 text-sm">
              This tutor adapts to your learning style and pace, providing personalized
              feedback and adjusting difficulty based on your performance.
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Learning Features</h3>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Visual theorem discovery</li>
              <li>• Step-by-step problem solving</li>
              <li>• Real-world applications</li>
              <li>• Personalized encouragement</li>
              <li>• Adaptive difficulty</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">AI Tutor Features</h3>
        <p className="text-gray-600 text-sm">
          This educational agent uses adaptive learning algorithms to personalize
          instruction, provide intelligent hints, and support human flourishing through
          mathematical understanding.
        </p>
      </div>
    </div>
  );
};

export default PythagoreanTutor;