'use client';

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface ProductivityWorkflow {
  id: string;
  title: string;
  category: 'learning' | 'decision' | 'analysis' | 'planning' | 'communication';
  description: string;
  useCase: string;
  timesSaved: string;
  difficulty: 1 | 2 | 3;
  steps: WorkflowStep[];
  examples: WorkflowExample[];
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
  tips: string[];
  expectedOutput: string;
}

interface WorkflowExample {
  scenario: string;
  input: string;
  output: string;
}

interface UserSession {
  workflowId: string;
  currentStep: number;
  inputs: string[];
  outputs: string[];
  startTime: Date;
  completed: boolean;
}

export const AIProductivityAgent: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<ProductivityWorkflow | null>(null);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [completedWorkflows, setCompletedWorkflows] = useState<string[]>([]);

  const workflows: ProductivityWorkflow[] = [
    {
      id: 'rapid-learning',
      title: 'Rapid Skill Learning',
      category: 'learning',
      description: 'Learn any new skill efficiently with AI-designed learning paths',
      useCase: 'When you need to quickly get competent in a new area',
      timesSaved: 'Reduces learning time by 50-70%',
      difficulty: 2,
      steps: [
        {
          id: 'skill-analysis',
          title: 'Skill Deconstruction',
          description: 'Break down the skill into learnable components',
          promptTemplate: 'I want to learn [specific skill] to achieve [specific goal]. I currently have [relevant background]. Can you: 1) Break this skill into 5-7 core components, 2) Identify the 20% of sub-skills that will give me 80% of the results, 3) Suggest the optimal learning sequence, 4) Estimate realistic timeframes for each component?',
          tips: ['Be specific about your end goal', 'Mention your current level', 'Include time constraints'],
          expectedOutput: 'Structured breakdown with learning priorities and timeline'
        },
        {
          id: 'resource-curation',
          title: 'Resource Identification',
          description: 'Find the best learning resources for your style and goals',
          promptTemplate: 'For learning [skill from previous step], I learn best through [learning preferences]. I have [time available] per week and prefer [free/paid] resources. Can you recommend: 1) The single best resource for each core component, 2) Practice exercises I can do, 3) Communities where I can get feedback, 4) How to know when I\'ve mastered each component?',
          tips: ['Specify your learning style', 'Mention budget constraints', 'Ask for active practice methods'],
          expectedOutput: 'Curated list of resources with practice recommendations'
        },
        {
          id: 'practice-design',
          title: 'Practice System Design',
          description: 'Create a system for deliberate practice and skill application',
          promptTemplate: 'Based on my [skill] learning plan, design a practice system that includes: 1) Daily/weekly practice routines, 2) Progressive challenges that build difficulty, 3) Real-world application projects, 4) Methods for self-assessment and course correction, 5) Motivation strategies for when progress feels slow. My available practice time is [schedule details].',
          tips: ['Include your real schedule', 'Ask for motivation strategies', 'Request self-assessment methods'],
          expectedOutput: 'Complete practice system with progressive challenges'
        }
      ],
      examples: [
        {
          scenario: 'Learning Python for data analysis',
          input: 'Marketing manager wanting to analyze customer data',
          output: 'Focused on pandas, visualization, and marketing-specific use cases'
        },
        {
          scenario: 'Public speaking skills',
          input: 'Software engineer needing to present to executives',
          output: 'Technical communication, executive presence, visual design'
        }
      ]
    },
    {
      id: 'decision-framework',
      title: 'Smart Decision Making',
      category: 'decision',
      description: 'Make better decisions faster using structured AI analysis',
      useCase: 'For important personal or professional decisions',
      timesSaved: 'Reduces decision time while improving quality',
      difficulty: 2,
      steps: [
        {
          id: 'decision-framing',
          title: 'Decision Framing & Context',
          description: 'Clearly define the decision and its context',
          promptTemplate: 'I need to decide: [decision description]. Context: [current situation, constraints, timeline]. Stakeholders affected: [who is impacted]. My concerns are: [worries/fears]. Success looks like: [ideal outcome]. Can you help me: 1) Reframe this decision clearly, 2) Identify what I\'m really choosing between, 3) Surface hidden assumptions, 4) Clarify what information would be most valuable?',
          tips: ['Include emotional concerns', 'Mention all stakeholders', 'Describe ideal outcomes'],
          expectedOutput: 'Clear decision frame with key considerations identified'
        },
        {
          id: 'options-analysis',
          title: 'Options Generation & Analysis',
          description: 'Explore all possible options and evaluate them systematically',
          promptTemplate: 'For my decision about [restated decision], help me: 1) Generate all possible options (including creative alternatives), 2) Analyze pros/cons for each option, 3) Identify the key criteria that matter most, 4) Rate each option on these criteria, 5) Consider what additional information I need for the top options. My values/priorities are: [what matters most to you].',
          tips: ['Ask for creative alternatives', 'Be clear about your values', 'Request systematic comparison'],
          expectedOutput: 'Comprehensive options analysis with systematic evaluation'
        },
        {
          id: 'decision-implementation',
          title: 'Decision Implementation Plan',
          description: 'Turn your decision into action with contingency planning',
          promptTemplate: 'Based on our analysis, I\'m leaning toward [preferred option]. Help me create: 1) Implementation plan with specific next steps, 2) Success metrics to track progress, 3) Contingency plans if things don\'t go as expected, 4) Communication plan for stakeholders, 5) Timeline with key milestones. Also, what could I do to test this decision on a small scale first?',
          tips: ['Ask for pilot testing options', 'Include communication needs', 'Plan for course correction'],
          expectedOutput: 'Complete implementation plan with contingencies'
        }
      ],
      examples: [
        {
          scenario: 'Career change decision',
          input: 'Should I leave my stable job for a startup opportunity?',
          output: 'Risk analysis, financial planning, career trajectory comparison'
        },
        {
          scenario: 'Business investment',
          input: 'Evaluating whether to expand into a new market',
          output: 'Market analysis, resource requirements, success metrics'
        }
      ]
    },
    {
      id: 'content-strategy',
      title: 'Strategic Content Creation',
      category: 'communication',
      description: 'Create compelling content that achieves your specific goals',
      useCase: 'For marketing, thought leadership, or personal branding',
      timesSaved: 'Creates better content in 60% less time',
      difficulty: 3,
      steps: [
        {
          id: 'audience-strategy',
          title: 'Audience & Strategy Analysis',
          description: 'Define your audience and content strategy',
          promptTemplate: 'I want to create content about [topic/area] to achieve [specific goals]. My target audience: [audience description]. They currently see me as [current perception] but I want them to see me as [desired perception]. They struggle with [audience pain points] and care about [audience values]. Can you help me: 1) Refine my content strategy, 2) Identify content angles that resonate, 3) Plan content formats and distribution, 4) Define success metrics?',
          tips: ['Be specific about goals', 'Describe audience pain points', 'Include where they consume content'],
          expectedOutput: 'Strategic content plan with audience insights'
        },
        {
          id: 'content-creation',
          title: 'Content Development',
          description: 'Create engaging, valuable content systematically',
          promptTemplate: 'Based on our strategy, I want to create [specific content type] about [topic]. My unique perspective/experience: [what you bring]. Key message: [main point]. For this piece, help me: 1) Craft a compelling hook/opening, 2) Structure the content for maximum impact, 3) Include stories/examples that resonate, 4) End with a strong call-to-action. Tone should be [desired tone].',
          tips: ['Share your unique insights', 'Ask for story suggestions', 'Specify desired tone'],
          expectedOutput: 'Well-structured, engaging content draft'
        },
        {
          id: 'content-optimization',
          title: 'Optimization & Distribution',
          description: 'Optimize for platforms and plan distribution strategy',
          promptTemplate: 'Here\'s my content: [paste content]. Help me optimize it for: 1) [specific platform] best practices, 2) SEO/discoverability, 3) Engagement and shareability, 4) Different format adaptations (social posts, email, etc.). Also suggest: 1) Distribution strategy across channels, 2) Ways to repurpose this content, 3) Follow-up content ideas, 4) Engagement strategies for comments/responses.',
          tips: ['Specify target platforms', 'Ask for repurposing ideas', 'Include engagement strategies'],
          expectedOutput: 'Optimized content with distribution plan'
        }
      ],
      examples: [
        {
          scenario: 'Thought leadership article',
          input: 'CTO sharing insights about remote team management',
          output: 'Strategic article with actionable frameworks and personal stories'
        },
        {
          scenario: 'Product launch campaign',
          input: 'SaaS startup announcing new feature',
          output: 'Multi-channel campaign with user benefits focus'
        }
      ]
    },
    {
      id: 'problem-analysis',
      title: 'Deep Problem Analysis',
      category: 'analysis',
      description: 'Understand complex problems thoroughly before solving them',
      useCase: 'For business challenges, personal issues, or strategic planning',
      timesSaved: 'Prevents wasted effort on wrong solutions',
      difficulty: 3,
      steps: [
        {
          id: 'problem-exploration',
          title: 'Problem Exploration',
          description: 'Map the full scope and context of the problem',
          promptTemplate: 'I\'m facing this challenge: [problem description]. It affects [stakeholders/areas]. I\'ve noticed [symptoms/manifestations]. This has been going on for [timeframe]. Previous attempts to address it: [what\'s been tried]. Help me: 1) Map all the dimensions of this problem, 2) Identify what might be symptoms vs. root causes, 3) Understand the broader system this exists within, 4) Question my assumptions about the problem.',
          tips: ['Include all stakeholders affected', 'Mention what you\'ve already tried', 'Describe the broader context'],
          expectedOutput: 'Comprehensive problem map with system perspective'
        },
        {
          id: 'root-cause-analysis',
          title: 'Root Cause Investigation',
          description: 'Identify the underlying causes driving the problem',
          promptTemplate: 'For the problem we mapped: [restated problem]. Help me dig deeper with: 1) "5 Whys" analysis to find root causes, 2) Stakeholder perspective analysis (how each group sees the problem), 3) Timeline analysis (how this problem evolved), 4) System dynamics (what feedback loops maintain this problem), 5) Hidden benefits analysis (who/what benefits from the status quo?)',
          tips: ['Ask for multiple analytical approaches', 'Include stakeholder perspectives', 'Look for hidden benefits'],
          expectedOutput: 'Root cause analysis with multiple perspectives'
        },
        {
          id: 'solution-strategy',
          title: 'Solution Strategy Development',
          description: 'Design comprehensive approaches to address root causes',
          promptTemplate: 'Based on our root cause analysis, the key drivers are: [main causes identified]. Help me develop: 1) Solutions targeting each root cause, 2) Quick wins vs. long-term changes, 3) Implementation strategy considering resistance/barriers, 4) Success metrics for tracking progress, 5) Risk mitigation for unintended consequences. Resources available: [constraints and assets].',
          tips: ['Address resistance to change', 'Include quick wins', 'Plan for unintended consequences'],
          expectedOutput: 'Strategic solution approach with implementation plan'
        }
      ],
      examples: [
        {
          scenario: 'Team productivity issues',
          input: 'Remote team missing deadlines and poor communication',
          output: 'Root cause analysis revealing process gaps and communication tools'
        },
        {
          scenario: 'Personal time management',
          input: 'Constantly feeling overwhelmed and behind on goals',
          output: 'System analysis of competing priorities and energy management'
        }
      ]
    }
  ];

  const simulateAIResponse = useCallback((prompt: string, workflow: ProductivityWorkflow, stepIndex: number): string => {
    const responses: Record<string, Record<number, string>> = {
      'rapid-learning': {
        0: `Excellent! Let me break down your skill learning approach:

**Core Components for [Your Skill]:**
1. **Foundation Concepts** (Week 1-2) - Essential knowledge base
2. **Basic Application** (Week 2-3) - Simple practical exercises
3. **Intermediate Techniques** (Week 4-6) - More complex applications
4. **Advanced Integration** (Week 7-8) - Combining multiple concepts
5. **Real-world Projects** (Week 9-12) - Practical implementation

**The 20% That Gives 80% Results:**
- [Specific technique/concept #1]
- [Specific technique/concept #2]
- [Specific technique/concept #3]

**Optimal Learning Sequence:**
Start with foundational concepts, then immediately apply them in simple projects. This builds confidence and retention better than pure theory.

**Realistic Timeline:**
- Basic competency: 4-6 weeks with consistent practice
- Job-ready skills: 8-12 weeks
- Advanced proficiency: 6+ months

Ready to identify the best resources for your learning style?`,

        1: `Perfect! Here are the curated resources for your learning journey:

**Core Component Resources:**
1. **Foundation:** [Specific book/course] - matches your [learning style]
2. **Application:** [Platform/tutorial series] - hands-on practice
3. **Community:** [Forum/Discord] - get feedback and support

**Practice Exercises:**
- Week 1-2: [Specific beginner projects]
- Week 3-4: [Intermediate challenges]
- Week 5+: [Real-world applications]

**Mastery Indicators:**
✅ Foundation: Can explain key concepts to someone else
✅ Application: Complete project without referring to tutorials
✅ Integration: Solve novel problems using the skill

**Budget-Friendly Alternatives:**
- Free: [YouTube series, documentation, open courses]
- Premium: [Paid platforms that offer best ROI]

Ready to design your practice system?`,

        2: `Excellent! Here's your personalized practice system:

**Daily Routine (30 min):**
- 10 min: Review previous day's concept
- 15 min: New concept learning
- 5 min: Quick application exercise

**Weekly Challenges:**
- Monday: New concept introduction
- Wed: Mid-week practice project
- Friday: Weekly project completion
- Sunday: Review and plan next week

**Progressive Projects:**
1. **Week 1:** [Simple starter project]
2. **Week 3:** [Intermediate project building on Week 1]
3. **Week 6:** [Complex project integrating multiple concepts]
4. **Week 9:** [Real-world application project]

**Self-Assessment Methods:**
- Daily: Can I explain today's concept simply?
- Weekly: Can I complete the practice project independently?
- Monthly: Am I solving problems I couldn't before?

**Motivation Strategies:**
- Track small daily wins
- Share progress with accountability partner
- Connect learning to your bigger goals
- Celebrate weekly milestones

You're set for accelerated learning success!`
      },
      'decision-framework': {
        0: `Great approach to this important decision! Let me help clarify the framework:

**Reframed Decision:**
You're really choosing between [Option A: current path with known outcomes] vs [Option B: new path with potential upside and unknown risks]

**What You're Really Choosing Between:**
- Security vs. Growth potential
- Known challenges vs. Unknown opportunities
- Current identity vs. Future vision

**Hidden Assumptions to Examine:**
- "I can't change course later if this doesn't work out"
- "The timing has to be perfect"
- "Others' opinions should heavily influence this choice"

**Key Information Needed:**
1. Financial runway and risk tolerance
2. Skill transferability between options
3. Market timing and opportunity cost
4. Personal energy and motivation levels

**Core Question:** What does "success" mean to you in 2-3 years, and which path is more likely to get you there?

Ready to explore all your options systematically?`,

        1: `Excellent! Let's analyze all your options comprehensively:

**Option Generation:**
1. **Status Quo Plus:** Stay but negotiate improvements
2. **Full Transition:** Complete change to new opportunity
3. **Gradual Transition:** Part-time/consulting bridge
4. **Hybrid Approach:** Take elements from both paths
5. **Third Alternative:** [Creative option we discovered]

**Key Evaluation Criteria:**
- Financial impact (short & long-term)
- Career growth potential
- Work-life balance
- Risk tolerance alignment
- Skill development opportunities

**Systematic Rating (1-10):**
Option 1: Status Quo Plus
- Financial: 8/10 - Stable income
- Growth: 5/10 - Limited upside
- Risk: 9/10 - Very safe
- Alignment: 6/10 - Moderate fit

[Similar analysis for each option...]

**Additional Information Needed:**
- Industry trend analysis for new field
- Network strength in target area
- Family/personal impact assessment

The data is pointing toward [emerging preference]. Ready to create an implementation plan?`,

        2: `Perfect! Here's your comprehensive implementation strategy:

**Implementation Plan for [Chosen Option]:**

**Phase 1: Preparation (Weeks 1-4)**
- Financial planning and runway assessment
- Skill gap analysis and learning plan
- Network building in target area
- Exit strategy documentation

**Phase 2: Transition (Weeks 5-8)**
- [Specific action steps with dates]
- Communication plan for current stakeholders
- New opportunity onboarding
- Risk mitigation activation

**Success Metrics:**
- Week 4: [Specific milestone]
- Month 3: [Progress indicator]
- Month 6: [Outcome measure]

**Contingency Plans:**
- **If slow progress:** [Adjustment strategy]
- **If major obstacles:** [Backup plan]
- **If better option emerges:** [Pivot strategy]

**Small-Scale Testing:**
Before full commitment, try: [Specific pilot approach to test your decision with minimal risk]

**Communication Strategy:**
- Current employer: [Approach and timing]
- Family/friends: [What to share when]
- New contacts: [Relationship building plan]

You're ready to execute this decision with confidence!`
      }
    };

    return responses[workflow.id]?.[stepIndex] || `Here's a detailed AI analysis for ${workflow.steps[stepIndex].title}...`;
  }, []);

  const executeStep = useCallback(() => {
    if (!currentSession || !selectedWorkflow || !userInput.trim()) return;

    const response = simulateAIResponse(userInput, selectedWorkflow, currentSession.currentStep);

    const updatedSession = {
      ...currentSession,
      inputs: [...currentSession.inputs, userInput],
      outputs: [...currentSession.outputs, response],
      currentStep: currentSession.currentStep + 1,
      completed: currentSession.currentStep + 1 >= selectedWorkflow.steps.length
    };

    setCurrentSession(updatedSession);
    setShowOutput(true);
    setUserInput('');

    if (updatedSession.completed && !completedWorkflows.includes(selectedWorkflow.id)) {
      setCompletedWorkflows(prev => [...prev, selectedWorkflow.id]);
    }
  }, [currentSession, selectedWorkflow, userInput, simulateAIResponse, completedWorkflows]);

  const startWorkflow = useCallback((workflow: ProductivityWorkflow) => {
    setSelectedWorkflow(workflow);
    setCurrentSession({
      workflowId: workflow.id,
      currentStep: 0,
      inputs: [],
      outputs: [],
      startTime: new Date(),
      completed: false
    });
    setShowOutput(false);
  }, []);

  const renderWorkflowList = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Productivity Workflows</h2>
        <p className="text-gray-600">
          Proven frameworks for using AI to boost your personal and professional productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={clsx(
              "bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1",
              completedWorkflows.includes(workflow.id) && "border-2 border-green-300"
            )}
            onClick={() => startWorkflow(workflow)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{workflow.title}</h3>
              <div className="flex items-center gap-2">
                {completedWorkflows.includes(workflow.id) && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
                <span className={clsx(
                  "px-2 py-1 text-xs rounded",
                  workflow.difficulty === 1 && "bg-green-100 text-green-700",
                  workflow.difficulty === 2 && "bg-yellow-100 text-yellow-700",
                  workflow.difficulty === 3 && "bg-red-100 text-red-700"
                )}>
                  Level {workflow.difficulty}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className={clsx(
                "inline-block px-3 py-1 text-sm rounded-full",
                workflow.category === 'learning' && "bg-purple-100 text-purple-700",
                workflow.category === 'decision' && "bg-blue-100 text-blue-700",
                workflow.category === 'analysis' && "bg-green-100 text-green-700",
                workflow.category === 'planning' && "bg-yellow-100 text-yellow-700",
                workflow.category === 'communication' && "bg-pink-100 text-pink-700"
              )}>
                {workflow.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{workflow.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Use Case:</span>
                {workflow.useCase}
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <span className="font-medium mr-2">Benefit:</span>
                {workflow.timesSaved}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Process ({workflow.steps.length} steps):</h4>
              <div className="space-y-1">
                {workflow.steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {step.title}
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Start Workflow
            </button>
          </div>
        ))}
      </div>

      {completedWorkflows.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Your Progress</h3>
          <p className="text-green-700">
            Completed: {completedWorkflows.length}/{workflows.length} workflows
          </p>
          <div className="w-full bg-green-200 rounded-full h-3 mt-2">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedWorkflows.length / workflows.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveWorkflow = () => {
    if (!selectedWorkflow || !currentSession) return null;

    const currentStep = selectedWorkflow.steps[currentSession.currentStep];
    const isCompleted = currentSession.completed;

    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => {
            setSelectedWorkflow(null);
            setCurrentSession(null);
            setShowOutput(false);
          }}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          ← Back to Workflows
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedWorkflow.title}</h2>
              <p className="text-gray-600 mt-1">{selectedWorkflow.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                Step {Math.min(currentSession.currentStep + 1, selectedWorkflow.steps.length)}/{selectedWorkflow.steps.length}
              </div>
              <div className="text-sm text-gray-500">
                {isCompleted ? 'Completed!' : 'In Progress'}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {selectedWorkflow.steps.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  "flex-1 h-2 rounded",
                  index < currentSession.currentStep ? "bg-green-500" :
                  index === currentSession.currentStep ? "bg-blue-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {!isCompleted && currentStep && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {currentStep.title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                <p className="text-gray-600 mb-4">{currentStep.description}</p>

                <h4 className="font-medium text-gray-800 mb-2">Expected Output</h4>
                <p className="text-sm text-blue-600">{currentStep.expectedOutput}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Tips for Best Results</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentStep.tips.map((tip, index) => (
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
              <p className="text-sm text-blue-700 italic">"{currentStep.promptTemplate}"</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Customized Prompt:
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
                onClick={executeStep}
                disabled={!userInput.trim()}
                className={clsx(
                  "w-full py-3 px-6 rounded-lg font-medium",
                  userInput.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                Execute with Claude
              </button>
            </div>
          </div>
        )}

        {showOutput && currentSession.outputs.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Claude's Analysis</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {currentSession.outputs[currentSession.outputs.length - 1]}
              </div>
            </div>

            {!isCompleted && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOutput(false)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Continue to Next Step
                </button>
              </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">🎉 Workflow Completed!</h3>
            <p className="text-green-700 mb-4">
              You've successfully completed the {selectedWorkflow.title} workflow.
              You now have a structured approach and actionable insights for this area.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedWorkflow(null);
                  setCurrentSession(null);
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Try Another Workflow
              </button>
              <button
                onClick={() => startWorkflow(selectedWorkflow)}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Restart This Workflow
              </button>
            </div>
          </div>
        )}

        {currentSession.inputs.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session History</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {currentSession.inputs.map((input, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-blue-700">
                      Step {index + 1}: {selectedWorkflow.steps[index]?.title}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="font-medium text-gray-700">Your Input:</span>
                    <p className="text-gray-600 mt-1 text-sm">{input}</p>
                  </div>
                  {currentSession.outputs[index] && (
                    <div>
                      <span className="font-medium text-purple-700">Claude's Response:</span>
                      <p className="text-gray-600 mt-1 text-sm">
                        {currentSession.outputs[index].substring(0, 200)}...
                        <button className="text-blue-600 hover:underline ml-1">
                          View Full Response
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Productivity Agent
          </h1>
          <p className="text-gray-600">
            Proven workflows for using AI to accelerate learning, decision-making, and problem-solving
          </p>
        </div>

        {!selectedWorkflow ? renderWorkflowList() : renderActiveWorkflow()}
      </div>
    </div>
  );
};

export default AIProductivityAgent;