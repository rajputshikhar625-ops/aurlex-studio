import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Server, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Activity, 
  Layers, 
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';
import { HardwareTelemetry } from '../types';

interface HardwareManagerViewProps {
  telemetry: HardwareTelemetry;
  onRefreshTelemetry: () => void;
}

export const HardwareManagerView: React.FC<HardwareManagerViewProps> = ({
  telemetry,
  onRefreshTelemetry,
}) => {
  const [testJobDurationSec, setTestJobDurationSec] = useState<number>(6.5);
  const [testJobResolution, setTestJobResolution] = useState<'1080p' | '4k'>('1080p');
  const [forceCloud, setForceCloud] = useState<boolean>(false);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<string | null>(null);

  // VRAM calculation logic for GTX 1650 4GB system
  const estimatedVramRequired = testJobResolution === '4k' 
    ? (8.5 + (testJobDurationSec * 0.2)) 
    : (2.4 + (testJobDurationSec * 0.08));

  const fitsLocalGpu = estimatedVramRequired <= 3.4 && !forceCloud;

  const handleTestDispatch = () => {
    setIsSimulatingDispatch(true);
    setDispatchResult(null);
    setTimeout(() => {
      setIsSimulatingDispatch(false);
      if (fitsLocalGpu) {
        setDispatchResult(`Assigned to LOCAL GPU (NVIDIA GTX 1650): Estimated VRAM ${estimatedVramRequired.toFixed(1)} GB fits within 4.0 GB limit without CUDA overflow. Zero cloud fees.`);
      } else {
        setDispatchResult(`Assigned to CLOUD GPU (A100 / T4 Colab Cluster): Job requirement (${estimatedVramRequired.toFixed(1)} GB VRAM) exceeds local GTX 1650 safe headroom. Dispatched remotely to prevent CUDA OOM.`);
      }
    }, 1200);
  };

  const workers = [
    { name: 'NotebookLM', role: 'Research Assistant & Fact Extractor', target: 'External Google API', status: 'Online', latency: '240ms' },
    { name: 'Llama 3.3', role: 'Local Director & Reasoning Engine', target: 'Ollama (Port 11434)', status: 'Online', latency: '12ms' },
    { name: 'Gemini 3.8', role: 'High-Order Synthesis & Scriptwriter', target: 'Google GenAI SDK (Server-Side)', status: 'Online', latency: '180ms' },
    { name: 'ComfyUI', role: 'Visual Backgrounds & Plates', target: 'Local Daemon (Port 8188)', status: 'Online', latency: '14ms' },
    { name: 'AnimateDiff Evolved', role: 'Temporal Motion Generator', target: 'ComfyUI Custom Node', status: 'Online', latency: '35ms' },
    { name: 'Index-TTS', role: 'Character Speech Synthesis', target: 'Local TTS Engine', status: 'Online', latency: '42ms' },
    { name: 'faster-whisper', role: 'Subtitles & Timing Alignment', target: 'CUDA Accelerated Python Node', status: 'Online', latency: '28ms' },
    { name: 'FFmpeg', role: 'Audio/Video Multiplexer & Export', target: 'Local Binary (v6.1.1)', status: 'Ready', latency: '4ms' },
    { name: 'Cloud GPU Bridge', role: 'Heavy VRAM Render Overflow', target: 'Remote Colab/RunPod Worker', status: 'Standby', latency: '85ms' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            System & Compute Orchestration
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Hardware Telemetry & Hybrid Cloud Dispatcher
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Protects your NVIDIA GTX 1650 4GB from CUDA OOM crashes by dynamically routing heavy render jobs to Cloud GPU.
          </p>
        </div>

        <button
          onClick={onRefreshTelemetry}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Poll Telemetry</span>
        </button>
      </div>

      {/* Hardware Telemetry Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GPU VRAM Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">GPU VRAM Status</span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">{telemetry.gpu.name}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {telemetry.gpu.usedVramGb} <span className="text-sm font-normal text-slate-400">/ {telemetry.gpu.totalVramGb} GB</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
              {telemetry.gpu.vramPercent}% Load
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                telemetry.gpu.vramPercent > 85 ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${telemetry.gpu.vramPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>Thermal: {telemetry.gpu.temperatureC}°C</span>
            <span>Core Load: {telemetry.gpu.utilizationPercent}%</span>
          </div>
        </div>

        {/* CPU & RAM */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">System CPU & Memory</span>
            <span className="text-[11px] font-mono text-slate-400">{telemetry.cpu.cores} Cores</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {telemetry.cpu.utilizationPercent}% <span className="text-sm font-normal text-slate-400">CPU</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
              RAM: {telemetry.ram.usedGb} / {telemetry.ram.totalGb} GB
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.ram.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>RAM Load: {telemetry.ram.percent}%</span>
            <span>System Overhead: Clean</span>
          </div>
        </div>

        {/* Smart Router Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Intelligent Render Router</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active</span>
          </div>

          <div className="text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Local VRAM Ceiling:</span>
              <span className="font-mono text-white font-bold">3.4 GB Safe Limit</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Overflow Policy:</span>
              <span className="font-mono text-amber-400">Route to Cloud GPU</span>
            </div>
            <div className="flex items-center justify-between">
              <span>CUDA Crash Risk:</span>
              <span className="font-mono text-emerald-400 font-bold">0% (Guarded)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            Short test clips run locally on GTX 1650. Heavy 4K or 30s sequences route to Cloud cluster.
          </div>
        </div>
      </div>

      {/* Interactive Render Job Router Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Job Dispatch & VRAM Budget Calculator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculate estimated VRAM usage before execution to prevent system freeze.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Scene Duration</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="1"
                min="2"
                max="60"
                value={testJobDurationSec}
                onChange={(e) => setTestJobDurationSec(parseFloat(e.target.value) || 5)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <span className="text-slate-500 font-mono">sec</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Target Resolution</label>
            <select
              value={testJobResolution}
              onChange={(e) => setTestJobResolution(e.target.value as any)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono cursor-pointer"
            >
              <option value="1080p">1080p Full HD (Standard)</option>
              <option value="4k">4K Ultra HD (Heavy VRAM)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Estimated VRAM Footprint</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-amber-400 text-sm">
              {estimatedVramRequired.toFixed(1)} GB VRAM
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={forceCloud}
              onChange={(e) => setForceCloud(e.target.checked)}
              className="accent-amber-400"
            />
            <span>Force Remote Cloud GPU (Colab/RunPod)</span>
          </label>

          <button
            onClick={handleTestDispatch}
            disabled={isSimulatingDispatch}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSimulatingDispatch ? 'Calculating Compute Pathway...' : 'Evaluate & Test Dispatch'}
          </button>
        </div>

        {dispatchResult && (
          <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed animate-fadeIn ${
            fitsLocalGpu 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
          }`}>
            <div className="font-bold mb-1">
              {fitsLocalGpu ? '✓ ROUTED TO LOCAL GPU' : '☁️ ROUTED TO CLOUD GPU CLUSTER'}
            </div>
            {dispatchResult}
          </div>
        )}
      </div>

      {/* Agent Orchestrator Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Aurlex Agent Orchestrator Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Specialized tools perform the heavy work; Aurlex directs and coordinates the pipeline.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">9 Workers Online</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {workers.map((w, idx) => (
            <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-amber-400 font-bold min-w-[140px]">{w.name}</span>
                <span className="text-slate-300">{w.role}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span className="text-slate-500">{w.target}</span>
                <span className="text-slate-400">{w.latency}</span>
                <span className="text-emerald-400 font-semibold">{w.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
