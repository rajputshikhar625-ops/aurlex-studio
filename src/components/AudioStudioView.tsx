import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  Music, 
  FileText, 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SceneItem, CharacterItem } from '../types';

interface AudioStudioViewProps {
  scenes: SceneItem[];
  characters: CharacterItem[];
  onUpdateScene: (scene: SceneItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const AudioStudioView: React.FC<AudioStudioViewProps> = ({
  scenes,
  characters,
  onUpdateScene,
  onNavigateTab,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || 'SCENE_01');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSynthesizingTTS, setIsSynthesizingTTS] = useState<boolean>(false);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [masterVolume, setMasterVolume] = useState<number>(0.9);

  const activeScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];
  const activeChar = characters.find((c) => c.id === activeScene.characterId);

  const handleAudioFieldChange = (field: string, val: any) => {
    const updated: SceneItem = {
      ...activeScene,
      audioSpec: {
        ...activeScene.audioSpec,
        [field]: val,
      },
    };
    onUpdateScene(updated);
  };

  const handlePlayVoicePreview = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScene.dialogue);
      utterance.rate = activeScene.audioSpec.speechSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSynthesizeNode = () => {
    setIsSynthesizingTTS(true);
    setTimeout(() => {
      setIsSynthesizingTTS(false);
      const updated: SceneItem = {
        ...activeScene,
        renderStatus: {
          ...activeScene.renderStatus,
          audio: 'rendered',
        },
      };
      onUpdateScene(updated);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Production Stage 06 · Audio Engine & Subtitles
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Index-TTS Voice Synthesis & Whisper Subtitles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Multitrack audio orchestration: distinct character voices, automated background ducking, and millisecond Whisper subtitle alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('preview')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            Video Preview Studio →
          </button>
        </div>
      </div>

      {/* Scene Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {scenes.map((scene) => {
          const isSelected = scene.id === selectedSceneId;
          const isAudioDone = scene.renderStatus.audio === 'rendered';
          return (
            <button
              key={scene.id}
              onClick={() => {
                if (isPlayingAudio && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
                setSelectedSceneId(scene.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>Scene 0{scene.sceneNumber}</span>
              <span className={`w-2 h-2 rounded-full ${isAudioDone ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: TTS Voice Engine */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Index-TTS Node Voice Generator</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                faster-whisper synced
              </span>
            </div>

            {/* Spoken Dialogue Text & Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Spoken Scene Dialogue</span>
                <span className="text-slate-400 font-mono">
                  {activeScene.durationSec.toFixed(1)}s target duration
                </span>
              </div>
              <textarea
                rows={3}
                value={activeScene.dialogue}
                onChange={(e) => {
                  const updated: SceneItem = { ...activeScene, dialogue: e.target.value };
                  onUpdateScene(updated);
                }}
                className="w-full text-xs leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handlePlayVoicePreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Stop Voice Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Dialogue Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSynthesizeNode}
                  disabled={isSynthesizingTTS}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSynthesizingTTS ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing WAV...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bake Index-TTS Node</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Voice Settings Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-300">Speaker Profile</label>
                <select
                  value={activeScene.audioSpec.ttsVoice}
                  onChange={(e) => handleAudioFieldChange('ttsVoice', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="en-IN-Prabhat / Index-TTS Studio Male">
                    Arjun Voice (en-IN-Prabhat / Studio Warm Baritone)
                  </option>
                  <option value="en-US-Jenny / Index-TTS Studio Female">
                    Dr. Maya Lin Voice (en-US-Jenny / Confident Articulate)
                  </option>
                  <option value="en-GB-Oliver / Documentary Narrator">
                    Documentary Voiceover (en-GB-Oliver / British BBC Style)
                  </option>
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-300">Emotional Cadence</label>
                <select
                  value={activeScene.audioSpec.emotion}
                  onChange={(e) => handleAudioFieldChange('emotion', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Engaging, contemplative">Engaging, Contemplative</option>
                  <option value="Explanatory, sharp">Explanatory, Sharp & Clear</option>
                  <option value="Authoritative, urgent">Authoritative, Dynamic Energy</option>
                  <option value="Reflective, calm">Reflective, Calm Outro</option>
                </select>
              </div>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1.5 text-xs pt-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Pacing / Speech Rate</span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {activeScene.audioSpec.speechSpeed.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.02"
                value={activeScene.audioSpec.speechSpeed}
                onChange={(e) => handleAudioFieldChange('speechSpeed', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* faster-whisper Subtitles Card */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>faster-whisper Subtitle & Timestamp Alignment</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">SRT / VTT export ready</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-500 text-[11px]">
                00:00.000 --&gt; 00:0{activeScene.durationSec.toFixed(3)}
              </div>
              <div className="text-amber-200 text-xs">
                "{activeScene.dialogue}"
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Mixer & Background Music */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>FFmpeg Audio Mixer</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">48kHz / 24-bit</span>
            </div>

            {/* Track 1: Dialogue */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Track 1: Primary Dialogue</span>
                <span className="font-mono text-slate-400 tabular-nums">0.0 dB</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-amber-400 rounded-full"></div>
              </div>
            </div>

            {/* Track 2: BGM */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Track 2: Ambient Music</span>
                <span className="font-mono text-amber-400 tabular-nums">
                  {(activeScene.audioSpec.bgmVolume * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.6"
                step="0.02"
                value={activeScene.audioSpec.bgmVolume}
                onChange={(e) => handleAudioFieldChange('bgmVolume', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="text-[11px] text-slate-400 italic">
                Active: {activeScene.audioSpec.bgmTrack}
              </div>
            </div>

            {/* Track 3: Sound Effects */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Track 3: SFX & UI Chimes</span>
                <span className="font-mono text-slate-400 tabular-nums">25%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[25%] h-full bg-indigo-400 rounded-full"></div>
              </div>
            </div>

            {/* Auto Ducking Toggle */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Automated Sidechain Ducking</div>
                <div className="text-[11px] text-slate-400">Lowers BGM by -12dB when dialogue speaks</div>
              </div>
              <button
                onClick={() => setAutoDucking(!autoDucking)}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  autoDucking ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-950"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
