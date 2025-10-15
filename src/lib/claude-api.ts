import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: string;
}

export interface ClaudeRequest {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callClaude({
  prompt,
  system = "You are a helpful AI assistant focused on supporting human learning and growth.",
  maxTokens = 1000,
  temperature = 0.7
}: ClaudeRequest): Promise<ClaudeResponse> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        content: "API key not configured. Please add your ANTHROPIC_API_KEY to .env.local",
        error: "Missing API key"
      };
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return {
        content: content.text,
        usage: {
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens
        }
      };
    } else {
      return {
        content: "Unexpected response format",
        error: "Invalid response type"
      };
    }
  } catch (error) {
    console.error('Claude API Error:', error);
    return {
      content: "Sorry, I encountered an error while processing your request. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Specialized API calls for different agents
export const PromptMasterAPI = {
  async analyzePrompt(prompt: string, context: string): Promise<ClaudeResponse> {
    return callClaude({
      prompt: `Please analyze this prompt for effectiveness:

Context: ${context}

Prompt to analyze: "${prompt}"

Please provide:
1. A score from 1-100 for overall effectiveness
2. Specific strengths (2-3 points)
3. Areas for improvement (2-3 points)
4. A rewritten version that demonstrates best practices

Format your response as:
SCORE: [number]
STRENGTHS:
- [strength 1]
- [strength 2]

IMPROVEMENTS:
- [improvement 1]
- [improvement 2]

REWRITTEN:
[improved version]`,
      system: "You are an expert in prompt engineering and AI communication. Provide constructive, educational feedback to help users improve their prompting skills.",
      maxTokens: 800,
      temperature: 0.3
    });
  }
};

export const GoalCoachAPI = {
  async processGoalStep(prompt: string, stepContext: string): Promise<ClaudeResponse> {
    return callClaude({
      prompt,
      system: `You are an expert goal achievement coach who helps people break down big goals into actionable steps.

Context: ${stepContext}

Provide practical, specific guidance that helps the user move forward. Be encouraging but realistic. Always include concrete next steps.`,
      maxTokens: 1200,
      temperature: 0.6
    });
  }
};

export const CreativeCollaboratorAPI = {
  async processCreativeSession(prompt: string, sessionType: string, step: number): Promise<ClaudeResponse> {
    return callClaude({
      prompt,
      system: `You are a creative thinking partner helping with ${sessionType}. This is step ${step} of a structured creative process.

Be innovative, ask clarifying questions when helpful, and provide multiple perspectives. Help the user think outside conventional approaches while staying practical and actionable.`,
      maxTokens: 1500,
      temperature: 0.8
    });
  }
};

export const ProductivityAPI = {
  async processWorkflow(prompt: string, workflowType: string, step: number): Promise<ClaudeResponse> {
    return callClaude({
      prompt,
      system: `You are a productivity expert helping with ${workflowType}. This is step ${step} of a proven workflow.

Provide structured, actionable guidance. Break down complex topics into clear steps. Include specific examples and implementation details. Focus on practical application.`,
      maxTokens: 1500,
      temperature: 0.5
    });
  }
};

export default anthropic;