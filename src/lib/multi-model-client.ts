export interface AIModel {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai' | 'qwen' | 'huggingface';
  costPer1kTokens: number;
  strengths: string[];
  bestFor: string[];
  maxTokens: number;
  supportsImages?: boolean;
  supportsCode?: boolean;
}

export const availableModels: AIModel[] = [
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    costPer1kTokens: 0.003,
    strengths: ['Reasoning', 'Code', 'Analysis', 'Safety'],
    bestFor: ['Complex reasoning', 'Code generation', 'Educational content'],
    maxTokens: 200000,
    supportsImages: true,
    supportsCode: true
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    costPer1kTokens: 0.00025,
    strengths: ['Speed', 'Efficiency', 'Basic tasks'],
    bestFor: ['Quick responses', 'Simple analysis', 'Cost-sensitive applications'],
    maxTokens: 200000,
    supportsImages: true,
    supportsCode: true
  },

  // Qwen Models (Alibaba Cloud)
  {
    id: 'qwen2.5-72b-instruct',
    name: 'Qwen2.5 72B Instruct',
    provider: 'qwen',
    costPer1kTokens: 0.0008,
    strengths: ['Multilingual', 'Cost-effective', 'Reasoning', 'Code'],
    bestFor: ['Budget-conscious projects', 'Multilingual content', 'General tasks'],
    maxTokens: 32768,
    supportsImages: false,
    supportsCode: true
  },
  {
    id: 'qwen2.5-32b-instruct',
    name: 'Qwen2.5 32B Instruct',
    provider: 'qwen',
    costPer1kTokens: 0.0004,
    strengths: ['Very cost-effective', 'Good reasoning', 'Fast'],
    bestFor: ['High-volume applications', 'Educational exercises', 'Prototyping'],
    maxTokens: 32768,
    supportsImages: false,
    supportsCode: true
  },
  {
    id: 'qwen2.5-14b-instruct',
    name: 'Qwen2.5 14B Instruct',
    provider: 'qwen',
    costPer1kTokens: 0.0002,
    strengths: ['Ultra cost-effective', 'Decent performance', 'Very fast'],
    bestFor: ['Learning exercises', 'Simple tasks', 'Experimentation'],
    maxTokens: 32768,
    supportsImages: false,
    supportsCode: true
  },

  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    costPer1kTokens: 0.005,
    strengths: ['Multimodal', 'Reasoning', 'Creativity'],
    bestFor: ['Complex tasks', 'Creative writing', 'Image analysis'],
    maxTokens: 128000,
    supportsImages: true,
    supportsCode: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    costPer1kTokens: 0.00015,
    strengths: ['Cost-effective', 'Fast', 'Good reasoning'],
    bestFor: ['Simple tasks', 'High-volume applications', 'Learning'],
    maxTokens: 128000,
    supportsImages: true,
    supportsCode: true
  }
];

export interface MultiModelAPIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_cost?: number;
  };
  model: string;
  provider: string;
  error?: string;
}

export interface MultiModelAPIRequest {
  model: string;
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  agent?: string;
  method?: string;
}

export async function callMultiModelAPI(params: MultiModelAPIRequest): Promise<MultiModelAPIResponse> {
  try {
    const response = await fetch('/api/multi-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Multi-Model API Call Error:', error);
    return {
      content: 'Sorry, I encountered an error while processing your request. Please try again.',
      model: params.model,
      provider: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Model recommendation engine
export function recommendModel(useCase: 'education' | 'prototyping' | 'production' | 'experimentation', budget: 'low' | 'medium' | 'high'): AIModel {
  if (budget === 'low') {
    if (useCase === 'education' || useCase === 'experimentation') {
      return availableModels.find(m => m.id === 'qwen2.5-14b-instruct')!;
    }
    return availableModels.find(m => m.id === 'qwen2.5-32b-instruct')!;
  }

  if (budget === 'medium') {
    if (useCase === 'education') {
      return availableModels.find(m => m.id === 'qwen2.5-72b-instruct')!;
    }
    return availableModels.find(m => m.id === 'gpt-4o-mini')!;
  }

  // High budget
  if (useCase === 'production') {
    return availableModels.find(m => m.id === 'claude-3-5-sonnet-20241022')!;
  }
  return availableModels.find(m => m.id === 'gpt-4o')!;
}

// Cost calculator
export function calculateCost(inputTokens: number, outputTokens: number, model: AIModel): number {
  const totalTokens = inputTokens + outputTokens;
  return (totalTokens / 1000) * model.costPer1kTokens;
}

// Model comparison utility
export function compareModels(models: AIModel[], criteria: 'cost' | 'performance' | 'speed'): AIModel[] {
  switch (criteria) {
    case 'cost':
      return [...models].sort((a, b) => a.costPer1kTokens - b.costPer1kTokens);
    case 'performance':
      // Simple heuristic: higher cost often means better performance
      return [...models].sort((a, b) => b.costPer1kTokens - a.costPer1kTokens);
    case 'speed':
      // Smaller models are generally faster
      return [...models].sort((a, b) => a.costPer1kTokens - b.costPer1kTokens);
    default:
      return models;
  }
}