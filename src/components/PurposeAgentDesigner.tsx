'use client';

import React from 'react';

export const PurposeAgentDesigner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Purpose Agent Designer
          </h1>
          <p className="text-gray-600 mb-6">
            Design AI guides that help people discover their values, find meaning, and pursue
            goals aligned with their authentic selves through meaning-making research.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">Meaning-Focused Track - Coming Soon!</h3>
            <p className="text-orange-700 text-sm">
              This specialization draws from Viktor Frankl's logotherapy, values clarification
              research, and behavioral change science to design AI that helps people live
              more meaningful lives.
            </p>
          </div>
          <div className="text-left space-y-3">
            <h4 className="font-semibold text-gray-800">What You'll Design:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Values exploration and clarification frameworks</li>
              <li>• Goal alignment algorithms and progress tracking</li>
              <li>• Motivation systems based on self-determination theory</li>
              <li>• Cultural sensitivity in meaning-making processes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurposeAgentDesigner;