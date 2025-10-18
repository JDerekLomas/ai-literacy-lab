'use client';

import React from 'react';

export const LearningAgentDesigner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Learning Agent Designer
          </h1>
          <p className="text-gray-600 mb-6">
            Create personalized AI tutors that adapt to individual learning styles and promote
            deep understanding through educational psychology and motivation research.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Coming Soon!</h3>
            <p className="text-blue-700 text-sm">
              This specialization track is under development. You'll learn to design AI agents
              that apply spaced repetition, flow theory, and self-determination principles
              to create transformative learning experiences.
            </p>
          </div>
          <div className="text-left space-y-3">
            <h4 className="font-semibold text-gray-800">What You'll Learn:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Educational psychology principles for AI design</li>
              <li>• Adaptive learning algorithms and personalization</li>
              <li>• Engagement mechanics and motivation systems</li>
              <li>• Bias-free assessment and cultural sensitivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAgentDesigner;