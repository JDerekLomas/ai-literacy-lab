'use client';

import React from 'react';

export const ConnectionAgentDesigner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Connection Agent Designer
          </h1>
          <p className="text-gray-600 mb-6">
            Build AI facilitators that strengthen authentic human relationships and foster
            inclusive, supportive communities through social psychology research.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2">Advanced Track - Coming Soon!</h3>
            <p className="text-purple-700 text-sm">
              This expert-level specialization focuses on the complex challenges of designing
              AI that enhances rather than replaces human social connections.
            </p>
          </div>
          <div className="text-left space-y-3">
            <h4 className="font-semibold text-gray-800">What You'll Master:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Social dynamics modeling and community health</li>
              <li>• Inclusive conversation design and bias mitigation</li>
              <li>• Cross-cultural communication competency</li>
              <li>• Privacy-preserving social interaction design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionAgentDesigner;