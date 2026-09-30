import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  Clock, 
  Palette, 
  Camera, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { ReferenceVideoItem } from '../types';

interface ReferenceStudioViewProps {
  referenceItems: ReferenceVideoItem[];
  onApplyReferenceToScene: (refItem: ReferenceVideoItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const ReferenceStudioView: React.FC<ReferenceStudioViewProps> = ({
  referenceItems,
  onApplyReferenceToScene,
  onNavigateTab,
}) => {
  const [selectedRefId, setSelectedRefId] = useState<string>(referenceItems[0]?.id || 'REF-01');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const activeRef = referenceItems.find((r) => r.id === selectedRefId) || referenceItems[0];

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 15 · Reference Studio
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Aesthetic Benchmarking & Pacing Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze reference videos to extract camera choreography, cut pacing, and color harmonies without infringing copyrighted IP.
          </p>
        </div>

        <button
          onClick={() => {
            onApplyReferenceToScene(activeRef);
            onNavigateTab('animation');
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <span>Apply Style Invariants to Animation →</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Benchmarks */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Indexed Benchmarks ({referenceItems.length})
          </div>

          <div className="space-y-2.5">
            {referenceItems.map((ref) => {
              const isSelected = ref.id === selectedRefId;
              return (
                <div
                  key={ref.id}
                  onClick={() => setSelectedRefId(ref.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{ref.id}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ref.pacingCutsPerMin} cuts/min
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {ref.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ref.sourceCategory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Extracted Metrics */}
        <div className="lg:col-span-8">
          {activeRef ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {activeRef.name}
                  </h3>
                  <div className="text-xs text-slate-400">{activeRef.sourceCategory}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Pacing Benchmark</div>
                  <div className="text-base font-bold text-amber-400">
                    {activeRef.pacingCutsPerMin} Cuts / Min
                  </div>
                </div>
              </div>

              {/* Pacing, Camera, Style Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Camera Language & Movement</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{activeRef.cameraLanguage}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Animation & Temporal Motion</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{activeRef.animationApproach}</p>
                </div>
              </div>

              {/* Color Palette Swatch */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Extracted Harmonious Color Palette</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {activeRef.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shadow"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-xs text-slate-300">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompt Token Generator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Synthesized ComfyUI Prompt Invariant:</span>
                  <button
                    onClick={() => handleCopyPrompt(activeRef.extractedPromptHints)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt Hints'}</span>
                  </button>
                </div>
                <code className="block text-[11px] text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  {activeRef.extractedPromptHints}
                </code>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
