import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Film, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Maximize2
} from 'lucide-react';
import { SceneItem, CharacterItem, VideoFormat } from '../types';

interface VideoPreviewViewProps {
  scenes: SceneItem[];
  characters: CharacterItem[];
  activeFormat: VideoFormat;
  onChangeFormat: (format: VideoFormat) => void;
  onUpdateScene: (scene: SceneItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const VideoPreviewView: React.FC<VideoPreviewViewProps> = ({
  scenes,
  characters,
  activeFormat,
  onChangeFormat,
  onUpdateScene,
  onNavigateTab,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [savedComputeMessage, setSavedComputeMessage] = useState<string | null>(null);

  const activeScene = scenes[activeSceneIndex] || scenes[0];
  const activeChar = characters.find((c) => c.id === activeScene.characterId);
  const totalEpisodeDuration = scenes.reduce((acc, s) => acc + s.durationSec, 0);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= activeScene.durationSec) {
            // Auto advance to next scene or loop
            if (activeSceneIndex < scenes.length - 1) {
              setActiveSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeScene.durationSec, activeSceneIndex, scenes.length]);

  // Granular Regeneration Handlers (Saves compute!)
  const handleRegenerateSelective = (type: 'motion' | 'voice' | 'background' | 'all') => {
    setIsRegenerating(type);
    setSavedComputeMessage(null);

    setTimeout(() => {
      setIsRegenerating(null);
      let updated = { ...activeScene };

      if (type === 'motion') {
        updated.verification = {
          ...updated.verification,
          passed: true,
          temporalMotionScore: 0.94,
          motionVerdict: 'MOTION DETECTED ✓',
        };
        updated.renderStatus.animation = 'rendered';
        setSavedComputeMessage('Selective Motion regeneration completed! Saved 82% GPU compute by keeping existing background & voice assets.');
      } else if (type === 'voice') {
        updated.renderStatus.audio = 'rendered';
        setSavedComputeMessage('Voice track re-synthesized in 1.4s! Zero video rendering was needed.');
      } else if (type === 'background') {
        setSavedComputeMessage('Background plate updated while preserving character pose and audio tracks.');
      } else {
        updated.verification.passed = true;
        updated.renderStatus.composite = 'ready';
        setSavedComputeMessage('Full scene composite rendered.');
      }

      onUpdateScene(updated);
      setTimeout(() => setSavedComputeMessage(null), 6000);
    }, 1800);
  };

  const getContainerAspectStyle = () => {
    if (activeFormat === '9:16') return 'aspect-[9/16] max-w-[340px]';
    if (activeFormat === '1:1') return 'aspect-square max-w-[500px]';
    return 'aspect-video max-w-full';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Aspect Ratio Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Production Stage 07 · Video Preview & Asset Studio
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Selective Asset Studio & Video Player
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Never re-render the whole episode for a single bad scene. Regenerate motion only, voice only, or background only to save massive compute.
          </p>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(['16:9', '9:16', '1:1'] as VideoFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onChangeFormat(fmt)}
              className={`px-3 py-1.5 font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                activeFormat === fmt
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt === '16:9' ? '16:9 YouTube' : fmt === '9:16' ? '9:16 Shorts' : '1:1 Square'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Display: Monitor & Selective Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Video Monitor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-center bg-slate-950/80 rounded-2xl p-4 sm:p-6 border border-slate-800">
            <div className={`relative w-full ${getContainerAspectStyle()} rounded-xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800/90 flex flex-col justify-between`}>
              <img
                src={activeScene.imagePath}
                alt={activeScene.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Bar overlay */}
              <div className="relative z-10 p-3 flex items-center justify-between text-xs">
                <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-white font-semibold">
                  Scene 0{activeScene.sceneNumber} · {activeScene.title}
                </span>
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                  activeScene.verification.passed ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
                }`}>
                  {activeScene.verification.motionVerdict}
                </span>
              </div>

              {/* Character Watermark / ID */}
              <div className="relative z-10 p-4 text-center space-y-2">
                {/* Real-time Subtitle Overlay */}
                <div className="max-w-md mx-auto px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-lg">
                  "{activeScene.dialogue}"
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-amber-400">
                  <span>{activeChar?.name} ({activeScene.characterId})</span>
                  <span>·</span>
                  <span>Camera: {activeScene.camera}</span>
                </div>
              </div>

              {/* Transport Controls overlay */}
              <div className="relative z-10 p-3 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <button
                    onClick={() => setCurrentTimeSec(0)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="text-slate-200 tabular-nums">
                    {currentTimeSec.toFixed(1)}s / {activeScene.durationSec.toFixed(1)}s
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {activeFormat} Master Output
                </div>
              </div>
            </div>
          </div>

          {/* Episode Scene Scrubber Track */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Timeline Scene Continuity</span>
              <span className="font-mono text-slate-400">
                Scene {activeSceneIndex + 1} of {scenes.length}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {scenes.map((scene, idx) => {
                const isCurrent = idx === activeSceneIndex;
                const isVerified = scene.verification.passed;
                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setActiveSceneIndex(idx);
                      setCurrentTimeSec(0);
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span>0{scene.sceneNumber}</span>
                      <span className={isVerified ? 'text-emerald-400' : 'text-rose-400'}>
                        {isVerified ? '✓' : '⚠️'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {scene.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Granular Selective Regeneration Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Granular Scene Regeneration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Target the exact defective layer rather than burning VRAM regenerating unchanged assets.
              </p>
            </div>

            {/* Compute Notification */}
            {savedComputeMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compute Saved</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-200">
                  {savedComputeMessage}
                </p>
              </div>
            )}

            {/* Action 1: Regenerate Motion Only */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Regenerate Motion Only</span>
                <span className="text-[10px] font-mono text-amber-400">~12s / 2.6GB VRAM</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fixes static poses or unnatural temporal flow. Keeps background plate and voice audio intact.
              </p>
              <button
                onClick={() => handleRegenerateSelective('motion')}
                disabled={isRegenerating !== null}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegenerating === 'motion' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Re-calculating AnimateDiff Poses...</span>
                  </>
                ) : (
                  <span>Regenerate Motion</span>
                )}
              </button>
            </div>

            {/* Action 2: Regenerate Voice Only */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Regenerate Voice Only</span>
                <span className="text-[10px] font-mono text-emerald-400">~1.5s / Zero GPU load</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adjusts narration speed, pitch, or pronunciation without touching any animation frames.
              </p>
              <button
                onClick={() => handleRegenerateSelective('voice')}
                disabled={isRegenerating !== null}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegenerating === 'voice' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Voice Track...</span>
                  </>
                ) : (
                  <span>Regenerate Voice</span>
                )}
              </button>
            </div>

            {/* Action 3: Regenerate Background Only */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Regenerate Background Only</span>
                <span className="text-[10px] font-mono text-slate-400">~6s / 1.8GB VRAM</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Refreshes environment art while preserving character pose coordinates and dialogue timing.
              </p>
              <button
                onClick={() => handleRegenerateSelective('background')}
                disabled={isRegenerating !== null}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRegenerating === 'background' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering New Plate...</span>
                  </>
                ) : (
                  <span>Regenerate Background</span>
                )}
              </button>
            </div>

            {/* Full Scene */}
            <button
              onClick={() => handleRegenerateSelective('all')}
              disabled={isRegenerating !== null}
              className="w-full py-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Full Scene Composite Re-render
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
