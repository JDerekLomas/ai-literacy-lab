'use client';

import React, { useMemo, useState } from 'react';

interface VibeSetting {
  id: string;
  name: string;
  description: string;
  gradient: string;
  accent: string;
  soundtrack: string[];
  lighting: string[];
  energy: string;
  recommendedPrompts: string[];
}

interface ChallengeMode {
  id: string;
  title: string;
  energy: string;
  learningFocus: string;
  stretchGoals: string[];
}

interface FeatureIdea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const vibeSettings: VibeSetting[] = [
  {
    id: 'lofi-lounge',
    name: 'Lo-Fi Flow Lounge',
    description:
      'Glowing neon gradients, rain-on-window loops, and cozy refactor sessions with mellow beats guiding every commit.',
    gradient: 'from-purple-900 via-indigo-900 to-slate-900',
    accent: 'shadow-purple-500/40 border-purple-400/40',
    soundtrack: ['dusty boom-bap drums', 'soft vinyl crackle', 'lo-fi jazz chords'],
    lighting: ['slow chroma shift LEDs', 'animated aurora panels', 'floating holographic kanban'],
    energy: 'Deep focus with gentle momentum',
    recommendedPrompts: [
      'Design a split-pane interface for curating synthwave playlists with live waveform previews.',
      'Prototype a collaborative study room where avatars trade code snippets in real time.',
      'Craft a dashboard that turns git stats into a dreamy audio-reactive skyline.'
    ]
  },
  {
    id: 'sunset-cyber',
    name: 'Sunset Cyber Studio',
    description:
      'Saturated oranges fade into vaporwave pinks while synth arpeggios keep energy high and experiments fearless.',
    gradient: 'from-amber-500 via-rose-500 to-fuchsia-600',
    accent: 'shadow-rose-500/40 border-rose-300/60',
    soundtrack: ['retro synth arpeggios', 'side-chain shimmer pads', 'modular bass swells'],
    lighting: ['projection-mapped palm trees', 'wireframe grid horizon', 'animated glitch typography'],
    energy: 'Playful prototyping with bold color stories',
    recommendedPrompts: [
      'Build a draggable moodboard that swaps palettes with the beat of the music.',
      'Create a component playground that remixes Tailwind tokens like a DJ.',
      'Generate a pixel art avatar lab with exportable sprite sheets.'
    ]
  },
  {
    id: 'midnight-cosmos',
    name: 'Midnight Cosmos Lab',
    description:
      'Particle fields swirl across a midnight gradient while ambient textures keep curiosity drifting and ideas expansive.',
    gradient: 'from-slate-900 via-sky-900 to-cyan-900',
    accent: 'shadow-cyan-500/40 border-cyan-300/50',
    soundtrack: ['deep-space ambient drones', 'granular vocal chops', 'soft polyrhythmic percussion'],
    lighting: ['procedural particle canopy', 'glitch-constellation grid', 'slow orbit light trails'],
    energy: 'Exploratory coding with cosmic calm',
    recommendedPrompts: [
      'Compose a constellation-based navigation system that reacts to live data streams.',
      'Prototype a journaling canvas where constellations rearrange based on mood tags.',
      'Design a WebGL star garden that blossoms with every passing test suite.'
    ]
  }
];

const challengeModes: ChallengeMode[] = [
  {
    id: 'flow-state',
    title: 'Flow State Jam',
    energy: 'Sustain a relaxed groove while iterating on micro-interactions and accessibility wins.',
    learningFocus: 'Front-end craft, component nuance, and shipping delight without burnout.',
    stretchGoals: [
      'Document purposeful motion design for screen reader users.',
      'Blend theme tokens into reusable design primitives.',
      'Map emotional tone to system feedback states.'
    ]
  },
  {
    id: 'collab-sync',
    title: 'Collab Sync-Up',
    energy: 'Pair-program with AI bandmates that harmonize code, copy, and visuals in real time.',
    learningFocus: 'Multiplayer collaboration patterns and high-signal communication prompts.',
    stretchGoals: [
      'Sketch a command palette that invites teammates into flows instantly.',
      'Design async review rituals with mood-based status chips.',
      'Prototype live presence cursors with expressive trails.'
    ]
  },
  {
    id: 'night-owl',
    title: 'Night Owl Experiment',
    energy: 'Late-night curiosity quests focused on speculative features and weird creative sparks.',
    learningFocus: 'Rapid prototyping, systems thinking, and fearless experimentation.',
    stretchGoals: [
      'Spin up a sandbox that remixes APIs like modular synth patches.',
      'Storyboard surprising onboarding moments for niche users.',
      'Launch a glitch-art debug console with ambient feedback.'
    ]
  }
];

