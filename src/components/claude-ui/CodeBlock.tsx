'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  compact?: boolean;
}

export function CodeBlock({ code, language, compact = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${compact ? 'text-xs' : 'text-sm'}`}>
      {!compact && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-300 text-xs rounded-t-lg border-b border-gray-700">
          <span className="font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-700 rounded transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className={`bg-gray-900 dark:bg-black ${compact ? 'p-2 rounded-lg' : 'p-4 rounded-b-lg'} overflow-x-auto`}>
        <pre className="font-mono text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
