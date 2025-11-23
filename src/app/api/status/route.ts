import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPreview = process.env.ANTHROPIC_API_KEY
    ? `${process.env.ANTHROPIC_API_KEY.substring(0, 8)}...`
    : 'NOT SET';

  return NextResponse.json({
    status: 'API Status Check',
    anthropicKeyConfigured: hasKey,
    keyPreview: hasKey ? keyPreview : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: hasKey
      ? '✅ API key is configured'
      : '❌ ANTHROPIC_API_KEY environment variable is not set. Please configure it in Vercel project settings.'
  });
}
