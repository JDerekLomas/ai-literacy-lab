'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Artifact } from '../ClaudeUI';

interface ArtifactPreviewProps {
  artifact: Artifact;
}

export function ArtifactPreview({ artifact }: ArtifactPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc) {
        setError('Unable to load preview');
        return;
      }

      let content = '';

      switch (artifact.type) {
        case 'html':
          content = artifact.content;
          break;

        case 'react':
          // For React components, we'll wrap them in a simple HTML template
          content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <style>
                  body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
                  * { box-sizing: border-box; }
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  ${artifact.content}

                  // Render the component
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(<App />);
                </script>
              </body>
            </html>
          `;
          break;

        case 'svg':
          content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 16px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                </style>
              </head>
              <body>
                ${artifact.content}
              </body>
            </html>
          `;
          break;

        case 'mermaid':
          content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
                <style>
                  body { margin: 0; padding: 16px; }
                </style>
              </head>
              <body>
                <div class="mermaid">
                  ${artifact.content}
                </div>
                <script>
                  mermaid.initialize({ startOnLoad: true });
                </script>
              </body>
            </html>
          `;
          break;

        default:
          content = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 16px; font-family: monospace; white-space: pre-wrap; }
                </style>
              </head>
              <body>${artifact.content}</body>
            </html>
          `;
      }

      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
      setError(null);
    } catch (err) {
      setError('Error rendering preview: ' + (err as Error).message);
    }
  }, [artifact]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title="Artifact preview"
    />
  );
}
