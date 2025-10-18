import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { availableModels, calculateCost, type AIModel } from '@/lib/multi-model-client';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// For demo purposes, we'll simulate other providers
// In production, you'd integrate with actual APIs
async function callQwenAPI(model: string, prompt: string, system?: string, maxTokens?: number): Promise<any> {
  // This is a simulation - in production you'd call the actual Qwen API
  // For now, we'll use Claude as a fallback but indicate it's simulating Qwen
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use faster model for cost simulation
      max_tokens: maxTokens || 1000,
      system: system || 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return {
        content: `[Simulating ${model}] ${content.text}`,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      };
    }
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Qwen API simulation error:', error);
    throw error;
  }
}

async function callOpenAIAPI(model: string, prompt: string, system?: string, maxTokens?: number): Promise<any> {
  // This is a simulation - in production you'd call the actual OpenAI API
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: maxTokens || 1000,
      system: system || 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return {
        content: `[Simulating ${model}] ${content.text}`,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      };
    }
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('OpenAI API simulation error:', error);
    throw error;
  }
}

async function callAnthropicAPI(model: string, prompt: string, system?: string, maxTokens?: number): Promise<any> {
  try {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens || 1000,
      system: system || 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return {
        content: content.text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      };
    }
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      model,
      prompt,
      system = 'You are a helpful AI assistant specialized in designing AI agents for human flourishing.',
      maxTokens = 1000,
      temperature = 0.7
    } = body;

    if (!model || !prompt) {
      return NextResponse.json(
        { error: 'Model and prompt are required' },
        { status: 400 }
      );
    }

    // Find the model configuration
    const modelConfig = availableModels.find(m => m.id === model);
    if (!modelConfig) {
      return NextResponse.json(
        { error: `Model ${model} not supported` },
        { status: 400 }
      );
    }

    let response;
    let actualModel = model;

    // Route to appropriate API based on provider
    switch (modelConfig.provider) {
      case 'anthropic':
        response = await callAnthropicAPI(model, prompt, system, maxTokens);
        break;
      case 'qwen':
        response = await callQwenAPI(model, prompt, system, maxTokens);
        actualModel = 'claude-3-haiku-20240307'; // For cost calculation since we're simulating
        break;
      case 'openai':
        response = await callOpenAIAPI(model, prompt, system, maxTokens);
        actualModel = 'claude-3-haiku-20240307'; // For cost calculation since we're simulating
        break;
      default:
        return NextResponse.json(
          { error: `Provider ${modelConfig.provider} not implemented` },
          { status: 400 }
        );
    }

    // Calculate cost
    const cost = calculateCost(
      response.usage.input_tokens,
      response.usage.output_tokens,
      modelConfig
    );

    return NextResponse.json({
      content: response.content,
      usage: {
        ...response.usage,
        total_cost: cost
      },
      model: model,
      provider: modelConfig.provider
    });

  } catch (error) {
    console.error('Multi-model API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        model: 'unknown',
        provider: 'unknown'
      },
      { status: 500 }
    );
  }
}