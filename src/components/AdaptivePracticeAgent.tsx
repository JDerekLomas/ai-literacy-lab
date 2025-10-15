'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';

interface StudentModel {
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed';
  currentMastery: {
    basicConcepts: number; // 0-100
    problemSolving: number;
    realWorldApplication: number;
    confidence: number;
  };
  streak: number;
  totalProblems: number;
  correctAnswers: number;
}

interface Problem {
  id: string;
  type: 'basic' | 'application' | 'challenge';
  difficulty: 1 | 2 | 3;
  question: string;
  context?: string;
  values: {
    a?: number;
    b?: number;
    c?: number;
    missing: 'a' | 'b' | 'c';
  };
  hints: string[];
  encouragement: string;
  skillFocus: string[];
}

interface StudentAttempt {
  answer: number;
  timeSpent: number;
  hintsUsed: number;
  reasoning: string;
  timestamp: Date;
}

export const AdaptivePracticeAgent: React.FC = () => {
  const [studentModel, setStudentModel] = useState<StudentModel>({
    strengths: [],
    weaknesses: ['problem-setup', 'formula-application'],
    learningStyle: 'mixed',
    currentMastery: {
      basicConcepts: 45,
      problemSolving: 30,
      realWorldApplication: 25,
      confidence: 35
    },
    streak: 0,
    totalProblems: 0,
    correctAnswers: 0
  });

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);

  const generateAdaptiveProblem = useCallback((): Problem => {
    const { currentMastery, weaknesses, learningStyle } = studentModel;

    // Determine difficulty based on mastery levels
    let difficulty: 1 | 2 | 3 = 1;
    if (currentMastery.basicConcepts > 70 && currentMastery.problemSolving > 60) {
      difficulty = 3;
    } else if (currentMastery.basicConcepts > 50) {
      difficulty = 2;
    }

    // Adjust for weaknesses
    if (weaknesses.includes('formula-application')) {
      difficulty = Math.max(1, difficulty - 1) as 1 | 2 | 3;
    }

    // Select problem type based on learning style and progress
    let type: Problem['type'] = 'basic';
    if (learningStyle === 'practical' || currentMastery.realWorldApplication < 50) {
      type = 'application';
    } else if (currentMastery.basicConcepts > 80) {
      type = 'challenge';
    }

    const problemTemplates = {
      basic: [
        {
          question: "Find the missing side of the right triangle.",
          values: { a: 3, b: 4, missing: 'c' as const },
          skillFocus: ['basic-calculation', 'formula-application']
        },
        {
          question: "Calculate the length of the unknown leg.",
          values: { a: 5, c: 13, missing: 'b' as const },
          skillFocus: ['leg-calculation', 'formula-rearrangement']
        },
        {
          question: "Determine the hypotenuse of this right triangle.",
          values: { a: 8, b: 15, missing: 'c' as const },
          skillFocus: ['hypotenuse-calculation', 'larger-numbers']
        }
      ],
      application: [
        {
          question: "A 12-foot ladder leans against a wall. The base is 5 feet from the wall. How high does it reach?",
          context: "Ladder safety problem",
          values: { b: 5, c: 12, missing: 'a' as const },
          skillFocus: ['real-world-setup', 'practical-application']
        },
        {
          question: "A rectangular field is 30 yards by 40 yards. What's the diagonal distance?",
          context: "Field measurement",
          values: { a: 30, b: 40, missing: 'c' as const },
          skillFocus: ['rectangular-diagonals', 'measurement']
        }
      ],
      challenge: [
        {
          question: "A support cable runs from the top of a 20-meter tower to a point 15 meters from its base. Find the cable length.",
          context: "Engineering problem",
          values: { a: 20, b: 15, missing: 'c' as const },
          skillFocus: ['complex-application', 'engineering-context']
        }
      ]
    };

    const templates = problemTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const hints = generateHints(template.values.missing, learningStyle);
    const encouragement = generateEncouragement(studentModel.currentMastery.confidence);

    return {
      id: `${type}-${difficulty}-${Date.now()}`,
      type,
      difficulty,
      ...template,
      hints,
      encouragement
    };
  }, [studentModel]);

  const generateHints = useCallback((missing: 'a' | 'b' | 'c', learningStyle: StudentModel['learningStyle']): string[] => {
    const baseHints = {
      c: [
        "Remember: c² = a² + b²",
        "Square both legs, add them, then find the square root",
        "The hypotenuse is always the longest side"
      ],
      a: [
        "Use: a² = c² - b²",
        "The hypotenuse squared minus the other leg squared",
        "Don't forget to take the square root of your result"
      ],
      b: [
        "Use: b² = c² - a²",
        "Subtract the known leg squared from the hypotenuse squared",
        "Remember to find the square root of the final result"
      ]
    };

    const visualHints = [
      "Try drawing the triangle to visualize the problem",
      "Label each side clearly: a and b are legs, c is hypotenuse",
      "Imagine the squares built on each side"
    ];

    const analyticalHints = [
      "Set up the equation step by step",
      "Substitute the known values into the formula",
      "Work through each calculation methodically"
    ];

    let hints = [...baseHints[missing]];

    if (learningStyle === 'visual') {
      hints = [...visualHints, ...hints];
    } else if (learningStyle === 'analytical') {
      hints = [...analyticalHints, ...hints];
    }

    return hints;
  }, []);

  const generateEncouragement = useCallback((confidence: number): string => {
    if (confidence < 40) {
      return "Take your time and trust the process. Every mathematician started where you are now!";
    } else if (confidence < 70) {
      return "You're building strong mathematical skills. Keep up the great work!";
    } else {
      return "Your mathematical confidence is showing! Challenge yourself with this problem.";
    }
  }, []);

  const calculateCorrectAnswer = useCallback((problem: Problem): number => {
    const { a, b, c, missing } = problem.values;

    switch (missing) {
      case 'c':
        return Math.sqrt((a || 0) ** 2 + (b || 0) ** 2);
      case 'a':
        return Math.sqrt((c || 0) ** 2 - (b || 0) ** 2);
      case 'b':
        return Math.sqrt((c || 0) ** 2 - (a || 0) ** 2);
      default:
        return 0;
    }
  }, []);

  const assessAnswer = useCallback((answer: number, problem: Problem): {
    isCorrect: boolean;
    feedback: string;
    skillGains: Partial<StudentModel['currentMastery']>;
  } => {
    const correctAnswer = calculateCorrectAnswer(problem);
    const tolerance = 0.1;
    const isCorrect = Math.abs(answer - correctAnswer) <= tolerance;

    let skillGains: Partial<StudentModel['currentMastery']> = {};
    let feedback = '';

    if (isCorrect) {
      // Positive skill gains
      skillGains = {
        basicConcepts: 3,
        problemSolving: 5,
        confidence: 4
      };

      if (problem.type === 'application') {
        skillGains.realWorldApplication = 6;
      }

      feedback = `Excellent! You correctly calculated ${correctAnswer.toFixed(2)}. `;

      if (hintsRevealed === 0) {
        feedback += "Solving without hints shows strong understanding!";
        skillGains.confidence = 6;
      } else if (hintsRevealed <= 2) {
        feedback += "Good use of hints to guide your thinking!";
      }
    } else {
      // Learning opportunities
      const difference = Math.abs(answer - correctAnswer);

      if (difference < 1) {
        feedback = `Very close! The correct answer is ${correctAnswer.toFixed(2)}. Check your final calculation.`;
        skillGains = { basicConcepts: 1, confidence: 1 };
      } else if (difference < 5) {
        feedback = `You're on the right track! The correct answer is ${correctAnswer.toFixed(2)}. Review the formula setup.`;
        skillGains = { basicConcepts: 1 };
      } else {
        feedback = `Let's work through this together. The correct answer is ${correctAnswer.toFixed(2)}. `;
        skillGains = { basicConcepts: 0.5 };
      }
    }

    return { isCorrect, feedback, skillGains };
  }, [calculateCorrectAnswer, hintsRevealed]);

  const updateStudentModel = useCallback((
    isCorrect: boolean,
    problem: Problem,
    timeSpent: number,
    hintsUsed: number,
    skillGains: Partial<StudentModel['currentMastery']>
  ) => {
    setStudentModel(prev => {
      const newMastery = { ...prev.currentMastery };

      // Apply skill gains
      Object.entries(skillGains).forEach(([skill, gain]) => {
        newMastery[skill as keyof StudentModel['currentMastery']] = Math.min(
          100,
          newMastery[skill as keyof StudentModel['currentMastery']] + (gain || 0)
        );
      });

      // Update strengths and weaknesses
      const newStrengths = [...prev.strengths];
      const newWeaknesses = prev.weaknesses.filter(w => w !== 'solved-problems');

      if (isCorrect && hintsUsed <= 1) {
        problem.skillFocus.forEach(skill => {
          if (!newStrengths.includes(skill)) {
            newStrengths.push(skill);
          }
        });
      } else if (!isCorrect) {
        problem.skillFocus.forEach(skill => {
          if (!newWeaknesses.includes(skill)) {
            newWeaknesses.push(skill);
          }
        });
      }

      // Update streak
      const newStreak = isCorrect ? prev.streak + 1 : 0;

      return {
        ...prev,
        currentMastery: newMastery,
        strengths: newStrengths,
        weaknesses: newWeaknesses,
        streak: newStreak,
        totalProblems: prev.totalProblems + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
      };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentProblem || !startTime) return;

    const answer = parseFloat(studentAnswer);
    const timeSpent = (new Date().getTime() - startTime.getTime()) / 1000;

    const attempt: StudentAttempt = {
      answer,
      timeSpent,
      hintsUsed: hintsRevealed,
      reasoning,
      timestamp: new Date()
    };

    setAttempts(prev => [...prev, attempt]);

    const assessment = assessAnswer(answer, currentProblem);
    updateStudentModel(
      assessment.isCorrect,
      currentProblem,
      timeSpent,
      hintsRevealed,
      assessment.skillGains
    );

    setShowFeedback(true);
  }, [currentProblem, startTime, studentAnswer, reasoning, hintsRevealed, assessAnswer, updateStudentModel]);

  const startNewProblem = useCallback(() => {
    const newProblem = generateAdaptiveProblem();
    setCurrentProblem(newProblem);
    setStudentAnswer('');
    setReasoning('');
    setStartTime(new Date());
    setHintsRevealed(0);
    setShowFeedback(false);
  }, [generateAdaptiveProblem]);

  const revealHint = useCallback(() => {
    if (currentProblem && hintsRevealed < currentProblem.hints.length) {
      setHintsRevealed(prev => prev + 1);
    }
  }, [currentProblem, hintsRevealed]);

  useEffect(() => {
    startNewProblem();
  }, [startNewProblem]);

  if (!currentProblem) {
    return <div>Loading adaptive practice session...</div>;
  }

  const correctAnswer = calculateCorrectAnswer(currentProblem);
  const assessment = showFeedback ? assessAnswer(parseFloat(studentAnswer), currentProblem) : null;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Adaptive Practice Agent
        </h1>
        <p className="text-gray-600">
          Personalized Pythagorean theorem practice that adapts to your learning style and progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Model & Progress */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Your Progress</h3>
            <div className="space-y-3">
              {Object.entries(studentModel.currentMastery).map(([skill, level]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700 capitalize">
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-blue-600">{Math.round(level)}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded">
                    <div
                      className="h-full bg-blue-500 rounded transition-all duration-500"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Statistics</h3>
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-bold">{studentModel.streak}</span>
              </div>
              <div className="flex justify-between">
                <span>Problems Solved:</span>
                <span>{studentModel.correctAnswers}/{studentModel.totalProblems}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>
                  {studentModel.totalProblems > 0
                    ? Math.round((studentModel.correctAnswers / studentModel.totalProblems) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Learning Profile</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-yellow-700">Learning Style:</span>
                <span className="ml-2 font-medium capitalize">{studentModel.learningStyle}</span>
              </div>
              {studentModel.strengths.length > 0 && (
                <div>
                  <span className="text-yellow-700">Strengths:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {studentModel.strengths.slice(0, 3).map(strength => (
                      <span key={strength} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {strength.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {studentModel.weaknesses.length > 0 && (
                <div>
                  <span className="text-yellow-700">Focus Areas:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {studentModel.weaknesses.slice(0, 3).map(weakness => (
                      <span key={weakness} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        {weakness.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problem Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Problem {studentModel.totalProblems + 1}
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className={clsx(
                    "px-2 py-1 text-xs rounded",
                    currentProblem.type === 'basic' && "bg-blue-100 text-blue-700",
                    currentProblem.type === 'application' && "bg-purple-100 text-purple-700",
                    currentProblem.type === 'challenge' && "bg-red-100 text-red-700"
                  )}>
                    {currentProblem.type}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                    Difficulty {currentProblem.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-800 text-lg mb-2">{currentProblem.question}</p>
              {currentProblem.context && (
                <p className="text-gray-600 text-sm italic">{currentProblem.context}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white rounded border">
              <div className="text-center">
                <div className="text-sm text-gray-600">Side A</div>
                <div className="text-lg font-mono">
                  {currentProblem.values.missing === 'a' ? '?' : currentProblem.values.a}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Side B</div>
                <div className="text-lg font-mono">
                  {currentProblem.values.missing === 'b' ? '?' : currentProblem.values.b}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Hypotenuse C</div>
                <div className="text-lg font-mono">
                  {currentProblem.values.missing === 'c' ? '?' : currentProblem.values.c}
                </div>
              </div>
            </div>

            {!showFeedback ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Answer:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your answer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Show your work (optional):
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Explain how you solved this problem..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitAnswer}
                    disabled={!studentAnswer.trim()}
                    className={clsx(
                      "flex-1 py-2 px-4 rounded font-medium",
                      studentAnswer.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    Submit Answer
                  </button>

                  <button
                    onClick={revealHint}
                    disabled={hintsRevealed >= currentProblem.hints.length}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Hint ({hintsRevealed}/{currentProblem.hints.length})
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={clsx(
                  "p-4 rounded-lg",
                  assessment?.isCorrect ? "bg-green-100" : "bg-orange-100"
                )}>
                  <h3 className={clsx(
                    "font-semibold mb-2",
                    assessment?.isCorrect ? "text-green-800" : "text-orange-800"
                  )}>
                    {assessment?.isCorrect ? "Correct!" : "Learning Opportunity"}
                  </h3>
                  <p className={clsx(
                    "text-sm",
                    assessment?.isCorrect ? "text-green-700" : "text-orange-700"
                  )}>
                    {assessment?.feedback}
                  </p>
                </div>

                <button
                  onClick={startNewProblem}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Problem
                </button>
              </div>
            )}

            {hintsRevealed > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Hints:</h4>
                <div className="space-y-1">
                  {currentProblem.hints.slice(0, hintsRevealed).map((hint, index) => (
                    <p key={index} className="text-blue-700 text-sm">
                      {index + 1}. {hint}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Encouragement</h3>
            <p className="text-purple-700 text-sm">{currentProblem.encouragement}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Adaptive Learning AI</h3>
        <p className="text-gray-600 text-sm">
          This agent continuously analyzes your learning patterns, adjusts problem difficulty,
          and provides personalized feedback to optimize your mathematical growth and support
          human flourishing through education.
        </p>
      </div>
    </div>
  );
};

export default AdaptivePracticeAgent;