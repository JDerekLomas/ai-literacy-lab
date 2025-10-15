import { NextRequest, NextResponse } from 'next/server';
import { callClaude, PromptMasterAPI, GoalCoachAPI, CreativeCollaboratorAPI, ProductivityAPI } from '@/lib/claude-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, method, ...params } = body;

    let response;

    switch (agent) {
      case 'prompt-master':
        if (method === 'analyzePrompt') {
          response = await PromptMasterAPI.analyzePrompt(params.prompt, params.context);
        } else {
          return NextResponse.json({ error: 'Invalid method for prompt-master' }, { status: 400 });
        }
        break;

      case 'goal-coach':
        if (method === 'processGoalStep') {
          response = await GoalCoachAPI.processGoalStep(params.prompt, params.stepContext);
        } else {
          return NextResponse.json({ error: 'Invalid method for goal-coach' }, { status: 400 });
        }
        break;

      case 'creative-collaborator':
        if (method === 'processCreativeSession') {
          response = await CreativeCollaboratorAPI.processCreativeSession(
            params.prompt,
            params.sessionType,
            params.step
          );
        } else {
          return NextResponse.json({ error: 'Invalid method for creative-collaborator' }, { status: 400 });
        }
        break;

      case 'productivity':
        if (method === 'processWorkflow') {
          response = await ProductivityAPI.processWorkflow(
            params.prompt,
            params.workflowType,
            params.step
          );
        } else {
          return NextResponse.json({ error: 'Invalid method for productivity' }, { status: 400 });
        }
        break;

      case 'general':
        response = await callClaude({
          prompt: params.prompt,
          system: params.system,
          maxTokens: params.maxTokens,
          temperature: params.temperature
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid agent specified' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Claude API ready',
    timestamp: new Date().toISOString()
  });
}