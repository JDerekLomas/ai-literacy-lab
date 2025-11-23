'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Code blocks
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const codeString = String(children).replace(/\n$/, '');

          if (!inline && language) {
            return <CodeBlock code={codeString} language={language} />;
          }

          return (
            <code
              className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        // Paragraphs
        p({ children }) {
          return <p className="mb-3 last:mb-0">{children}</p>;
        },
        // Headings
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h3>;
        },
        // Lists
        ul({ children }) {
          return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
        },
        li({ children }) {
          return <li className="ml-4">{children}</li>;
        },
        // Links
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          );
        },
        // Blockquotes
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-3 italic">
              {children}
            </blockquote>
          );
        },
        // Strong/Bold
        strong({ children }) {
          return <strong className="font-bold">{children}</strong>;
        },
        // Emphasis/Italic
        em({ children }) {
          return <em className="italic">{children}</em>;
        },
        // Horizontal rule
        hr() {
          return <hr className="my-4 border-gray-300 dark:border-gray-600" />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
