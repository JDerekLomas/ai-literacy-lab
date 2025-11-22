import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Claude - AI Assistant',
  description: 'Chat with Claude, an AI assistant created by Anthropic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}