const featureIdeas: FeatureIdea[] = [
  {
    id: 'live-viz',
    title: 'Live Visualizer Layer',
    description: 'Translate code events into waveform, particle, or gradient reactions for instant vibes.',
    icon: '🎛️'
  },
  {
    id: 'mood-profiles',
    title: 'Mood Profile Switcher',
    description: 'Quick-swap layouts, palettes, and sonic layers based on the team energy check-in.',
    icon: '🎚️'
  },
  {
    id: 'collab-loops',
    title: 'Collaboration Loops',
    description: 'Design async rituals with holographic sticky notes and voice waveform snippets.',
    icon: '🌀'
  },
  {
    id: 'quest-board',
    title: 'Quest Board System',
    description: 'Turn backlog items into narrative quests with XP, side missions, and celebration moments.',
    icon: '🪐'
  },
  {
    id: 'vibe-audio',
    title: 'Adaptive Audio Engine',
    description: 'Blend ambient loops that react to focus streaks, deploys, and community shoutouts.',
    icon: '🎵'
  }
];

const creativeStacks = ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Three.js', 'WebSockets'];
const creativeExtras = ['retro glitch overlays', 'hand-drawn annotations', 'ambient status orbs', 'synced light pulses'];

const CoolVibeCodingLab: React.FC = () => {
  const [selectedVibe, setSelectedVibe] = useState<VibeSetting>(vibeSettings[0]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeMode>(challengeModes[0]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([featureIdeas[0].id, featureIdeas[2].id]);
  const [stackSelections, setStackSelections] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
  const [extrasSelections, setExtrasSelections] = useState<string[]>(['ambient status orbs']);
  const [customFocus, setCustomFocus] = useState('Craft an experience that feels like a music producer desk for shipping code.');
  const [tempo, setTempo] = useState<number>(88);
  const [copied, setCopied] = useState(false);

  const toggleSelection = (value: string, list: string[], updater: React.Dispatch<React.SetStateAction<string[]>>) => {
    updater((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const promptPreview = useMemo(() => {
    const stack = stackSelections.join(', ');
    const features = featureIdeas
      .filter((feature) => selectedFeatures.includes(feature.id))
      .map((feature) => feature.title)
      .join(', ');

    const extras = extrasSelections.join(', ');

    return [
      `Design a ${selectedVibe.name} interactive coding lounge using ${stack}.`,
      `Keep the energy ${selectedVibe.energy.toLowerCase()} with ${selectedVibe.soundtrack.join(', ')} guiding the flow.`,
      features
        ? `Highlight hero features like ${features} so teammates feel invited to jam along.`
        : undefined,
      extras
        ? `Layer in atmospheric touches: ${extras} that pulse around commit streaks and collaboration milestones.`
        : undefined,
      `We are in the ${selectedChallenge.title} mode focusing on ${selectedChallenge.learningFocus.toLowerCase()}.`,
      `Stretch goals include ${selectedChallenge.stretchGoals.join('; ')}.`,
      `Lighting inspirations: ${selectedVibe.lighting.join(', ')}.`,
      customFocus ? `Special request: ${customFocus}` : undefined,
      `Set the tempo to ${tempo} BPM so the UI choreography matches the beat.`
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    customFocus,
    extrasSelections,
    selectedChallenge,
    selectedFeatures,
    selectedVibe,
    stackSelections,
    tempo
  ]);

  const handleCopyPrompt = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(promptPreview);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch (error) {
        console.error('Unable to copy prompt', error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <header
        className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-8 text-white shadow-2xl ${selectedVibe.accent}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedVibe.gradient} opacity-90`}></div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Coding Vibes Lab
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight lg:text-5xl">{selectedVibe.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-white/80">{selectedVibe.description}</p>
            <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70">Soundtrack Layers</h3>
                <ul className="mt-2 space-y-1 text-white/90">
                  {selectedVibe.soundtrack.map((layer) => (
                    <li key={layer} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80"></span>
                      {layer}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70">Lighting Ideas</h3>
                <ul className="mt-2 space-y-1 text-white/90">
                  {selectedVibe.lighting.map((idea) => (
                    <li key={idea} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80"></span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 text-sm text-white/80 shadow-lg backdrop-blur-xl">
            <div className="text-xs uppercase tracking-widest text-white/60">Energy</div>
            <div className="mt-2 text-lg font-semibold text-white">{selectedVibe.energy}</div>
            <div className="mt-6 text-xs uppercase tracking-widest text-white/60">Tempo (BPM)</div>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={60}
                max={140}
                value={tempo}
                onChange={(event) => setTempo(Number(event.target.value))}
                className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
              />
              <span className="text-2xl font-bold text-white/90">{tempo}</span>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Pick your vibe stage</h2>
            <p className="text-sm text-slate-600">
              Each scene remixes color, sound, and lighting to inspire different build sessions. Click to explore the moodboard.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vibeSettings.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe)}
              className={`group relative overflow-hidden rounded-2xl border bg-slate-900/90 p-6 text-left shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                selectedVibe.id === vibe.id ? 'border-white/70 ring-2 ring-purple-400/60' : 'border-white/10'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-80 transition-opacity group-hover:opacity-100`}></div>
              <div className="relative z-10 flex flex-col gap-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{vibe.name}</h3>
                  {selectedVibe.id === vibe.id && <span className="text-sm text-white/80">Active</span>}
                </div>
                <p className="text-sm text-white/80">{vibe.description}</p>
                <div className="rounded-xl bg-black/30 p-4 text-xs text-white/80">
                  <div className="uppercase tracking-widest text-white/60">Prompt Seeds</div>
                  <ul className="mt-2 space-y-1">
                    {vibe.recommendedPrompts.map((prompt) => (
                      <li key={prompt} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-white/70"></span>
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Choose your challenge mode</h2>
              <p className="text-sm text-slate-600">Lock in the groove that matches your session energy and learning goals.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {challengeModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedChallenge(mode)}
                className={`flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                  selectedChallenge.id === mode.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50/40'
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">{mode.title}</div>
                <p className="text-sm text-slate-600">{mode.energy}</p>
                <div className="rounded-xl bg-white p-3 text-xs text-slate-500">
                  <div className="font-semibold text-slate-700">Stretch Goals</div>
                  <ul className="mt-2 space-y-1">
                    {mode.stretchGoals.map((goal) => (
                      <li key={goal} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-purple-400"></span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6 text-white shadow-xl">
          <div>
            <h2 className="text-xl font-semibold">Session Remix Tips</h2>
            <p className="mt-2 text-sm text-white/80">
              Pair your challenge with intentional rituals: start with a vibe check, set a three-song sprint timer, and end with a
              celebration commit message.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-widest text-white/60">Micro Rituals</div>
              <ul className="mt-2 space-y-1">
                <li>🎧 Sync headphones with the chosen soundtrack before coding.</li>
                <li>💬 Share a vibe emoji status in your team chat.</li>
                <li>✨ Drop a highlight gif when you push a magical commit.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="text-xs uppercase tracking-widest text-white/60">Makerspace Snacks</div>
              <ul className="mt-2 space-y-1">
                <li>🫐 Sparkling blueberry iced tea</li>
                <li>🍫 Dark chocolate espresso bites</li>
                <li>🥭 Mango mochi for deployment parties</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Assemble your creative stack</h2>
              <p className="text-sm text-slate-600">
                Toggle technologies and atmospheric extras to sculpt the exact prompt flavor you want.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Core Stack</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {creativeStacks.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleSelection(item, stackSelections, setStackSelections)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      stackSelections.includes(item)
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-slate-200 text-slate-600 hover:border-purple-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Atmospheric Extras</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {creativeExtras.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleSelection(item, extrasSelections, setExtrasSelections)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      extrasSelections.includes(item)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Signature Features</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {featureIdeas.map((feature) => {
                  const isActive = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleSelection(feature.id, selectedFeatures, setSelectedFeatures)}
                      className={`flex h-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-900/40 hover:bg-slate-900/5'
                      }`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </div>
                      <p className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-600'}`}>{feature.description}</p>
                      {isActive && <span className="text-xs uppercase tracking-widest text-white/70">Locked In</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 shadow-xl">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Prompt composer</h2>
            <p className="text-sm text-slate-600">
              Remix your selections into an expressive brief you can drop into your favorite AI coding partner.
            </p>
          </div>
          <div className="flex-1">
            <textarea
              value={promptPreview}
              readOnly
              className="h-64 w-full resize-none rounded-2xl border border-purple-200 bg-white/80 p-4 font-mono text-sm text-slate-800 shadow-inner focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500" htmlFor="custom-focus">
              Custom flourish
            </label>
            <textarea
              id="custom-focus"
              value={customFocus}
              onChange={(event) => setCustomFocus(event.target.value)}
              placeholder="Describe the emotional arc, user journey twist, or community moment you want to amplify."
              className="h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 focus:border-purple-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
            >
              {copied ? 'Copied ✨' : 'Copy prompt'}
            </button>
            <span className="text-xs text-slate-500">
              Your selections auto-update the prompt with every vibe shift.
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Session milestones</h2>
            <p className="text-sm text-slate-600">
              Track the journey from mood-boarding to launch-night glow with celebratory rituals.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Flow Checkpoint
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sky-400"></span>
              Collab Moment
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              Celebration
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[{
            title: 'Opening Scene',
            description: 'Run a vibe check, align on intentions, and sketch the hero interaction on a communal canvas.',
            tag: 'Flow Checkpoint',
            color: 'bg-emerald-400'
          },
          {
            title: 'Mid-session Jam',
            description: 'Swap remix ideas, pair with your AI collaborator, and record a 30-second walkthrough clip.',
            tag: 'Collab Moment',
            color: 'bg-sky-400'
          },
          {
            title: 'Golden Hour Launch',
            description: 'Ship the feature, queue the celebratory emoji rain, and log a reflection for future selves.',
            tag: 'Celebration',
            color: 'bg-purple-400'
          }].map((milestone) => (
            <div key={milestone.title} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${milestone.color}`}>
                  {milestone.tag}
                </span>
              </div>
              <p className="text-sm text-slate-600">{milestone.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CoolVibeCodingLab;
