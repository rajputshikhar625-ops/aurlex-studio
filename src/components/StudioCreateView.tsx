import React, { useState } from 'react';
import { 
  Sparkles, 
  Film, 
  Layers, 
  Clock, 
  Globe, 
  Cpu, 
  Server, 
  User, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { ProjectData, CharacterItem, VideoFormat } from '../types';

interface StudioCreateViewProps {
  onStartProduction: (project: ProjectData) => void;
  characters: CharacterItem[];
  onNavigateTab: (tab: string) => void;
}

export const StudioCreateView: React.FC<StudioCreateViewProps> = ({
  onStartProduction,
  characters,
  onNavigateTab,
}) => {
  const [topic, setTopic] = useState('Why Central Banks Use Overnight Reverse Repo');
  const [series, setSeries] = useState('Finance Explained');
  const [niche, setNiche] = useState<'Finance' | 'Business' | 'History' | 'AI & Technology' | 'Anime/Narrative'>('Finance');
  const [durationSec, setDurationSec] = useState<number>(35.0);
  const [format, setFormat] = useState<VideoFormat>('16:9');
  const [style, setStyle] = useState('2D Illustrated Editorial');
  const [language, setLanguage] = useState('English');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(characters[0]?.id || 'CHAR_001');
  const [productionMode, setProductionMode] = useState<'local' | 'cloud'>('local');
  const [sourcePdfs, setSourcePdfs] = useState('RBI Monetary Policy Framework 2026, LAF Operating Guidelines');

  const handleCreate = () => {
    if (!topic.trim()) return;
    const newProj: ProjectData = {
      id: `PROJ-${Date.now().toString().slice(-4)}`,
      title: topic,
      series: series,
      episodeNumber: 1,
      durationTargetSec: durationSec,
      format: format,
      style: style,
      language: language,
      progress: {
        research: { status: 'complete', percent: 100 },
        story: { status: 'in_progress', percent: 50 },
        characters: { status: 'complete', percent: 100 },
        scenes: { status: 'pending', percent: 15 },
        animation: { status: 'pending', percent: 0 },
        audio: { status: 'pending', percent: 0 },
        editing: { status: 'pending', percent: 0 },
        verification: { status: 'pending', percent: 0 },
      },
    };
    onStartProduction(newProj);
    onNavigateTab('script');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
          Pillar 02 · Studio / Create
        </div>
        <h2 className="text-2xl font-bold text-white font-display">
          New Video Production Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure production parameters before delegating tasks to NotebookLM, Llama/Gemini, and ComfyUI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Production Specs */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Video Topic / Core Premise
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why Central Banks Use Overnight Reverse Repo"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            {/* Series & Niche */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Series Canon</label>
                <input
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Niche Category</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Finance">Finance & Banking</option>
                  <option value="Business">Business & Corporate Strategy</option>
                  <option value="AI & Technology">AI, Robotics & Hardware</option>
                  <option value="History">Economic & Global History</option>
                  <option value="Anime/Narrative">Anime / Narrative Explainer</option>
                </select>
              </div>
            </div>

            {/* Target Duration & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Target Duration</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">{durationSec.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={durationSec}
                  onChange={(e) => setDurationSec(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>15s Short</span>
                  <span>45s Standard</span>
                  <span>120s Deep</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['16:9', '9:16', '1:1'] as VideoFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 text-xs font-mono font-semibold rounded-lg border cursor-pointer transition-colors ${
                        format === fmt
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Style & Primary Character Anchor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Illustration Art Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="2D Illustrated Editorial">2D Illustrated Editorial (Vox/Bloomberg style)</option>
                  <option value="Anime-Inspired Vector">Anime-Inspired Vector (Clean Lineart)</option>
                  <option value="3D Hybrid Technical">3D/Hybrid Technical Isometric</option>
                  <option value="Archival Documentary">Archival Documentary Engraving</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lead Anchor Character</label>
                <select
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) — {c.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Knowledge Sources attached */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <label className="text-xs font-semibold text-slate-300">
                Attached Knowledge Base Sources
              </label>
              <input
                type="text"
                value={sourcePdfs}
                onChange={(e) => setSourcePdfs(e.target.value)}
                placeholder="e.g. RBI Monetary Policy Framework 2026, Textbook Chapter 4"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Summary & Launch Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white font-display">
              Execution Architecture
            </h3>

            {/* Execution Mode */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Render Environment</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setProductionMode('local')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                    productionMode === 'local'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Local ComfyUI</div>
                  <div className="text-[10px] text-slate-500">GTX 1650 4GB GPU</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProductionMode('cloud')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                    productionMode === 'cloud'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Cloud Cluster</div>
                  <div className="text-[10px] text-slate-500">Colab / RunPod A100</div>
                </button>
              </div>
            </div>

            {/* Pipeline Preview */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
              <div className="flex justify-between">
                <span>Director Agent:</span>
                <span className="text-white">Llama 3.3 / Gemini</span>
              </div>
              <div className="flex justify-between">
                <span>Motion Engine:</span>
                <span className="text-white">AnimateDiff Evolved v3</span>
              </div>
              <div className="flex justify-between">
                <span>Voice Model:</span>
                <span className="text-white">Index-TTS Studio Male</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Gate:</span>
                <span className="text-emerald-400 font-bold">&gt;0.65 Optical Flow</span>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-3 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Initialize Production Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
