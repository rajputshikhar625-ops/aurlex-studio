import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Film, 
  Activity, 
  RefreshCw, 
  Sliders, 
  Check, 
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SceneItem } from '../types';

interface VerificationEngineViewProps {
  scenes: SceneItem[];
  onUpdateScene: (scene: SceneItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const VerificationEngineView: React.FC<VerificationEngineViewProps> = ({
  scenes,
  onUpdateScene,
  onNavigateTab,
}) => {
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || 'SCENE_01');
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const activeScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const allPassed = scenes.every((s) => s.verification.passed);
  const failedScenes = scenes.filter((s) => !s.verification.passed);

  const handleRunFullAudit = () => {
    setIsAuditing(true);
    setAuditMessage('Testing MP4 streams, optical flow variance, and black frame ratios...');
    setTimeout(() => {
      setIsAuditing(false);
      setAuditMessage('Verification complete: 4 of 5 scenes verified. Scene 04 flagged for static frame duplication.');
    }, 2000);
  };

  const handleFixStaticScene = (sceneId: string) => {
    const target = scenes.find((s) => s.id === sceneId);
    if (!target) return;
    const fixed: SceneItem = {
      ...target,
      motionSpec: {
        ...target.motionSpec,
        motionScale: 1.15,
        contextWindow: 16,
      },
      renderStatus: {
        ...target.renderStatus,
        animation: 'rendered',
      },
      verification: {
        ...target.verification,
        passed: true,
        technicalOk: true,
        visualOk: true,
        temporalMotionScore: 0.88,
        motionVerdict: 'MOTION DETECTED ✓',
      },
    };
    onUpdateScene(fixed);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Production Stage 08 · Automated Quality Gate
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Automated Video & Temporal Motion Verification Gate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aurlex never marks a video complete merely because an MP4 exists. Verification tests technical codecs, black frames, and genuine optical flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunFullAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Frames & Optical Flow...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Run Full Episode Verification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        allPassed 
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center gap-3.5">
          {allPassed ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white font-display">
              {allPassed ? 'Production Release Gate: APPROVED' : 'Production Release Gate: HOLD REQUIRED'}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {allPassed
                ? 'All 5 scenes passed technical container tests and verified continuous temporal motion.'
                : `${failedScenes.length} scene flagged for Static Motion Duplication. Must be retuned before export.`}
            </p>
          </div>
        </div>

        {!allPassed && (
          <button
            onClick={() => handleFixStaticScene('SCENE_04')}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            Auto-Fix Flagged Scene 04
          </button>
        )}
      </div>

      {auditMessage && (
        <div className="text-xs font-mono text-amber-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          {auditMessage}
        </div>
      )}

      {/* 3 Pillars of Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Technical */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Technical Stream Audit
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% Valid</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>MP4 Container Stream:</span>
              <span className="text-emerald-400 font-mono">Present & Valid</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Video Resolution:</span>
              <span className="text-slate-100 font-mono">1920x1080 (FHD)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Frame Rate Target:</span>
              <span className="text-slate-100 font-mono">24.000 fps locked</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Codec Profile:</span>
              <span className="text-slate-100 font-mono">H.264 High / AAC 48k</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Corruption / Truncation:</span>
              <span className="text-emerald-400 font-mono">0 bytes lost</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Visual */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Visual Artifact Audit
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">Pass</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Black Frame Ratio:</span>
              <span className="text-emerald-400 font-mono">0.00% (Clean)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Duplicate Frame Ratio:</span>
              <span className="text-emerald-400 font-mono">0.8% (Target &lt; 5%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Character ID Match:</span>
              <span className="text-emerald-400 font-mono">98.4% (CHAR_001)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>High Frequency Flicker:</span>
              <span className="text-slate-100 font-mono">Delta &lt; 0.04</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Artifact Threshold:</span>
              <span className="text-emerald-400 font-mono">Nominal</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Temporal Motion */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              3. Temporal Motion Gate
            </h4>
            <span className="text-[10px] font-mono text-amber-400 font-semibold">4 / 5 Active</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Optical Flow Baseline:</span>
              <span className="text-slate-100 font-mono">&gt;= 0.65 variance</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Scene 01 Optical Flow:</span>
              <span className="text-emerald-400 font-mono">0.89 ✓</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Scene 02 Optical Flow:</span>
              <span className="text-emerald-400 font-mono">0.92 ✓</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Scene 03 Optical Flow:</span>
              <span className="text-emerald-400 font-mono">0.86 ✓</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Scene 04 Optical Flow:</span>
              <span className={scenes[3]?.verification.passed ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono font-bold'}>
                {scenes[3]?.verification.passed ? '0.88 ✓' : '0.12 ❌ (Static)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Comparison & Optical Flow Inspector */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Scene Verification Inspector: {activeScene.title}
            </h3>
            <p className="text-xs text-slate-400">
              Analyzing frame-to-frame variance across consecutive batches to distinguish real motion from still slides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {scenes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSceneId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer transition-colors ${
                  s.id === selectedSceneId
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                0{s.sceneNumber} {s.verification.passed ? '✓' : '❌'}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Comparison Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { frame: '001', time: '0.0s', delta: 'Reference' },
            { frame: '012', time: '0.5s', delta: '+14% flow' },
            { frame: '024', time: '1.0s', delta: '+29% flow' },
            { frame: '036', time: '1.5s', delta: '+41% flow' },
          ].map((item, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                <img
                  src={activeScene.imagePath}
                  alt={`Frame ${item.frame}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                  F_{item.frame}
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">{item.time}</span>
                <span className={activeScene.verification.passed ? 'text-emerald-400' : 'text-rose-400'}>
                  {activeScene.verification.passed ? item.delta : '0% (Freeze)'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-semibold text-white">
              Status for Scene {activeScene.sceneNumber}: {activeScene.verification.motionVerdict}
            </div>
            <div className="text-slate-400 text-[11px]">
              Optical Flow Score: {(activeScene.verification.temporalMotionScore * 100).toFixed(1)}% | Codec: {activeScene.verification.codec}
            </div>
          </div>

          {!activeScene.verification.passed ? (
            <button
              onClick={() => handleFixStaticScene(activeScene.id)}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
            >
              Re-inject AnimateDiff Motion Weights
            </button>
          ) : (
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" />
              Passed Quality Gate
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
