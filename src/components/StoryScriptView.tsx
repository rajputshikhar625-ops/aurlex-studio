import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Camera, 
  User, 
  MapPin, 
  Sun, 
  Layers, 
  Volume2, 
  Plus, 
  Check, 
  Save, 
  RefreshCw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { SceneItem, CharacterItem } from '../types';

interface StoryScriptViewProps {
  scenes: SceneItem[];
  characters: CharacterItem[];
  onUpdateScene: (updatedScene: SceneItem) => void;
  onAddScene: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StoryScriptView: React.FC<StoryScriptViewProps> = ({
  scenes,
  characters,
  onUpdateScene,
  onAddScene,
  onNavigateTab,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || 'SCENE_01');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  const activeScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const handleFieldChange = (field: keyof SceneItem, value: any) => {
    if (!activeScene) return;
    const updated = { ...activeScene, [field]: value };
    onUpdateScene(updated);
  };

  const handleGenerateAiScene = async () => {
    setIsAiGenerating(true);
    setAiStatusMessage('AI Director consulting Knowledge Library & Character Bible...');
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt || `Provide a production script scene for Arjun explaining bank liquidity reserve ratios with camera direction, continuous action, and dialogue.`,
          systemInstruction: 'You are the Aurlex AI Director. Output structured scene production instructions with Duration, Character, Action, Camera, Dialogue, and MotionSpec.',
          taskType: 'script',
        }),
      });
      const data = await response.json();
      if (data.text) {
        // Parse or apply to active scene dialogue or action
        handleFieldChange('dialogue', activeScene.dialogue + ` [AI Update: ${data.text.slice(0, 120)}...]`);
        setAiStatusMessage('AI Director integrated production notes into script data.');
      }
    } catch (err: any) {
      console.error(err);
      setAiStatusMessage('Generated offline script recommendations.');
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => setAiStatusMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Production Stage 04 · Story & Scene Director
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Scene Director & Production Script
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Converts research facts into production-ready script data, camera choreography, and continuous motion specifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('animation')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            Send to Animation Engine →
          </button>
          <button
            onClick={onAddScene}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Scene Selector Sidebar + Scene Director Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scene List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Scenes Sequence ({scenes.length})</span>
            <span className="font-mono text-slate-400">
              Total: {scenes.reduce((acc, s) => acc + s.durationSec, 0).toFixed(1)}s
            </span>
          </div>

          <div className="space-y-2">
            {scenes.map((scene) => {
              const isSelected = scene.id === selectedSceneId;
              const char = characters.find((c) => c.id === scene.characterId);

              return (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      SCENE {scene.sceneNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {scene.durationSec.toFixed(1)}s
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 truncate">
                    {scene.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 truncate mt-1 italic">
                    "{scene.dialogue}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/60 font-mono">
                    <span className="text-slate-400 truncate max-w-[130px]">
                      {char?.name || scene.characterId}
                    </span>
                    <span className={scene.verification.passed ? 'text-emerald-400' : 'text-slate-500'}>
                      {scene.verification.passed ? '✓ Motion Verified' : 'Draft / Unverified'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Director Script Polish Box */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 mt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Director Beat Writer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ask AI Director to refine character action beats, sharpen dialogue timing, or generate transitional camera movements.
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Make Scene 3 action more visual by having Arjun interact with an illuminated bond certificate..."
              className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/80 resize-none h-20"
            />
            <button
              onClick={handleGenerateAiScene}
              disabled={isAiGenerating}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Scene Beats...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Director</span>
                </>
              )}
            </button>
            {aiStatusMessage && (
              <div className="text-[11px] text-emerald-400 font-mono pt-1">
                {aiStatusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scene Director Inspector */}
        <div className="lg:col-span-8 space-y-5">
          {activeScene ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
              {/* Scene Director Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold">
                    <span>SCENE {activeScene.sceneNumber.toString().padStart(2, '0')}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300">{activeScene.id}</span>
                  </div>
                  <input
                    type="text"
                    value={activeScene.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="mt-1 text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400">Duration:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={activeScene.durationSec}
                      onChange={(e) => handleFieldChange('durationSec', parseFloat(e.target.value) || 1)}
                      className="w-12 bg-transparent text-white font-bold focus:outline-none tabular-nums"
                    />
                    <span className="text-slate-500">sec</span>
                  </div>
                </div>
              </div>

              {/* Core Script Dialogue */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Spoken Dialogue (TTS / Voice)</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {(activeScene.durationSec * 2.8).toFixed(0)} words estimated
                  </span>
                </label>
                <textarea
                  value={activeScene.dialogue}
                  onChange={(e) => handleFieldChange('dialogue', e.target.value)}
                  rows={3}
                  className="w-full text-xs leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/80 transition-colors"
                />
              </div>

              {/* Character & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Character Visual ID</span>
                  </label>
                  <select
                    value={activeScene.characterId}
                    onChange={(e) => handleFieldChange('characterId', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80 cursor-pointer"
                  >
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.name} ({c.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                    <span>Camera Choreography</span>
                  </label>
                  <input
                    type="text"
                    value={activeScene.camera}
                    onChange={(e) => handleFieldChange('camera', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Physical Action & Continuous Motion Plan */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Director's Action Directive
                </label>
                <input
                  type="text"
                  value={activeScene.action}
                  onChange={(e) => handleFieldChange('action', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              {/* Environment, Lighting & Composition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Environment</span>
                  </label>
                  <textarea
                    rows={2}
                    value={activeScene.environment}
                    onChange={(e) => handleFieldChange('environment', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <Sun className="w-3 h-3" />
                    <span>Lighting Spec</span>
                  </label>
                  <textarea
                    rows={2}
                    value={activeScene.lighting}
                    onChange={(e) => handleFieldChange('lighting', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Composition & Transition</span>
                  </label>
                  <textarea
                    rows={2}
                    value={`${activeScene.composition} | ${activeScene.transition}`}
                    onChange={(e) => handleFieldChange('composition', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Continuous Motion Keyframes Breakdown */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Temporal MotionSpec (AnimateDiff Keyframes)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Coherent frame-to-frame poses to eliminate static repeating images.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('animation')}
                    className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer underline underline-offset-2"
                  >
                    Open Motion Visualizer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {activeScene.motionSpec.keyframes.map((kf, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-amber-400">
                        <span>{kf.timestampSec.toFixed(1)}s</span>
                        <span className="text-slate-500">Pose 0{i + 1}</span>
                      </div>
                      <div className="font-semibold text-slate-200 text-[11px]">
                        {kf.label}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2">
                        {kf.poseDescription}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800">
              Select or create a scene to inspect production script.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
