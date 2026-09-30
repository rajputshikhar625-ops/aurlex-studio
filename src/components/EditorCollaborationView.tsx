import React, { useState } from 'react';
import { 
  Scissors, 
  FileText, 
  Mic, 
  Film, 
  Music, 
  Subtitles, 
  ArrowUpDown, 
  Upload, 
  RotateCcw, 
  Check, 
  Play, 
  Pause,
  ArrowRight
} from 'lucide-react';
import { SceneItem, CharacterItem } from '../types';

interface EditorCollaborationViewProps {
  scenes: SceneItem[];
  characters: CharacterItem[];
  onUpdateScene: (scene: SceneItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const EditorCollaborationView: React.FC<EditorCollaborationViewProps> = ({
  scenes,
  characters,
  onUpdateScene,
  onNavigateTab,
}) => {
  const [activeSceneId, setActiveSceneId] = useState<string>(scenes[0]?.id || 'SCENE_01');
  const [editingTrack, setEditingTrack] = useState<'script' | 'voice' | 'video' | 'music' | 'subtitles'>('script');

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];
  const activeChar = characters.find((c) => c.id === activeScene.characterId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 11 · Editor & Collaboration Rack
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Scene-by-Scene Multitrack Replacement
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Surgically replace isolated layers: Script | Voice | Video | Music | Subtitles without triggering full re-renders.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('preview')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <span>Preview Final Composite →</span>
        </button>
      </div>

      {/* Multitrack Replacement Workspace */}
      <div className="space-y-4">
        {/* Scene Selection Rack */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {scenes.map((scene) => {
            const isSelected = scene.id === activeSceneId;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveSceneId(scene.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/80 text-amber-300 shadow'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                  <span>SCENE 0{scene.sceneNumber}</span>
                  <span>{scene.durationSec.toFixed(1)}s</span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate">{scene.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Scene Layer Rack */}
        {activeScene && (
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Scene 0{activeScene.sceneNumber}: {activeScene.title}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Character: {activeChar?.name} ({activeScene.characterId}) · Duration: {activeScene.durationSec}s
                </div>
              </div>

              {/* Layer Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                {(['script', 'voice', 'video', 'music', 'subtitles'] as const).map((track) => (
                  <button
                    key={track}
                    onClick={() => setEditingTrack(track)}
                    className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                      editingTrack === track
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            {/* Track 1: Script Layer */}
            {editingTrack === 'script' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Script Dialogue & Beat Content</span>
                  </span>
                  <span className="text-slate-500 font-mono">Edits auto-sync to Voice Engine</span>
                </div>
                <textarea
                  rows={4}
                  value={activeScene.dialogue}
                  onChange={(e) => onUpdateScene({ ...activeScene, dialogue: e.target.value })}
                  className="w-full text-xs leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Track 2: Voice Layer */}
            {editingTrack === 'voice' && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    <span>Voice Actor / TTS Stem</span>
                  </span>
                  <span className="text-emerald-400 font-mono">Index-TTS / Edge-TTS</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Assigned Voice:</span>
                    <span className="font-mono text-amber-300">{activeScene.audioSpec.ttsVoice}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Speed:</span>
                    <span className="font-mono text-white">{activeScene.audioSpec.speechSpeed}x</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('audio')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold cursor-pointer"
                  >
                    Open Voice Studio for Full Re-Synthesis →
                  </button>
                </div>
              </div>
            )}

            {/* Track 3: Video Layer */}
            {editingTrack === 'video' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Video Background & Character Animation Plate</span>
                  </span>
                  <button
                    onClick={() => onNavigateTab('animation')}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Open AnimateDiff Engine →
                  </button>
                </div>
                <div className="aspect-video max-w-md rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={activeScene.imagePath}
                    alt={activeScene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-[10px] font-mono text-white">
                    {activeScene.camera}
                  </div>
                </div>
              </div>
            )}

            {/* Track 4: Music Layer */}
            {editingTrack === 'music' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ambient Music Track & Level</span>
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-mono">{activeScene.audioSpec.bgmTrack}</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      {(activeScene.audioSpec.bgmVolume * 100).toFixed(0)}% Vol
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Track 5: Subtitles Layer */}
            {editingTrack === 'subtitles' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Subtitles className="w-3.5 h-3.5 text-amber-400" />
                  <span>faster-whisper Subtitle Display</span>
                </span>
                <input
                  type="text"
                  value={activeScene.audioSpec.subtitlesText}
                  onChange={(e) => {
                    const updated = {
                      ...activeScene,
                      audioSpec: { ...activeScene.audioSpec, subtitlesText: e.target.value },
                    };
                    onUpdateScene(updated);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
