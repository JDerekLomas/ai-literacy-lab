import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Literacy Learning Lab',
  description: 'Master AI literacy through hands-on practice with conversational agents. Learn prompt engineering, goal achievement, creative collaboration, and productivity workflows to use AI effectively for human flourishing.',
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