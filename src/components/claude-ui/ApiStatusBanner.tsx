'use client';

import React, { useEffect, useState } from 'react';

interface ApiStatus {
  anthropicKeyConfigured: boolean;
  keyPreview: string;
  message: string;
}

export function ApiStatusBanner() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error('Failed to check API status:', err));
  }, []);

  if (!status || !isVisible) return null;

  const isConfigured = status.anthropicKeyConfigured;

  return (
    <div className={`${isConfigured ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border-b px-4 py-2`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isConfigured ? '✅' : '❌'}</span>
          <span className="text-sm font-medium">
            {status.message}
            {isConfigured && ` (${status.keyPreview})`}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-sm opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
