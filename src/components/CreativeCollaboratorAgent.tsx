'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface CreativeSession {
  id: string;
  title: string;
  type: 'brainstorm' | 'problem-solve' | 'design' | 'strategy' | 'write';
  description: string;
  context: string;
  constraints: string[];
  prompts: CreativePrompt[];
  currentStep: number;
  results: string[];
}

interface CreativePrompt {
  id: string;
  step: number;
  title: string;
  instruction: string;
  promptTemplate: string;
  purpose: string;
  tips: string[];
}

interface CreativeProject {
  id: string;
  title: string;
  type: CreativeSession['type'];
  description: string;
  sessions: CreativeSession[];
  progress: number;
}

export const CreativeCollaboratorAgent: React.FC = () => {
  const [activeProject, setActiveProject] = useState<CreativeProject | null>(null);
  const [activeSession, setActiveSession] = useState<CreativeSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const sessionTemplates: Omit<CreativeSession, 'id' | 'currentStep' | 'results'>[] = [
    {
      title: "Business Idea Generation",
      type: "brainstorm",
      description: "Generate innovative business ideas based on your skills, interests, and market opportunities",
      context: "You want to start a business but need creative ideas that match your situation",
      constraints: ["Budget limitations", "Time constraints", "Skill set", "Market demand"],
      prompts: [
        {
          id: 'context-setting',
          step: 1,
          title: 'Set the Creative Context',
          instruction: 'Tell Claude about your background, interests, and constraints',
          promptTemplate: 'I want to brainstorm business ideas. Here\'s my context: Skills: [your skills], Interests: [your passions], Available time: [time commitment], Budget: [available capital], Target market: [who you want to serve]. I\'m particularly drawn to [specific industries/causes]. Can you help me generate business ideas that align with these factors?',
          purpose: 'Establish the foundation for targeted, realistic idea generation',
          tips: ['Be specific about your unique combination of skills', 'Mention any market gaps you\'ve noticed', 'Include your values and what motivates you']
        },
        {
          id: 'divergent-thinking',
          step: 2,
          title: 'Divergent Idea Generation',
          instruction: 'Generate a wide range of creative possibilities',
          promptTemplate: 'Based on my context, let\'s brainstorm 15-20 business ideas using different approaches: 1) Problems I could solve, 2) Skills I could monetize, 3) Trends I could leverage, 4) Underserved markets I could address, 5) Creative combinations of existing ideas. Please be creative and don\'t worry about feasibility yet.',
          purpose: 'Generate quantity and variety of ideas without judgment',
          tips: ['Ask for wild, unconventional ideas too', 'Request different business models', 'Don\'t filter ideas yet - go for volume']
        },
        {
          id: 'convergent-analysis',
          step: 3,
          title: 'Evaluate and Refine',
          instruction: 'Analyze the best ideas for feasibility and potential',
          promptTemplate: 'From our brainstormed ideas, please help me evaluate the top 5-7 based on: 1) Alignment with my skills/interests, 2) Market potential, 3) Startup costs, 4) Time to profitability, 5) Scalability. For each promising idea, provide: - Why it fits me well, - Potential challenges, - First steps to validate it, - Revenue model options.',
          purpose: 'Focus on the most promising opportunities with actionable next steps',
          tips: ['Ask for validation strategies', 'Request competitor analysis', 'Get specific about revenue models']
        }
      ]
    },
    {
      title: "Creative Problem Solving",
      type: "problem-solve",
      description: "Tackle complex challenges using structured creative thinking approaches",
      context: "You have a difficult problem that requires innovative solutions",
      constraints: ["Resource limitations", "Time pressure", "Stakeholder needs", "Risk factors"],
      prompts: [
        {
          id: 'problem-definition',
          step: 1,
          title: 'Define the Real Problem',
          instruction: 'Clearly articulate the problem and its context',
          promptTemplate: 'I\'m facing this challenge: [describe the situation]. The obvious problem seems to be [apparent issue], but I want to make sure I\'m solving the right thing. Can you help me: 1) Reframe this problem from different angles, 2) Identify root causes vs. symptoms, 3) Question my assumptions, 4) Define what success would look like?',
          purpose: 'Ensure you\'re solving the actual problem, not just symptoms',
          tips: ['Describe the full situation', 'Mention stakeholders affected', 'Include what you\'ve already tried']
        },
        {
          id: 'solution-generation',
          step: 2,
          title: 'Generate Creative Solutions',
          instruction: 'Explore unconventional approaches and possibilities',
          promptTemplate: 'For the problem we defined: [restated problem]. Let\'s generate solutions using different thinking approaches: 1) What would [relevant expert/role model] do? 2) How could technology solve this? 3) What if we had unlimited resources? 4) What if we had to solve it with no money? 5) How might nature solve this? 6) What\'s the opposite approach? Please give me 10-15 diverse solution ideas.',
          purpose: 'Break out of conventional thinking to find innovative approaches',
          tips: ['Ask for solutions from different industries', 'Request both high-tech and low-tech options', 'Include collaborative approaches']
        },
        {
          id: 'solution-development',
          step: 3,
          title: 'Develop Implementation Plans',
          instruction: 'Turn the best ideas into actionable plans',
          promptTemplate: 'From our solution ideas, I\'m most interested in: [top 3 solutions]. For each, can you help me develop: 1) Implementation steps with timeline, 2) Resources and support needed, 3) Potential obstacles and mitigation strategies, 4) Success metrics, 5) Pilot/test approach to validate before full implementation?',
          purpose: 'Transform creative ideas into realistic action plans',
          tips: ['Ask for risk assessment', 'Request measurement strategies', 'Get backup plan options']
        }
      ]
    },
    {
      title: "Content Creation & Writing",
      type: "write",
      description: "Collaborate with AI to create compelling content for any purpose",
      context: "You need to create written content but want it to be engaging and effective",
      constraints: ["Audience needs", "Brand voice", "Platform requirements", "Time constraints"],
      prompts: [
        {
          id: 'content-strategy',
          step: 1,
          title: 'Content Strategy & Planning',
          instruction: 'Define your content goals and audience',
          promptTemplate: 'I need to create [type of content] for [target audience]. Purpose: [main goal - inform, persuade, entertain, etc.]. Context: [where/how it will be used]. My audience cares about [audience interests/needs]. My brand voice is [describe tone/personality]. Key message: [main point to communicate]. Can you help me: 1) Refine my content strategy, 2) Suggest the best format/structure, 3) Identify key points to cover, 4) Recommend engagement techniques?',
          purpose: 'Establish clear direction and structure for your content',
          tips: ['Be specific about your audience', 'Mention platform constraints', 'Include examples of content you admire']
        },
        {
          id: 'collaborative-creation',
          step: 2,
          title: 'Collaborative Content Creation',
          instruction: 'Work with AI to generate and refine content',
          promptTemplate: 'Based on our strategy, let\'s create the content together. I\'ll provide key points and you help with: 1) Compelling headlines/openings, 2) Clear structure and flow, 3) Engaging language and tone, 4) Strong conclusions/calls-to-action. Here are my key points: [your main ideas]. Let\'s start with [specific section] and build from there.',
          purpose: 'Leverage AI for creativity while maintaining your unique voice and insights',
          tips: ['Share your unique insights first', 'Ask for multiple options', 'Request specific improvements']
        },
        {
          id: 'refinement-optimization',
          step: 3,
          title: 'Refinement & Optimization',
          instruction: 'Polish and optimize your content for maximum impact',
          promptTemplate: 'Here\'s our draft content: [paste content]. Please help me optimize it by: 1) Improving clarity and flow, 2) Strengthening weak sections, 3) Enhancing engagement and readability, 4) Ensuring it achieves our goals, 5) Adapting for our specific platform/medium. Also suggest A/B testing ideas if applicable.',
          purpose: 'Polish your content to professional quality and maximum effectiveness',
          tips: ['Ask for specific feedback areas', 'Request alternative versions', 'Get platform-specific optimization']
        }
      ]
    }
  ];

  const simulateAIResponse = useCallback((prompt: string, sessionType: string, step: number): string => {
    const responses: Record<string, Record<number, string>> = {
      'brainstorm': {
        1: `Great! Based on your background and interests, I can see several exciting directions for business ideas. Let me understand your context better and then we'll generate targeted opportunities.

**Your Profile Analysis:**
- Skills: [Based on what you shared]
- Market Position: [Your unique advantages]
- Constraints: [Realistic limitations to work within]

**Promising Directions I See:**
1. Leveraging your expertise in [field] for [specific market]
2. Combining your interest in [area] with growing demand for [trend]
3. Solving problems you've personally experienced in [industry]

Now let's dive deeper into specific business ideas...`,

        2: `Excellent! Here are 20 business ideas across different categories:

**Problem-Solving Businesses:**
1. [Specific service addressing pain point in your industry]
2. [Tool/app solving common frustration you've noticed]
3. [Consulting service for underserved niche]

**Skill Monetization:**
4. [Online course teaching your expertise]
5. [Done-for-you service using your skills]
6. [Hybrid consulting + software solution]

**Trend-Leveraging Opportunities:**
7. [Business riding current market wave]
8. [Traditional service with modern twist]

[Continues with all 20 ideas with brief descriptions...]

Which categories resonate most with you? We can explore the most interesting ones deeper.`,

        3: `Perfect! Let's analyze your top prospects:

**Idea #1: [Top Choice]**
✅ **Why it fits you:** [Specific alignment with skills/interests]
⚠️ **Challenges:** [Realistic obstacles to address]
📊 **Market potential:** [Size and growth outlook]
💰 **Revenue model:** [How you'd make money]
🎯 **First steps:** [Validation experiments to try]

**Idea #2: [Second Choice]**
[Similar detailed analysis...]

**Recommended Next Steps:**
1. Start with [specific validation approach] for your top choice
2. Set aside [time] for market research
3. Connect with [type of people] for feedback

Ready to dive deeper into validation strategies?`
      },
      'problem-solve': {
        1: `Excellent approach! Let's make sure we're solving the right problem.

**Problem Reframing Exercise:**
Original: [Your stated problem]

**Alternative Perspectives:**
1. **Stakeholder View:** How might [affected parties] see this differently?
2. **Root Cause:** What underlying issues might be creating this symptom?
3. **Systems View:** How does this connect to larger patterns?
4. **Opportunity Frame:** What positive outcomes could emerge?

**Assumption Check:**
- You assume [identified assumption] - is this always true?
- What if the constraint of [limitation] didn't exist?
- Who benefits from the current situation staying the same?

**Success Definition:**
If this problem were completely solved, what would you see/hear/feel?

Which reframe reveals new angles you hadn't considered?`,

        2: `Great! Let's generate diverse solutions using different thinking lenses:

**Expert Approaches:**
1. **[Industry Expert] would:** [Specific methodology]
2. **[Different Field Expert] might:** [Cross-industry insight]

**Technology Solutions:**
3. **AI/Automation approach:** [Tech-enabled solution]
4. **Simple digital tool:** [Low-tech tech solution]

**Resource Scenarios:**
5. **Unlimited budget:** [Dream solution]
6. **Zero budget:** [Resourceful approach]
7. **Collaboration focus:** [People-powered solution]

**Nature-Inspired:**
8. **Biomimicry approach:** [How nature solves similar challenges]

**Opposite Thinking:**
9. **Reverse approach:** [Completely different direction]
10. **Prevention focus:** [Stopping the problem at source]

[Continues with 5 more innovative approaches...]

Which approaches spark the most interesting possibilities?`,

        3: `Excellent! Let's develop your top 3 solutions into actionable plans:

**Solution 1: [First Choice]**
📅 **Implementation Timeline:**
- Week 1-2: [Initial steps]
- Week 3-4: [Development phase]
- Month 2: [Implementation phase]

🛠️ **Resources Needed:**
- People: [Skills/roles required]
- Tools: [Technology/materials]
- Budget: [Cost estimate]

⚠️ **Risk Mitigation:**
- Challenge: [Potential obstacle] → Solution: [Mitigation strategy]
- Challenge: [Another risk] → Solution: [How to address]

📊 **Success Metrics:**
- Leading indicators: [Early signs of progress]
- Lagging indicators: [Final success measures]

🧪 **Pilot Approach:**
Start with [small test] to validate before full rollout.

[Similar detailed plans for solutions 2 and 3...]

Ready to choose one and start the first steps?`
      }
    };

    return responses[sessionType]?.[step] || "Here's a detailed AI response helping you with this creative challenge...";
  }, []);

  const sendPrompt = useCallback(() => {
    if (!activeSession || !userInput.trim()) return;

    const response = simulateAIResponse(
      userInput,
      activeSession.type,
      activeSession.currentStep + 1
    );

    setAiResponse(response);
    setShowResponse(true);

    // Update session
    const updatedSession = {
      ...activeSession,
      currentStep: activeSession.currentStep + 1,
      results: [...activeSession.results, userInput, response]
    };

    setActiveSession(updatedSession);
    setUserInput('');
  }, [activeSession, userInput, simulateAIResponse]);

  const startNewSession = useCallback((template: typeof sessionTemplates[0]) => {
    const newSession: CreativeSession = {
      ...template,
      id: `session-${Date.now()}`,
      currentStep: 0,
      results: []
    };

    setActiveSession(newSession);
    setShowResponse(false);
  }, []);

  const renderSessionList = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Creative Collaboration Sessions</h2>
        <p className="text-gray-600">
          Work with AI to brainstorm, solve problems, and create innovative solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessionTemplates.map((template, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
            onClick={() => startNewSession(template)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{template.title}</h3>
              <span className={clsx(
                "px-3 py-1 text-xs rounded-full",
                template.type === 'brainstorm' && "bg-purple-100 text-purple-700",
                template.type === 'problem-solve' && "bg-blue-100 text-blue-700",
                template.type === 'write' && "bg-green-100 text-green-700"
              )}>
                {template.type}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{template.description}</p>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Process:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {template.prompts.map((prompt, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2">
                      {prompt.step}
                    </span>
                    {prompt.title}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Start Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveSession = () => {
    if (!activeSession) return null;

    const currentPrompt = activeSession.prompts[activeSession.currentStep];

    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setActiveSession(null)}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          ← Back to Sessions
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{activeSession.title}</h2>
              <p className="text-gray-600 mt-1">{activeSession.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                Step {activeSession.currentStep + 1}/{activeSession.prompts.length}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {activeSession.prompts.map((prompt, index) => (
              <div
                key={index}
                className={clsx(
                  "flex-1 h-2 rounded",
                  index <= activeSession.currentStep ? "bg-blue-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {currentPrompt && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {currentPrompt.title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                <p className="text-gray-600 mb-4">{currentPrompt.instruction}</p>

                <h4 className="font-medium text-gray-800 mb-2">Purpose</h4>
                <p className="text-sm text-blue-600">{currentPrompt.purpose}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Tips for Better Results</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentPrompt.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Prompt Template</h4>
              <p className="text-sm text-blue-700 italic">"{currentPrompt.promptTemplate}"</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Prompt (customize the template above):
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Customize the prompt template with your specific details..."
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={sendPrompt}
                disabled={!userInput.trim()}
                className={clsx(
                  "w-full py-3 px-6 rounded-lg font-medium",
                  userInput.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                Send to Claude
              </button>
            </div>
          </div>
        )}

        {showResponse && aiResponse && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Claude's Response</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{aiResponse}</div>
            </div>

            {activeSession.currentStep < activeSession.prompts.length - 1 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowResponse(false)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Continue to Next Step
                </button>
              </div>
            )}
          </div>
        )}

        {activeSession.results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session History</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeSession.results.map((result, index) => (
                <div key={index} className={clsx(
                  "p-3 rounded",
                  index % 2 === 0 ? "bg-blue-50 border-l-4 border-blue-200" : "bg-purple-50 border-l-4 border-purple-200"
                )}>
                  <div className="font-medium text-sm mb-1">
                    {index % 2 === 0 ? 'Your Input:' : 'Claude\'s Response:'}
                  </div>
                  <div className="text-gray-700 text-sm whitespace-pre-wrap">
                    {result.length > 200 ? `${result.substring(0, 200)}...` : result}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Creative Collaborator Agent
          </h1>
          <p className="text-gray-600">
            Partner with AI for brainstorming, problem-solving, and creative content creation
          </p>
        </div>

        {!activeSession ? renderSessionList() : renderActiveSession()}
      </div>
    </div>
  );
};

export default CreativeCollaboratorAgent;