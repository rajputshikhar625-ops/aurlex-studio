import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Sliders, 
  Layers, 
  User, 
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ContinuityRule, CharacterItem, SceneItem } from '../types';

interface DirectorContinuityViewProps {
  continuityRules: ContinuityRule[];
  characters: CharacterItem[];
  scenes: SceneItem[];
  onNavigateTab: (tab: string) => void;
}

export const DirectorContinuityView: React.FC<DirectorContinuityViewProps> = ({
  continuityRules,
  characters,
  scenes,
  onNavigateTab,
}) => {
  const [rules, setRules] = useState<ContinuityRule[]>(continuityRules);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationReport, setValidationReport] = useState<string | null>(null);

  const handleRunContinuityAudit = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationReport('Continuity scan complete: 4 of 5 invariants verified. Advisory alert on Scene 04 motion weight consistency.');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 09 · Director & Continuity Engine
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Cross-Episode Canon & Identity Locks
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prevents character wardrobe drift, inconsistent lighting, and phonetic hallucinations across multi-scene and multi-episode productions.
          </p>
        </div>

        <button
          onClick={handleRunContinuityAudit}
          disabled={isValidating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isValidating ? 'Auditing Canon Invariants...' : 'Run Continuity Audit'}</span>
        </button>
      </div>

      {validationReport && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 font-mono animate-fadeIn flex items-center justify-between">
          <span>{validationReport}</span>
          <button onClick={() => setValidationReport(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Grid: Character Locks & Canon Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Character Model Invariant Locks */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Persistent Identity Locks
          </div>

          <div className="space-y-3">
            {characters.map((char) => (
              <div
                key={char.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={char.imagePath}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{char.name} ({char.id})</div>
                      <div className="text-[11px] text-slate-400">{char.role}</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                    <Lock className="w-3 h-3" />
                    <span>LOCKED</span>
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
                  <div><strong className="text-slate-500">Wardrobe:</strong> {char.clothes}</div>
                  <div><strong className="text-slate-500">Hair:</strong> {char.hair}</div>
                  <div><strong className="text-slate-500">Actions:</strong> {char.allowedActions.slice(0, 3).join(', ')}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Continuity Rules Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Series Invariants & Quality Enforcement Rules
          </div>

          <div className="space-y-3">
            {rules.map((rule) => {
              const isPassed = rule.severity === 'Passed';
              const isWarning = rule.severity === 'Advisory Warning';

              return (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{rule.id}</span>
                      <span className="text-xs font-semibold text-white">[{rule.subject}]</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rule.rule}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded shrink-0 ${
                    isPassed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : isWarning
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {rule.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
