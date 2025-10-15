'use client';

import React from 'react';
import MathLearningDashboard from '@/components/MathLearningDashboard';

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MathLearningDashboard />
    </main>
  );
}