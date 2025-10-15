interface ClaudeAPIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: string;
}

interface APICallParams {
  agent: string;
  method: string;
  [key: string]: any;
}

export async function callClaudeAPI(params: APICallParams): Promise<ClaudeAPIResponse> {
  try {
    const response = await fetch('/api/claude', {
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
    console.error('API Call Error:', error);
    return {
      content: 'Sorry, I encountered an error while processing your request. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Convenience functions for each agent
export const PromptMasterClient = {
  async analyzePrompt(prompt: string, context: string): Promise<ClaudeAPIResponse> {
    return callClaudeAPI({
      agent: 'prompt-master',
      method: 'analyzePrompt',
      prompt,
      context
    });
  }
};

export const GoalCoachClient = {
  async processGoalStep(prompt: string, stepContext: string): Promise<ClaudeAPIResponse> {
    return callClaudeAPI({
      agent: 'goal-coach',
      method: 'processGoalStep',
      prompt,
      stepContext
    });
  }
};

export const CreativeCollaboratorClient = {
  async processCreativeSession(prompt: string, sessionType: string, step: number): Promise<ClaudeAPIResponse> {
    return callClaudeAPI({
      agent: 'creative-collaborator',
      method: 'processCreativeSession',
      prompt,
      sessionType,
      step
    });
  }
};

export const ProductivityClient = {
  async processWorkflow(prompt: string, workflowType: string, step: number): Promise<ClaudeAPIResponse> {
    return callClaudeAPI({
      agent: 'productivity',
      method: 'processWorkflow',
      prompt,
      workflowType,
      step
    });
  }
};

export const GeneralClient = {
  async chat(
    prompt: string,
    system?: string,
    maxTokens?: number,
    temperature?: number
  ): Promise<ClaudeAPIResponse> {
    return callClaudeAPI({
      agent: 'general',
      method: 'chat',
      prompt,
      system,
      maxTokens,
      temperature
    });
  }
};