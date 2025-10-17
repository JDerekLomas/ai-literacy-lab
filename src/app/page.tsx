'use client';

import React from 'react';
import MathLearningDashboard from '@/components/MathLearningDashboard';
import { Navigation } from '@/components/Navigation';

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <main>
        <MathLearningDashboard />
      </main>
    </div>
  );
}