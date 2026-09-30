import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Server, 
  Sliders, 
  HardDrive, 
  Check, 
  RefreshCw, 
  Key, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SystemSettingsConfig } from '../types';

interface SettingsSystemViewProps {
  settings: SystemSettingsConfig;
  onUpdateSettings: (settings: SystemSettingsConfig) => void;
  onRefreshTelemetry: () => void;
}

export const SettingsSystemView: React.FC<SettingsSystemViewProps> = ({
  settings,
  onUpdateSettings,
  onRefreshTelemetry,
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettingsConfig>(settings);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 17 · Settings / System Control
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Local Daemons, GPU Limits & Cloud Bridges
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure local ComfyUI, Ollama, FFmpeg paths, and GTX 1650 4GB VRAM safety limits to avoid memory paging.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{saveSuccess ? 'Saved Settings!' : 'Save System Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Local ComfyUI & Ollama */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Local AI Daemon Endpoints</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">ComfyUI Host URL</label>
            <input
              type="text"
              value={localSettings.comfyUrl}
              onChange={(e) => setLocalSettings({ ...localSettings, comfyUrl: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-white focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-500">Default: http://127.0.0.1:8188</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Ollama Local Director URL</label>
            <input
              type="text"
              value={localSettings.ollamaUrl}
              onChange={(e) => setLocalSettings({ ...localSettings, ollamaUrl: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-white focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-500">Default: http://127.0.0.1:11434</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Ollama Reasoning Model</label>
            <select
              value={localSettings.ollamaModel}
              onChange={(e) => setLocalSettings({ ...localSettings, ollamaModel: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono cursor-pointer"
            >
              <option value="llama3:latest">llama3:latest (8B Local Director)</option>
              <option value="llama3.2:latest">llama3.2:latest (Lightweight 3B)</option>
              <option value="mistral:latest">mistral:latest (Fast 7B)</option>
              <option value="qwen2.5:latest">qwen2.5:latest (Structured Data)</option>
            </select>
          </div>
        </div>

        {/* Hardware & GPU Safety Limits */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>NVIDIA GTX 1650 4GB Safety Guardrails</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Local VRAM Allocation Ceiling</span>
              <span className="font-mono text-amber-400 font-bold tabular-nums">
                {localSettings.vramSafetyLimitGb.toFixed(1)} GB / 4.0 GB
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="3.8"
              step="0.1"
              value={localSettings.vramSafetyLimitGb}
              onChange={(e) => setLocalSettings({ ...localSettings, vramSafetyLimitGb: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <p className="text-[10px] text-slate-500">
              When a job exceeds {localSettings.vramSafetyLimitGb.toFixed(1)} GB, Aurlex automatically invokes the Cloud GPU bridge.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Cloud GPU Fallback Target</label>
            <select
              value={localSettings.cloudProvider}
              onChange={(e) => setLocalSettings({ ...localSettings, cloudProvider: e.target.value as any })}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono cursor-pointer"
            >
              <option value="RunPod Auto-Fallback">RunPod Auto-Fallback (A4000/A5000 cluster)</option>
              <option value="Google Colab Pro">Google Colab Pro (T4/V100 worker)</option>
              <option value="Modal Labs">Modal Labs Serverless PyTorch</option>
              <option value="Local Only">Local Only (Strict - Reject jobs &gt; ceiling)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">FFmpeg Local Binary</label>
            <input
              type="text"
              value={localSettings.ffmpegPath}
              onChange={(e) => setLocalSettings({ ...localSettings, ffmpegPath: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
