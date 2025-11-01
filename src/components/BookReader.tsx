'use client';

import React, { useState } from 'react';

export default function BookReader() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const [flashWhite, setFlashWhite] = useState(false);

  const pages = [
    {
      title: "AI Usage Wisdom for Designers",
      subtitle: "A comprehensive guide to working effectively with AI for human-centered design practice",
      isTitle: true
    },
    {
      title: "Table of Contents",
      isTOC: true,
      sections: [
        { text: "Introduction", page: 2 },
        { text: "Understanding How AI Actually Works", page: 3 },
        { text: "How AI Behaves (And Why It Matters)", page: 8 },
        { text: "What AI Is Surprisingly Good At", page: 15 },
        { text: "Understanding Limitations", page: 18 },
        { text: "The Improvement Pace", page: 22 },
        { text: "Practical Prompting Wisdom", page: 24 },
        { text: "Working with Bias", page: 28 },
        { text: "Agentic AI: Beyond Single Responses", page: 30 },
        { text: "Model Differences Matter", page: 37 },
        { text: "Building Good Habits", page: 41 },
        { text: "Common Pitfalls for Designers", page: 44 },
        { text: "AI in Design Education", page: 47 }
      ]
    },
    {
      title: "Introduction",
      chapter: "Introduction",
      content: (
        <div>
          <p>You're learning to work with AI at a pivotal moment—particularly as designers. The tools are powerful enough to be genuinely useful, changing fast enough to stay exciting, and weird enough that most people (including many designers) are using them wrong.</p>

          <p>This isn't a tutorial on specific prompts or a list of use cases. This is about <strong>understanding how AI actually behaves</strong> so you can work with it effectively as a design tool—whether you're conducting user research, exploring concepts, prototyping interactions, or documenting your process.</p>

          <p>Think of this as the mental models you need for human-AI collaboration in design practice. The specific techniques will change every few months. These principles won't.</p>
        </div>
      )
    },
    {
      title: "Context Window",
      chapter: "Understanding How AI Works",
      content: (
        <div>
          <p className="concept-intro">The context window is the <strong>attention span of the LLM</strong>. It's how much text the model can keep in its "working memory" at once.</p>

          <div className="stats-list">
            <div>GPT-4 (2023): 8K-32K tokens</div>
            <div>Claude Sonnet 4.5 (2025): 1M tokens</div>
            <div>Gemini 2.5 Pro (2025): 1M tokens</div>
          </div>

          <p className="note">Roughly: 1 token ≈ 4 characters, so 200K tokens ≈ 150,000 words, or about 300 pages</p>

          <div className="tip-box">
            <h4>Why this matters</h4>
            <ul>
              <li>When you hit the limit, early parts disappear</li>
              <li>Longer context = more expensive per message</li>
              <li>You can paste entire documents</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "System Prompt",
      chapter: "Understanding How AI Works",
      content: (
        <div>
          <p>Before you even start typing, the AI has already received instructions about how to behave. You usually can't see these, but they shape everything:</p>

          <ul>
            <li>The AI's personality and tone</li>
            <li>What it will and won't do</li>
            <li>How it formats responses</li>
            <li>Specific knowledge or capabilities</li>
          </ul>

          <div className="example-box">
            <h4>Example</h4>
            <p>Claude is instructed to be helpful but not sycophantic, to think step-by-step for complex problems, and to avoid overformatting. That's why Claude writes differently than ChatGPT.</p>
          </div>
        </div>
      )
    },
    {
      title: "Tokens",
      chapter: "Understanding How AI Works",
      content: (
        <div>
          <p>AI doesn't read letters or words. It reads <strong>tokens</strong> - chunks of text that are usually about 4 characters.</p>

          <div className="code-block">
            "Hello world" = 2 tokens
            "Design thinking" = 2 tokens
            "Supercalifragilistic..." = 7 tokens
          </div>

          <div className="tip-box">
            <h4>Why this matters</h4>
            <ul>
              <li>API costs are calculated per token</li>
              <li>Context limits are in tokens</li>
              <li>Different languages use different token counts</li>
              <li>English is efficient; many languages use 2-3x more tokens</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Stateless Conversations",
      chapter: "Understanding How AI Works",
      content: (
        <div>
          <p>The AI doesn't "remember" your last message. Instead, <strong>the entire conversation history gets sent with each new message</strong>.</p>

          <p>Think of it like this: every time you send a message, the AI reads the <em>whole conversation from the beginning</em>, then writes a response.</p>

          <div className="warning-box">
            <h4>This is why</h4>
            <ul>
              <li>Long conversations get progressively more expensive</li>
              <li>The AI sometimes "forgets" early details</li>
              <li>You can "remind" it by referencing earlier points</li>
              <li>Starting a new conversation means losing all context</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Sycophancy",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>AI has a strong, built-in bias to agree with you. It's been trained to be helpful and agreeable, which means it will often validate your ideas even when they're flawed.</p>

          <div className="comparison">
            <div className="comparison-bad">
              <div className="comparison-label">Leading</div>
              <p>"This circular economy system works well, right?"</p>
            </div>
            <div className="comparison-good">
              <div className="comparison-label">Neutral</div>
              <p>"What problems do you see with this circular economy system?"</p>
            </div>
          </div>

          <div className="tip-box">
            <h4>What to do</h4>
            <p>Ask for criticism explicitly:</p>
            <ul>
              <li>"What are three things wrong with this?"</li>
              <li>"Why might this design fail?"</li>
              <li>"Challenge this assumption"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Verification Strategies",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>There's a myth that "AI can't verify its own outputs." That's not quite right. The issue is bias from the conversation that created the work.</p>

          <div className="concept-box">
            <h4>What Actually Works</h4>
            <p><strong>1. Web Search for Facts</strong><br/>
            AI can verify factual claims by searching the web.</p>

            <p><strong>2. Fresh Context Evaluation</strong><br/>
            Start a new conversation with only the output and clear evaluation criteria.</p>

            <p><strong>3. Multiple Evaluator Runs</strong><br/>
            Run evaluation 3-5 times and look for consistency.</p>
          </div>
        </div>
      )
    },
    {
      title: "Verbalized Sampling",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>One of the most powerful techniques: <strong>verbalized probability sampling</strong>. Instead of asking for one answer, you ask AI to generate multiple responses from the "tails" of its probability distribution.</p>

          <div className="code-block">
            Create a table of 10 user research methods
            with columns: Method Name, Probability.

            Sample from tails where probability &lt; 0.10.
            I want surprising, non-obvious methods.
          </div>

          <div className="tip-box">
            <h4>Perfect for</h4>
            <ul>
              <li>Early-stage ideation</li>
              <li>Research planning</li>
              <li>Challenging assumptions</li>
              <li>Finding unconventional approaches</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Framing Effects",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>AI is extremely susceptible to framing. The way you phrase your question determines the answer you get.</p>

          <div className="comparison">
            <div className="comparison-bad">
              <div className="comparison-label">Biased</div>
              <p>"Why does centered text create better hierarchy?"</p>
            </div>
            <div className="comparison-good">
              <div className="comparison-label">Neutral</div>
              <p>"Compare centered vs. left-aligned text. What are the tradeoffs?"</p>
            </div>
          </div>

          <p className="warning-text">Same design, opposite conclusions: "Why is this bad?" gets reasons it's bad. "Why is this good?" gets reasons it's good.</p>
        </div>
      )
    },
    {
      title: "The Randomness Problem",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>AI cannot generate truly random numbers or make truly random choices. Everything it does is <strong>weighted probability based on patterns</strong>.</p>

          <p>When you ask it to "pick randomly," it's not actually randomizing. It's picking what <em>seems most random-like</em>.</p>

          <div className="warning-box">
            <h4>Don't do this</h4>
            <p>"Randomly assign these 50 users to group A or B"</p>
            <p className="note">The "random" assignment will have subtle patterns and won't be properly distributed.</p>
          </div>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Use actual random number generators</li>
              <li>Don't trust AI for true randomness</li>
              <li>Do use AI for <em>variation</em>, not randomness</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Rubrics and Scoring",
      chapter: "How AI Behaves",
      content: (
        <div>
          <p>When you give AI a rubric, it tends to:</p>

          <ul>
            <li>Cluster scores in the middle range</li>
            <li>Avoid extreme scores</li>
            <li>Weight all criteria roughly equally</li>
            <li>Be overly generous</li>
          </ul>

          <div className="example-box">
            <h4>Real Example</h4>
            <p>An instructor asked Claude to grade wireframes with weighted criteria (40%, 30%, 20%, 10%).</p>
            <p className="note">Result: Almost every wireframe got 7-8 out of 10, with nearly identical distribution, despite different weights.</p>
          </div>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Use AI to identify specific issues</li>
              <li>Generate qualitative feedback, not scores</li>
              <li>Use comparative analysis instead</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Emotional Intelligence",
      chapter: "What AI Is Good At",
      content: (
        <div>
          <p className="emphasis">People assume AI is good at "logical" tasks and bad at emotional ones. <strong>The opposite is often true.</strong></p>

          <p>AI is remarkably good at:</p>
          <ul>
            <li>Detecting emotional tone and subtext</li>
            <li>Understanding what's not being said</li>
            <li>Identifying power dynamics</li>
            <li>Reading between the lines in transcripts</li>
            <li>Understanding stakeholder motivations</li>
          </ul>

          <div className="tip-box">
            <h4>Practical uses</h4>
            <ul>
              <li>Analyzing user research for emotional patterns</li>
              <li>Understanding contradictory client feedback</li>
              <li>Crafting empathetic copy</li>
              <li>Identifying user pain points from support tickets</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Context and Nuance",
      chapter: "What AI Is Good At",
      content: (
        <div>
          <p>Modern flagship LLMs are excellent at:</p>

          <ul>
            <li>Following complex, multi-step instructions</li>
            <li>Adapting to your style over a conversation</li>
            <li>Understanding implicit requirements</li>
            <li>Maintaining consistency</li>
            <li>Picking up on tone</li>
          </ul>

          <div className="example-box">
            <h4>Example</h4>
            <p>"Design a mobile onboarding for elderly users who are suspicious of technology, using large touch targets, avoiding jargon, making them feel in control. Warm but not patronizing. 3 screens max. Works with screen readers."</p>
            <p className="note">Claude Sonnet 4.5 will hold all constraints simultaneously, including the subtle "warm but not patronizing" tone.</p>
          </div>
        </div>
      )
    },
    {
      title: "Pattern Recognition",
      chapter: "What AI Is Good At",
      content: (
        <div>
          <p>AI can make connections between disparate fields that humans might miss:</p>

          <ul>
            <li>Linking design patterns to psychological principles</li>
            <li>Connecting your description to existing frameworks</li>
            <li>Finding parallels from other industries</li>
            <li>Identifying patterns across user research sessions</li>
          </ul>
        </div>
      ),
      relatedConcepts: [
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "Hallucinations",
      chapter: "Limitations",
      content: (
        <div>
          <p>AI will confidently generate plausible-sounding information that is completely false. It doesn't "know" when it's making things up.</p>

          <div className="warning-box">
            <h4>Common Hallucinations</h4>
            <ul>
              <li><strong>Fake statistics:</strong> "73% of users prefer dark mode"</li>
              <li><strong>Non-existent tools:</strong> "Try the Figma plugin 'DesignFlow Pro'"</li>
              <li><strong>Made-up case studies:</strong> "Airbnb's 2019 redesign increased conversions by 47%"</li>
              <li><strong>Fake citations:</strong> Legitimate-looking references that don't exist</li>
            </ul>
          </div>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Verify any factual claims</li>
              <li>Check that tools actually exist</li>
              <li>Use AI for ideation, not as source of truth</li>
              <li>Ask "Are you certain, or inferring from patterns?"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Knowledge Cutoff",
      chapter: "Limitations",
      content: (
        <div>
          <p>LLMs are trained on data up to a specific date. They don't know anything that happened after unless they can search the web.</p>

          <div className="stats-list">
            <div>GPT-4 (2023): September 2021</div>
            <div>GPT-5 (2025): October 2024</div>
            <div>Claude Sonnet 4.5 (2025): January 2025</div>
            <div>Gemini 2.5 Pro (2025): January 2025</div>
          </div>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Most tools now have web search integrated</li>
              <li>Many models search automatically when needed</li>
              <li>For best practices, cutoff doesn't matter</li>
              <li>Explicitly ask to search if info seems outdated</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Math and Counting",
      chapter: "Limitations",
      content: (
        <div>
          <p>AI doesn't do math like a calculator. It does math <strong>the way humans do</strong> - by pattern matching and approximation.</p>

          <ul>
            <li>Simple arithmetic (2 + 2) works perfectly</li>
            <li>Complex arithmetic (847 × 392) might be wrong</li>
            <li>Multi-step calculations accumulate errors</li>
            <li>Can explain concepts beautifully but miscalculate</li>
          </ul>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Use AI to set up formulas and explain concepts</li>
              <li>Use a calculator for actual arithmetic</li>
              <li>Some LLMs can now call calculator tools</li>
              <li>Double-check all calculated numbers</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Can't Count Reliably",
      chapter: "Limitations",
      content: (
        <div>
          <p>AI frequently miscounts things in text, including text it wrote itself.</p>

          <div className="example-box">
            <h4>Real Example</h4>
            <p><strong>You:</strong> "Generate a list of 15 design principles."</p>
            <p><strong>AI:</strong> Generates a list.</p>
            <p><strong>You:</strong> "How many did you give me?"</p>
            <p><strong>AI:</strong> "I gave you 15 principles."</p>
            <p className="note">(Actual count: 13)</p>
          </div>

          <p>This happens because LLMs don't "see" text as countable objects. They're generating tokens probabilistically.</p>
        </div>
      ),
      relatedConcepts: [
        { text: "Math and Counting", page: 19 }
      ]
    },
    {
      title: "The Improvement Pace",
      chapter: "Improvement Pace",
      content: (
        <div>
          <p className="emphasis">Models improve shockingly fast. Here's what became possible in just 24 months:</p>

          <div className="comparison">
            <div className="comparison-col">
              <h4>Early 2023</h4>
              <div>8K tokens</div>
              <div>Blurry images</div>
              <div>Small code functions</div>
              <div>Basic object recognition</div>
            </div>
            <div className="comparison-col">
              <h4>Late 2025</h4>
              <div>1M tokens</div>
              <div>Photorealistic video</div>
              <div>Full applications</div>
              <div>Computer control</div>
            </div>
          </div>

          <div className="warning-box">
            <h4>What this means</h4>
            <p><strong>Don't memorize current limitations.</strong> The "impossible" tasks from 6 months ago might be trivial today.</p>
          </div>
        </div>
      )
    },
    {
      title: "Your Workflow",
      chapter: "Improvement Pace",
      content: (
        <div>
          <p>Build systems that can evolve with improving capabilities:</p>

          <div className="tip-box">
            <h4>Future-Proof Practices</h4>
            <ul>
              <li>Learn prompting and evaluation, not workarounds</li>
              <li>Create reusable evaluation criteria</li>
              <li>Stay loosely coupled to specific capabilities</li>
              <li>Use AI for drafting, maintain quality control</li>
            </ul>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Building Good Habits", page: 41 }
      ]
    },
    {
      title: "Iterative Beats Perfect",
      chapter: "Practical Prompting",
      content: (
        <div>
          <p>You won't nail it on the first prompt. That's normal. <strong>Have a conversation:</strong></p>

          <ol>
            <li>Get something roughly right</li>
            <li>Point out what needs to change</li>
            <li>Refine incrementally</li>
            <li>Build on what's working</li>
          </ol>

          <p className="emphasis">This is faster than trying to craft the "perfect prompt."</p>
        </div>
      )
    },
    {
      title: "Specificity Wins",
      chapter: "Practical Prompting",
      content: (
        <div>
          <div className="comparison">
            <div className="comparison-bad">
              <div className="comparison-label">Vague</div>
              <p>"Make the product more ergonomic"</p>
            </div>
            <div className="comparison-good">
              <div className="comparison-label">Specific</div>
              <p>"Adjust handle grip to 32-35mm diameter, add 15-degree angle to reduce wrist strain, increase finger guard to 8mm minimum"</p>
            </div>
          </div>

          <div className="tip-box">
            <h4>Pro tip</h4>
            <p>Provide concrete examples of what you mean by "minimalist" or any other subjective term. AI pattern-matches to concrete references better than abstract concepts.</p>
          </div>
        </div>
      )
    },
    {
      title: "Step-by-Step Thinking",
      chapter: "Practical Prompting",
      content: (
        <div>
          <p>Adding phrases like these dramatically improves output quality:</p>

          <ul>
            <li>"Think through this step-by-step"</li>
            <li>"Explain your reasoning"</li>
            <li>"Let's work through this carefully"</li>
            <li>"First, identify the constraints, then..."</li>
          </ul>

          <p className="emphasis">This forces the model to work through logic explicitly rather than jump to conclusions.</p>
        </div>
      )
    },
    {
      title: "Request Formats",
      chapter: "Practical Prompting",
      content: (
        <div>
          <p>Don't let AI choose how to structure information. Tell it exactly what you want:</p>

          <div className="tip-box">
            <h4>Format Examples</h4>
            <ul>
              <li>"Give me 3 completely different approaches"</li>
              <li>"Create a table with: Option, Pros, Cons, Effort"</li>
              <li>"List as bullet points with headers, no paragraphs"</li>
              <li>"Brief executive summary (3 sentences) + detailed sections"</li>
            </ul>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Iterative Beats Perfect", page: 24 },
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "AI Inherits Bias",
      chapter: "Working with Bias",
      content: (
        <div>
          <p>Training data reflects human biases. AI can:</p>

          <ul>
            <li>Reinforce stereotypes (gender, race, age, ability)</li>
            <li>Default to Western/US-centric perspectives</li>
            <li>Assume binary gender</li>
            <li>Reflect ageism and ableism</li>
          </ul>

          <div className="tip-box">
            <h4>What to do</h4>
            <ul>
              <li>Explicitly specify inclusive requirements</li>
              <li>Review outputs for bias</li>
              <li>Ask "What assumptions are built in?"</li>
              <li>Request diverse examples by default</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Recency Bias",
      chapter: "Working with Bias",
      content: (
        <div>
          <p>AI tends to favor recent patterns in training data:</p>

          <ul>
            <li>Trend-chasing over timeless principles</li>
            <li>Assuming newer = better</li>
            <li>Overlooking established best practices</li>
          </ul>

          <div className="tip-box">
            <h4>What to do</h4>
            <p>When appropriate, explicitly ask for timeless principles:</p>
            <ul>
              <li>"What are the fundamental principles, regardless of trends?"</li>
              <li>"What has worked consistently over the past decade?"</li>
            </ul>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "What Is Agentic AI?",
      chapter: "Agentic AI",
      content: (
        <div>
          <div className="concept-box">
            <h4>Single-Shot vs. Agentic</h4>

            <p><strong>Single-Shot (Traditional):</strong></p>
            <p className="note">You ask → AI answers → done. Like asking a consultant.</p>

            <p><strong>Agentic:</strong></p>
            <p className="note">AI breaks down tasks, makes decisions, uses tools, iterates until goal achieved. Like hiring someone for a project.</p>
          </div>
        </div>
      )
    },
    {
      title: "When to Use Agentic",
      chapter: "Agentic AI",
      content: (
        <div>
          <div className="comparison">
            <div className="comparison-bad">
              <div className="comparison-label">Single-Shot Better</div>
              <ul>
                <li>Quick brainstorming</li>
                <li>Simple edits</li>
                <li>Explaining concepts</li>
                <li>Tasks &lt; 2 minutes</li>
              </ul>
            </div>
            <div className="comparison-good">
              <div className="comparison-label">Agentic Better</div>
              <ul>
                <li>Multi-step research</li>
                <li>Large datasets</li>
                <li>Code with debugging</li>
                <li>Tasks &gt; 10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Designing Agentic Workflows",
      chapter: "Agentic AI",
      content: (
        <div>
          <p>The key is breaking down your goal into subtasks the AI can execute independently.</p>

          <div className="tip-box">
            <h4>Good Task Design</h4>
            <p><strong>1. Define end goal clearly</strong><br/>
            ✅ "Create a service blueprint for bike-sharing in Delft, including touchpoints, activities, and pain points"</p>

            <p><strong>2. Break into verifiable steps</strong><br/>
            Each step should have clear success criteria</p>

            <p><strong>3. Give the agent needed tools</strong><br/>
            Access to files, ability to create visualizations, permission to ask questions</p>
          </div>
        </div>
      )
    },
    {
      title: "Research Assistant Pattern",
      chapter: "Agentic AI",
      content: (
        <div>
          <div className="concept-box">
            <h4>Pattern: Research Assistant</h4>
            <p><strong>Use case:</strong> Synthesizing qualitative research</p>

            <p><strong>How it works:</strong></p>
            <ol>
              <li>Upload all interview transcripts</li>
              <li>Agent codes each independently</li>
              <li>Identifies themes across transcripts</li>
              <li>Creates affinity map</li>
              <li>Generates personas or journey maps</li>
              <li>Highlights supporting quotes</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Agent Failure Modes",
      chapter: "Agentic AI",
      content: (
        <div>
          <div className="warning-box">
            <h4>Agents Can Fail Differently</h4>

            <p><strong>Runaway Agent Problem:</strong><br/>
            Given too much freedom, might iterate 50 times without checking.</p>
            <p className="note">Solution: Set clear stopping conditions and checkpoints.</p>

            <p><strong>Tool Hallucination:</strong><br/>
            Claims to use tools it doesn't have or reports false actions.</p>
            <p className="note">Solution: Verify all tool outputs.</p>

            <p><strong>Compounding Errors:</strong><br/>
            Early mistakes get built upon in weird ways.</p>
            <p className="note">Solution: Design with review checkpoints.</p>
          </div>
        </div>
      )
    },
    {
      title: "Making Agents Reliable",
      chapter: "Agentic AI",
      content: (
        <div>
          <div className="tip-box">
            <h4>Reliability Checklist</h4>

            <p><strong>1. Explicit success criteria</strong><br/>
            Don't say "analyze data." Say "create table with: Theme, Supporting Quotes (min 3), Frequency"</p>

            <p><strong>2. Constrain search space</strong><br/>
            "Generate 5 concepts addressing [pain point], each using different interaction paradigm"</p>

            <p><strong>3. Build in reflection</strong><br/>
            "Before creating blueprint, explain what you understand about the journey"</p>

            <p><strong>4. Separate evaluation</strong><br/>
            Don't ask agent to judge its own work in same context</p>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Verification Strategies", page: 9 },
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "Fast vs. Smart Models",
      chapter: "Model Differences",
      content: (
        <div>
          <div className="comparison">
            <div className="comparison-col">
              <h4>Smaller/Faster</h4>
              <p className="note">GPT-5-nano, Claude Haiku 4.5</p>
              <p><strong>Best for:</strong></p>
              <ul>
                <li>Repetitive tasks</li>
                <li>Well-defined problems</li>
                <li>Quick iterations</li>
              </ul>
            </div>
            <div className="comparison-col">
              <h4>Larger/Smarter</h4>
              <p className="note">GPT-5, Claude Sonnet 4.5</p>
              <p><strong>Best for:</strong></p>
              <ul>
                <li>Complex problems</li>
                <li>Ambiguous requirements</li>
                <li>Creative work</li>
              </ul>
            </div>
          </div>

          <div className="tip-box">
            <h4>Smart Strategy</h4>
            <p>Use fast models for iteration and exploration, then switch to smart models for final work or complex problems.</p>
          </div>
        </div>
      )
    },
    {
      title: "Multimodal Capabilities",
      chapter: "Model Differences",
      content: (
        <div>
          <p>All modern flagship LLMs now support:</p>

          <ul>
            <li><strong>See images</strong> - Describe, analyze, extract text, understand UI</li>
            <li><strong>Understand video</strong> - Analyze frames, motion, sequences</li>
            <li><strong>Generate images</strong> - DALL-E 3, Midjourney, Stable Diffusion</li>
            <li><strong>Process documents</strong> - PDFs, spreadsheets, presentations</li>
            <li><strong>Computer use</strong> - Control browsers and applications (Claude 4.5)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Reasoning Models",
      chapter: "Model Differences",
      content: (
        <div>
          <p>A major shift in 2025: "thinking" models that pause to reason before responding.</p>

          <div className="concept-box">
            <h4>What Are Reasoning Models?</h4>
            <p>Instead of immediately answering, they:</p>
            <ul>
              <li>Break down problems into logical steps</li>
              <li>Consider multiple approaches</li>
              <li>Self-correct during thinking</li>
              <li>Show their work</li>
            </ul>
          </div>

          <div className="warning-box">
            <h4>Trade-offs</h4>
            <ul>
              <li><strong>Slower</strong> - They take time to think</li>
              <li><strong>More expensive</strong> - Thinking tokens cost extra</li>
              <li><strong>Sometimes overkill</strong> - For simple tasks, standard models are faster</li>
            </ul>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "Treat AI as Collaborator",
      chapter: "Building Good Habits",
      content: (
        <div>
          <ul>
            <li>Question its suggestions</li>
            <li>Push back when something feels wrong</li>
            <li>Use it to generate options that <strong>you</strong> evaluate</li>
            <li>Remember: <strong>you're the expert on your context</strong></li>
          </ul>
        </div>
      )
    },
    {
      title: "Verify, Always",
      chapter: "Building Good Habits",
      content: (
        <div>
          <ul>
            <li>Check facts and statistics</li>
            <li>Test code before using it</li>
            <li>Review generated content for errors and bias</li>
            <li>Validate against your actual requirements</li>
          </ul>
        </div>
      )
    },
    {
      title: "Understand Your Role",
      chapter: "Building Good Habits",
      content: (
        <div>
          <div className="comparison">
            <div className="comparison-good">
              <div className="comparison-label">AI Helps You</div>
              <ul>
                <li>Explore more options faster</li>
                <li>Draft and iterate quickly</li>
                <li>Handle tedious tasks</li>
                <li>Generate variations</li>
              </ul>
            </div>
            <div className="comparison-bad">
              <div className="comparison-label">You Still</div>
              <ul>
                <li>Make final decisions</li>
                <li>Apply context and judgment</li>
                <li>Ensure quality</li>
                <li>Take responsibility</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "Visual Design Understanding",
      chapter: "Common Pitfalls",
      content: (
        <div>
          <p>AI can discuss design principles, but <strong>it can't truly perceive visual relationships</strong> the way you do.</p>

          <div className="comparison">
            <div className="comparison-good">
              <div className="comparison-label">AI Can</div>
              <ul>
                <li>Identify inconsistencies</li>
                <li>Recognize proportions</li>
                <li>Describe materials</li>
                <li>Point out accessibility issues</li>
              </ul>
            </div>
            <div className="comparison-bad">
              <div className="comparison-label">AI Struggles</div>
              <ul>
                <li>Feel if form is harmonious</li>
                <li>Judge aesthetic proportions</li>
                <li>Understand tactile quality</li>
                <li>Know if details manufacture well</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "First Drafts",
      chapter: "Common Pitfalls",
      content: (
        <div>
          <p className="emphasis">AI's first attempt is often <strong>70% there but needs your expertise to get to 100%</strong>. Don't ship the first output.</p>

          <div className="warning-box">
            <h4>Common Mistake</h4>
            <p>Over-relying on first drafts without applying your design judgment and expertise to refine the work.</p>
          </div>
        </div>
      )
    },
    {
      title: "Provide Context",
      chapter: "Common Pitfalls",
      content: (
        <div>
          <p>AI doesn't automatically know:</p>

          <ul>
            <li>Your brand guidelines or design system</li>
            <li>Your users' specific needs and constraints</li>
            <li>Your technical limitations</li>
            <li>Your team's workflow or approval processes</li>
            <li>Budget or timeline constraints</li>
          </ul>

          <p className="emphasis"><strong>Tell it all of this upfront.</strong> The more context you provide, the better the output.</p>
        </div>
      ),
      relatedConcepts: [
        { text: "Specificity Wins", page: 25 },
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "AI in Design Education",
      chapter: "Design Education",
      content: (
        <div>
          <p>Design schools are grappling with how to integrate AI into curriculum. Here's what's actually working.</p>

          <div className="concept-box">
            <h4>Research Phase: Faster Synthesis</h4>
            <p>Students used to spend weeks coding transcripts. Now:</p>
            <ul>
              <li>Upload 15 transcripts → coded in minutes</li>
              <li>Get initial themes → validate and refine</li>
              <li>Generate affinity maps → focus on interpretation</li>
            </ul>
            <p className="note">What doesn't change: You still need to conduct good interviews and judge if themes make sense.</p>
          </div>
        </div>
      )
    },
    {
      title: "Student Mistakes",
      chapter: "Design Education",
      content: (
        <div>
          <div className="warning-box">
            <h4>Mistake 1: Using AI as Shortcut to Thinking</h4>
            <p className="emphasis">"Just ask AI for the answer" becomes a substitute for struggling with the problem.</p>
            <p className="note">The struggle IS the learning. AI can help you think, but can't think for you.</p>
          </div>

          <div className="warning-box">
            <h4>Mistake 2: Trusting Generic Outputs</h4>
            <p className="emphasis">AI gives you something that looks professional but is completely generic.</p>
            <p className="note">Design is about specificity. If it could apply to anyone, it's probably not insightful.</p>
          </div>
        </div>
      )
    },
    {
      title: "Skills That Matter More",
      chapter: "Design Education",
      content: (
        <div>
          <p>With AI handling the "first 90%," these human skills become crucial:</p>

          <div className="tip-box">
            <h4>Critical Skills</h4>
            <ul>
              <li><strong>Judgment:</strong> Knowing what's good vs. generic</li>
              <li><strong>Taste:</strong> Recognizing quality</li>
              <li><strong>Context understanding:</strong> Your specific user and situation</li>
              <li><strong>Making:</strong> Physical prototyping</li>
              <li><strong>Empathy:</strong> Understanding users directly</li>
              <li><strong>Critique:</strong> Evaluating and improving iteratively</li>
            </ul>
          </div>
        </div>
      ),
      relatedConcepts: [
        { text: "Understand Your Role", page: 43 },
        { text: "Back to Table of Contents", page: 1 }
      ]
    },
    {
      title: "The Meta-Lesson",
      chapter: "Conclusion",
      isClosing: true,
      content: (
        <div>
          <p className="emphasis"><strong>AI capabilities are more powerful than most people realize, more limited than advocates claim, and changing faster than anyone can document.</strong></p>

          <p>Your job isn't to memorize what AI can or can't do today. It's to:</p>

          <ul>
            <li>Learn how to work with AI effectively</li>
            <li>Evaluate its outputs critically</li>
            <li>Adapt as capabilities change</li>
            <li>Maintain your judgment and expertise</li>
            <li>Know when to use AI and when to rely on traditional methods</li>
          </ul>

          <p className="emphasis">Remember: AI can help you explore 100 concepts in an hour. But you still need to know which one is right.</p>
        </div>
      )
    }
  ];

  const goToPage = (pageNum: number) => {
    if (pageNum !== currentPage && !isFlipping) {
      setIsFlipping(true);
      setTextVisible(false);

      setTimeout(() => {
        setFlashWhite(true);
      }, 100);

      setTimeout(() => {
        setCurrentPage(pageNum);
        setFlashWhite(false);
      }, 180);

      setTimeout(() => {
        setTextVisible(true);
        setIsFlipping(false);
      }, 250);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-3xl bg-stone-100 flex">
        {/* Left Clickable Pane */}
        <div
          onClick={prevPage}
          className={`absolute left-0 top-0 bottom-0 w-1/4 z-20 flex items-center justify-start pl-4 ${
            currentPage === 0 || isFlipping
              ? 'cursor-not-allowed'
              : 'cursor-pointer active:bg-stone-200'
          }`}
        >
          <span className={`text-5xl transition-all ${
            currentPage === 0 || isFlipping
              ? 'text-stone-300'
              : 'text-stone-400 hover:text-stone-700 hover:scale-110'
          }`}>
            ‹
          </span>
        </div>

        {/* Right Clickable Pane */}
        <div
          onClick={nextPage}
          className={`absolute right-0 top-0 bottom-0 w-1/4 z-20 flex items-center justify-end pr-4 ${
            currentPage === pages.length - 1 || isFlipping
              ? 'cursor-not-allowed'
              : 'cursor-pointer active:bg-stone-200'
          }`}
        >
          <span className={`text-5xl transition-all ${
            currentPage === pages.length - 1 || isFlipping
              ? 'text-stone-300'
              : 'text-stone-400 hover:text-stone-700 hover:scale-110'
          }`}>
            ›
          </span>
        </div>

        {/* Book Content Container */}
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-stone-50">

          {/* White Flash Overlay */}
          <div
            className="absolute inset-0 bg-white pointer-events-none z-10"
            style={{
              opacity: flashWhite ? 0.85 : 0,
              transition: 'opacity 0.08s ease-in-out'
            }}
          />

          {/* Page Content */}
          <div
            className="flex-1 flex flex-col justify-between px-16 md:px-20 lg:px-28 py-16 overflow-y-auto"
            style={{
              opacity: textVisible ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out'
            }}>

            <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
              {/* Chapter Label */}
              {pages[currentPage].chapter && !pages[currentPage].isTitle && !pages[currentPage].isTOC && (
                <div className="text-xs uppercase tracking-widest text-stone-400 mb-6 font-sans">
                  {pages[currentPage].chapter}
                </div>
              )}

              {/* Title */}
              <h1 className={`font-serif mb-6 ${
                pages[currentPage].isTitle
                  ? 'text-4xl md:text-5xl lg:text-6xl text-center leading-tight'
                  : 'text-2xl md:text-3xl leading-snug'
              } text-stone-900`}>
                {pages[currentPage].title}
              </h1>

              {/* Subtitle (for title page) */}
              {pages[currentPage].subtitle && (
                <p className="font-serif text-center text-base md:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
                  {pages[currentPage].subtitle}
                </p>
              )}

              {/* Table of Contents */}
              {pages[currentPage].isTOC && (
                <div className="space-y-3 mt-4">
                  {pages[currentPage].sections?.map((section, idx) => (
                    <div key={idx}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPage(section.page);
                        }}
                        className="font-serif text-sm md:text-base text-stone-900 font-semibold hover:text-stone-600 transition-colors text-left w-full flex justify-between items-baseline group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">{section.text}</span>
                        <span className="text-stone-400 text-xs ml-4">{section.page}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular Content */}
              {pages[currentPage].content && (
                <div className="content-wrapper font-serif text-sm md:text-base leading-relaxed text-stone-800">
                  {pages[currentPage].content}
                </div>
              )}

              {/* Related Concepts */}
              {pages[currentPage].relatedConcepts && (
                <div className="mt-10 pt-6 border-t border-stone-200">
                  <p className="font-sans text-xs text-stone-500 mb-3 uppercase tracking-wide">Related</p>
                  <div className="space-y-2">
                    {pages[currentPage].relatedConcepts.map((concept, idx) => (
                      <div key={idx}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToPage(concept.page);
                          }}
                          className="font-serif text-xs md:text-sm text-stone-700 font-semibold hover:text-stone-900 transition-colors group"
                        >
                          <span className="group-hover:translate-x-1 inline-block transition-transform">→ {concept.text}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Page Number */}
            <div className="text-center text-stone-400 text-xs font-serif mt-12">
              {currentPage + 1} / {pages.length}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .content-wrapper p {
          margin-bottom: 1em;
          line-height: 1.8;
        }

        .content-wrapper ul, .content-wrapper ol {
          margin: 1em 0 1.5em 1.5em;
          line-height: 1.8;
        }

        .content-wrapper li {
          margin-bottom: 0.5em;
        }

        .content-wrapper strong {
          font-weight: 600;
          color: #292524;
        }

        .content-wrapper em {
          font-style: italic;
        }

        .content-wrapper h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 1.5em 0 0.75em 0;
          color: #292524;
        }

        .tip-box {
          background: #f0fdf4;
          border-left: 3px solid #22c55e;
          padding: 1rem 1.25rem;
          margin: 1.25em 0;
          border-radius: 0 4px 4px 0;
        }

        .tip-box h4 {
          color: #15803d;
          margin-top: 0;
          font-size: 0.9rem;
        }

        .warning-box {
          background: #fff7ed;
          border-left: 3px solid #f97316;
          padding: 1rem 1.25rem;
          margin: 1.25em 0;
          border-radius: 0 4px 4px 0;
        }

        .warning-box h4 {
          color: #c2410c;
          margin-top: 0;
          font-size: 0.9rem;
        }

        .example-box {
          background: #fef2f2;
          border-left: 3px solid #ef4444;
          padding: 1rem 1.25rem;
          margin: 1.25em 0;
          border-radius: 0 4px 4px 0;
        }

        .example-box h4 {
          color: #b91c1c;
          margin-top: 0;
          font-size: 0.9rem;
        }

        .concept-box {
          background: #faf5ff;
          border-left: 3px solid #a855f7;
          padding: 1rem 1.25rem;
          margin: 1.25em 0;
          border-radius: 0 4px 4px 0;
        }

        .concept-box h4 {
          color: #7e22ce;
          margin-top: 0;
          font-size: 0.9rem;
        }

        .code-block {
          background: #f5f5f4;
          padding: 1rem;
          margin: 1em 0;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          font-size: 0.85em;
          line-height: 1.6;
          color: #44403c;
          white-space: pre-wrap;
        }

        .comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin: 1.25em 0;
        }

        @media (max-width: 768px) {
          .comparison {
            grid-template-columns: 1fr;
          }
        }

        .comparison-bad, .comparison-good {
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.9em;
        }

        .comparison-bad {
          background: #fef2f2;
          border: 2px solid #fca5a5;
        }

        .comparison-good {
          background: #f0fdf4;
          border: 2px solid #86efac;
        }

        .comparison-col {
          padding: 1rem;
          border-radius: 6px;
          background: #fafaf9;
          border: 1px solid #e7e5e4;
        }

        .comparison-col h4 {
          margin-top: 0;
          margin-bottom: 0.75em;
          font-size: 0.95rem;
        }

        .comparison-col div {
          margin-bottom: 0.5em;
          font-size: 0.9em;
        }

        .comparison-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .comparison-bad .comparison-label {
          color: #b91c1c;
        }

        .comparison-good .comparison-label {
          color: #15803d;
        }

        .note {
          font-size: 0.9em;
          color: #78716c;
          font-style: italic;
          margin-top: 0.5em;
        }

        .emphasis {
          font-weight: 500;
        }

        .warning-text {
          color: #c2410c;
          font-weight: 500;
        }

        .concept-intro {
          font-size: 1.05em;
          margin-bottom: 1.5em;
        }

        .stats-list {
          background: #fafaf9;
          padding: 1rem;
          margin: 1em 0;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .stats-list div {
          margin-bottom: 0.5em;
          font-family: 'SF Mono', Monaco, monospace;
        }
      `}</style>
    </div>
  );
}
