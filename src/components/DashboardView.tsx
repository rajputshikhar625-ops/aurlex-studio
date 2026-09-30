import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Film, 
  Volume2, 
  Users, 
  Layers, 
  RefreshCw,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Server,
  Terminal,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tv,
  Briefcase,
  History,
  Bot,
  Zap,
  HardDrive
} from 'lucide-react';
import { ProjectData, HardwareTelemetry, SceneItem } from '../types';

interface DashboardViewProps {
  project: ProjectData;
  telemetry: HardwareTelemetry;
  scenes: SceneItem[];
  onNavigateTab: (tab: string) => void;
  onTriggerRender: () => void;
  isRendering: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  telemetry,
  scenes,
  onNavigateTab,
  onTriggerRender,
  isRendering,
}) => {
  const [showPhilosophyModal, setShowPhilosophyModal] = useState<boolean>(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('all');

  const stages = [
    { id: 'research', label: 'Research', targetTab: 'intelligence' },
    { id: 'story', label: 'Story & Script', targetTab: 'script' },
    { id: 'characters', label: 'Characters', targetTab: 'characters' },
    { id: 'scenes', label: 'Scene Planning', targetTab: 'script' },
    { id: 'animation', label: 'Animation Engine', targetTab: 'animation' },
    { id: 'audio', label: 'Audio & Narration', targetTab: 'audio' },
    { id: 'editing', label: 'Video Edit & Mix', targetTab: 'preview' },
    { id: 'verification', label: 'Verification QA', targetTab: 'verification' },
  ] as const;

  const renderedScenesCount = scenes.filter(s => s.renderStatus.animation === 'rendered').length;
  const verifiedScenesCount = scenes.filter(s => s.verification.passed).length;
  const flaggedScenesCount = scenes.filter(s => !s.verification.passed && s.renderStatus.animation !== 'pending').length;

  // The 5 Content Verticals
  const channels = [
    {
      id: 'finance',
      name: 'Finance & Banking',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      currentProject: 'How Banks Create Liquidity',
      format: '10-min Video + Shorts',
      sources: 'RBI Master Directions, Fed Bulletins',
      characters: 'Arjun (Financial Analyst)',
    },
    {
      id: 'business',
      name: 'Business & Industry',
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      currentProject: 'Semiconductor Fab Supply Chains',
      format: 'Documentary Breakdown',
      sources: 'TSMC Annual Filings, ASML Tech Whitepapers',
      characters: 'Dr. Lin (Industry Strategist)',
    },
    {
      id: 'history',
      name: 'History Documentaries',
      icon: History,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      currentProject: '1934 Central Banking Revolution',
      format: '30–45m Long-form Special',
      sources: 'Historical Archives, 4 Academic Treatises',
      characters: 'Archival Narrator + Period Keyframes',
    },
    {
      id: 'tech',
      name: 'AI & Robotics Tech',
      icon: Bot,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      currentProject: 'Autonomous Robotic Assembly Lines',
      format: 'Technical Illustrated Explainer',
      sources: 'ArXiv Papers, IEEE Robotics Standards',
      characters: 'Dr. Maya Lin (Robotics Lead)',
    },
    {
      id: 'anime',
      name: 'Anime & Series Universe',
      icon: Tv,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      currentProject: 'Chronicles of New Neo-Bengal (Ep 01)',
      format: 'Episodic Animated Series (24 FPS)',
      sources: 'World Bible, Outfit Locks, Lore Cache',
      characters: 'Kael, Maya, Commander Vane',
    },
  ];

  // The 10 Specialized Helper Apps Coordinated by Aurlex
  const helperApps = [
    {
      name: 'Google AI Studio',
      role: 'Cloud AI Reasoning & Synthesis',
      status: 'Connected',
      type: 'Cloud',
      desc: 'High-level architectural planning, script refinement, and research compression.',
    },
    {
      name: 'NotebookLM',
      role: 'Source-Grounded Research',
      status: 'Ready',
      type: 'Hybrid',
      desc: 'PDF and book ingestion; eliminates factual hallucinations via grounded citations.',
    },
    {
      name: 'Ollama + Llama 3',
      role: 'Local Offline Scriptwriting',
      status: telemetry.localOllamaConnected ? 'Connected' : 'Local Ready',
      type: 'Local',
      desc: 'Zero-cost offline beat generation, motion scheduling, and narration drafting.',
    },
    {
      name: 'ComfyUI + AnimateDiff',
      role: 'Visual Synthesis & Motion',
      status: telemetry.localComfyConnected ? 'Connected' : 'Local Ready',
      type: 'Local',
      desc: 'SD1.5 / SDXL checkpoint loading and AnimateDiff temporal continuous motion.',
    },
    {
      name: 'FFmpeg',
      role: 'Media Assembly & Multiplexing',
      status: 'Active (v6.1.1)',
      type: 'Local',
      desc: 'Lossless audio ducking, subtitle hardcoding, and granular scene replacement.',
    },
    {
      name: 'ImageMagick',
      role: 'Image Pre-processing & Slicing',
      status: 'Ready',
      type: 'Local',
      desc: 'Asset normalization, character turnaround slicing, and alpha channel masking.',
    },
    {
      name: 'yt-dlp',
      role: 'Permitted Reference Ingestion',
      status: 'Ready',
      type: 'Local',
      desc: 'Ingesting reference video pacing, camera angles, and aesthetic moodboards.',
    },
    {
      name: 'Index-TTS / Edge-TTS',
      role: 'Expressive Voice & Dialogue',
      status: 'Active',
      type: 'Local',
      desc: 'Character-distinct voice synthesis with precise word-level phoneme timing.',
    },
    {
      name: 'Cursor / VS Code',
      role: 'Studio Engineering & Core Code',
      status: 'Integrated',
      type: 'Tooling',
      desc: 'Local development environment powering the Aurlex Studio software stack.',
    },
    {
      name: 'GitHub Desktop / Jules',
      role: 'Version Control & Agent Assistance',
      status: 'Tracking',
      type: 'Tooling',
      desc: 'Automated branch tracking, model prompt versioning, and code maintenance.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Overview & Primary Focus */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
              Personal Production Studio & Orchestrator
            </span>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => setShowPhilosophyModal(true)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors underline underline-offset-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>The “Why” Behind Aurlex</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
            <span>Series: {project.series}</span>
            <span aria-hidden="true">·</span>
            <span>Episode {project.episodeNumber.toString().padStart(2, '0')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{project.durationTargetSec}s runtime</span>
            <span aria-hidden="true">·</span>
            <span>Format: {project.format}</span>
            <span aria-hidden="true">·</span>
            <span>Style: {project.style}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('animation')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            Motion Engine →
          </button>
          <button
            onClick={onTriggerRender}
            disabled={isRendering}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isRendering ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Render Master MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards: System Health & Pipeline Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPU VRAM Telemetry */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Local GPU VRAM</span>
            <span className="font-mono tabular-nums text-emerald-400">GTX 1650</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {telemetry.gpu.usedVramGb} <span className="text-sm font-normal text-slate-400">/ {telemetry.gpu.totalVramGb} GB</span>
            </span>
            <span className="text-xs font-mono font-semibold tabular-nums text-amber-400">{telemetry.gpu.vramPercent}%</span>
          </div>
          {/* VRAM bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                telemetry.gpu.vramPercent > 85 ? 'bg-rose-500' : telemetry.gpu.vramPercent > 65 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${telemetry.gpu.vramPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Temp: {telemetry.gpu.temperatureC}°C</span>
            <span>--lowvram active</span>
          </div>
        </div>

        {/* System Compute Load */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Host Compute Load</span>
            <span className="font-mono text-slate-400">6 Cores</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {telemetry.cpu.utilizationPercent}% <span className="text-sm font-normal text-slate-400">CPU</span>
            </span>
            <span className="text-xs font-mono tabular-nums text-slate-400">RAM {telemetry.ram.usedGb}/{telemetry.ram.totalGb} GB</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${telemetry.cpu.utilizationPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>RAM Load: {telemetry.ram.percent}%</span>
            <span>Zero Memory Leaks</span>
          </div>
        </div>

        {/* Local Autonomy State */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Platform Independence</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">HYBRID MODE</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
              <span className="text-slate-400">ComfyUI</span>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">LOCAL</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
              <span className="text-slate-400">Ollama</span>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">LOCAL</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
              <span className="text-slate-400">FFmpeg</span>
              <span className="text-emerald-400 font-mono text-[10px] font-semibold">LOCAL</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
              <span className="text-slate-400">Gemini</span>
              <span className="text-amber-400 font-mono text-[10px] font-semibold">CLOUD</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Orchestration Layer</span>
            <span className="text-slate-300 font-mono text-[10px]">Zero Vendor Lock-in</span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Quality & Anti-Slideshow Gate</span>
            <button 
              onClick={() => onNavigateTab('verification')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              Audit
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {verifiedScenesCount} / {scenes.length}
            </div>
            {flaggedScenesCount > 0 ? (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {flaggedScenesCount} static alert
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-400">All Passed</span>
            )}
          </div>
          <div className="text-xs text-slate-400">
            {flaggedScenesCount > 0 ? (
              <span className="text-rose-300">Optical flow check flagged static frames.</span>
            ) : (
              <span>100% continuous temporal motion verified.</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. The Grand Production Pipeline Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              The Aurlex Orchestration Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              Idea → Research → Knowledge → Story → Characters → Scenes → Animation → Voice → Editing → Verification → Final Video
            </p>
          </div>
          <div className="text-xs font-mono text-amber-400">
            Status: {isRendering ? 'Rendering Scene 04 frames...' : 'Animation Phase in Progress (62%)'}
          </div>
        </div>

        {/* Visual Flow Schematic Map */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto text-[11px] font-mono text-slate-400 flex items-center gap-2 scrollbar-none">
          <span className="text-amber-400 font-bold shrink-0">IDEA</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">RESEARCH (NotebookLM)</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">KNOWLEDGE BRAIN</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">SCRIPT (Llama/Gemini)</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">CHARACTERS (Locks)</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">SCENE DIRECTOR</span>
          <span>→</span>
          <span className="text-amber-300 font-bold shrink-0">ANIMATION (AnimateDiff)</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">VOICE (Index-TTS)</span>
          <span>→</span>
          <span className="text-slate-200 shrink-0">EDITING (FFmpeg)</span>
          <span>→</span>
          <span className="text-emerald-400 font-bold shrink-0">VERIFICATION QA</span>
          <span>→</span>
          <span className="text-white font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">FINAL MASTER MP4</span>
        </div>

        {/* Stage Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stages.map((stage, idx) => {
            const stageProgress = project.progress[stage.id];
            const isComplete = stageProgress.status === 'complete';
            const isInProgress = stageProgress.status === 'in_progress';
            
            return (
              <button
                key={stage.id}
                onClick={() => onNavigateTab(stage.targetTab)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isComplete
                    ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400'
                    : isInProgress
                    ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>{(idx + 1).toString().padStart(2, '0')}</span>
                    {isComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isInProgress ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </div>
                  <div className={`text-xs font-semibold ${isComplete ? 'text-slate-200' : isInProgress ? 'text-amber-300' : 'text-slate-400'}`}>
                    {stage.label}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className={isComplete ? 'text-emerald-400' : isInProgress ? 'text-amber-400' : 'text-slate-600'}>
                    {isComplete ? 'Done' : isInProgress ? `${stageProgress.percent}%` : 'Pending'}
                  </span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. The 5 Production Verticals / Franchise Ecosystem */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Production Infrastructure: 5 Content Verticals
            </h3>
            <p className="text-xs text-slate-400">
              Aurlex powers a multi-franchise studio spanning education, documentaries, and episodic anime universes.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('series')}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Series</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isCur = project.series.toLowerCase().includes(ch.id) || (ch.id === 'finance' && project.series.includes('Finance'));
            return (
              <div
                key={ch.id}
                onClick={() => onNavigateTab('series')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                  isCur 
                    ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-1.5 rounded-lg ${ch.bgColor} ${ch.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    {isCur && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white">{ch.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {ch.currentProject}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-500">
                  <div className="text-slate-400 truncate">Format: {ch.format}</div>
                  <div className="text-slate-500 truncate">Character: {ch.characters}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Helper Apps Orchestration Matrix (The 10 Tools Coordinated by Aurlex) */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Specialized Helper Apps Orchestrator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Aurlex coordinates 10 specialized tools so you never copy-paste between disconnected websites.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">10 Specialized Nodes Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {helperApps.map((app, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-white">{app.name}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    app.type === 'Local' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {app.type}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-amber-400/90">{app.role}</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">{app.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-semibold">{app.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Active Scene Worktable Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">Scene Production Queue</h3>
            <p className="text-xs text-slate-400">Granular per-scene state, continuous motion status, and verification.</p>
          </div>
          <button
            onClick={() => onNavigateTab('script')}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Open Scene Director</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenes.map((scene) => {
            const isRendered = scene.renderStatus.animation === 'rendered';
            const isRenderingScene = scene.renderStatus.animation === 'rendering';

            return (
              <div
                key={scene.id}
                className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                {/* Scene thumbnail plate */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                  <img
                    src={scene.imagePath}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Scene metadata overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono text-white font-semibold">
                      Scene {scene.sceneNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      {scene.durationSec.toFixed(1)}s
                    </span>
                  </div>

                  {/* Verification badge */}
                  <div className="absolute top-2.5 right-2.5">
                    {scene.verification.passed ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                        MOTION DETECTED ✓
                      </span>
                    ) : isRenderingScene ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                        GENERATING FRAMES...
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">
                        STATIC DETECTED ❌
                      </span>
                    )}
                  </div>
                </div>

                {/* Scene content body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-white leading-tight">
                      {scene.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 italic">
                      "{scene.dialogue}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Action:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">{scene.action}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Temporal Motion:</span>
                      <span className="font-mono tabular-nums text-slate-300">
                        {(scene.verification.temporalMotionScore * 100).toFixed(0)}% optical flow
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onNavigateTab('preview')}
                      className="flex-1 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-center"
                    >
                      Preview Scene
                    </button>
                    <button
                      onClick={() => onNavigateTab('animation')}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
                      title="Adjust AnimateDiff Motion Spec"
                    >
                      Motion
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Philosophy & Vision Modal */}
      {showPhilosophyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-xl font-bold text-white font-display">The “Why” Behind Aurlex Studio</h3>
                  <p className="text-xs text-slate-400">The founding philosophy and production architecture</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPhilosophyModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 space-y-2">
                <div className="font-bold text-sm text-white">The Core Problem: AI Tool Fragmentation</div>
                <p>
                  Today, making a serious educational documentary, animated story, or anime episode requires juggling 10 disconnected websites:
                  research in one tool, write in another, generate images in a third, animate elsewhere, voice in another, edit in another, and manually verify. Every transfer causes lost context, drifting characters, and repeated work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">1. Idea → Finished Master Media</div>
                  <p className="text-slate-400">
                    Input a topic like "Explain India's banking liquidity system" and Aurlex executes the full coordinated chain: Research → Script → Storyboard → Scenes → Characters → Animation → Voice → Music → Subtitles → QA.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">2. Your Own Production Infrastructure</div>
                  <p className="text-slate-400">
                    Built to power 5 serious verticals: Finance, Business, History, AI & Robotics, and Anime Universes. You own the workflow, assets, and knowledge permanently.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">3. Independence from AI Platforms</div>
                  <p className="text-slate-400">
                    When cloud models change pricing, APIs, or limits, Aurlex remains unaffected by anchoring to local AI: Ollama (Llama), ComfyUI (AnimateDiff), and local FFmpeg media tools.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">4. Persistent Knowledge Library</div>
                  <p className="text-slate-400">
                    Books, PDFs, and historical documents become permanent indexed assets that power 10-minute explainers, 45-minute specials, and recurring episodes without re-researching.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">5. Genuinely Animated Content</div>
                  <p className="text-slate-400">
                    Zero slideshow anti-pattern. Characters walk, talk, point, react, and turn with camera dynamics. The Optical Flow Gate checks motion vectors (&ge; 65%) to block static renders.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-sm">6. Human Control & Granular Replacement</div>
                  <p className="text-slate-400">
                    If Scene 13 needs a change, replace Scene 13 only. Keep the voice and re-render motion, or upload custom footage without throwing away the entire 10-minute video.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white">The Long-Term Vision</div>
                <p className="text-slate-400">
                  "Give Aurlex a subject, source material, creative direction, and desired format; Aurlex researches it, understands it, plans it, creates it, produces it, checks it, and delivers a verified finished piece of media."
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPhilosophyModal(false)}
                className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Close Manifesto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
