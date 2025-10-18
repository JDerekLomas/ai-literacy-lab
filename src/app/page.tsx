'use client';

import React from 'react';
import AgentDesignAcademy from '@/components/AgentDesignAcademy';
import { Navigation } from '@/components/Navigation';

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <Navigation />
      <main>
        <AgentDesignAcademy />
      </main>
    </div>
  );
}