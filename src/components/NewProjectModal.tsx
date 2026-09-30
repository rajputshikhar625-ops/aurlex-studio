import React, { useState } from 'react';
import { X, Sparkles, Film, ArrowRight } from 'lucide-react';
import { ProjectData, VideoFormat } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (proj: ProjectData) => void;
  currentProject: ProjectData;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  currentProject,
}) => {
  const [title, setTitle] = useState('');
  const [series, setSeries] = useState('Finance Explained');
  const [format, setFormat] = useState<VideoFormat>('16:9');
  const [style, setStyle] = useState('2D Illustrated Editorial');

  if (!isOpen) return null;

  const presetProjects: ProjectData[] = [
    {
      id: 'PROJ-FIN-001',
      title: 'How Banks Create Liquidity',
      series: 'Finance Explained',
      episodeNumber: 1,
      durationTargetSec: 35.5,
      format: '16:9',
      style: '2D Illustrated Editorial',
      language: 'English',
      progress: {
        research: { status: 'complete', percent: 100 },
        story: { status: 'complete', percent: 100 },
        characters: { status: 'complete', percent: 100 },
        scenes: { status: 'complete', percent: 100 },
        animation: { status: 'in_progress', percent: 62 },
        audio: { status: 'pending', percent: 35 },
        editing: { status: 'pending', percent: 20 },
        verification: { status: 'pending', percent: 45 },
      },
    },
    {
      id: 'PROJ-ROB-004',
      title: 'Autonomous Actuators & Direct-Drive Motors',
      series: 'Robotics Frontier',
      episodeNumber: 4,
      durationTargetSec: 42.0,
      format: '16:9',
      style: 'Cinematic Modern Vector',
      language: 'English',
      progress: {
        research: { status: 'complete', percent: 100 },
        story: { status: 'complete', percent: 85 },
        characters: { status: 'complete', percent: 100 },
        scenes: { status: 'in_progress', percent: 60 },
        animation: { status: 'pending', percent: 10 },
        audio: { status: 'pending', percent: 0 },
        editing: { status: 'pending', percent: 0 },
        verification: { status: 'pending', percent: 0 },
      },
    },
  ];

  const handleCreate = () => {
    if (!title.trim()) return;
    const newProj: ProjectData = {
      id: `PROJ-${Date.now().toString().slice(-4)}`,
      title,
      series: series || 'Standalone Documentary',
      episodeNumber: 1,
      durationTargetSec: 30.0,
      format,
      style,
      language: 'English',
      progress: {
        research: { status: 'in_progress', percent: 40 },
        story: { status: 'pending', percent: 0 },
        characters: { status: 'pending', percent: 0 },
        scenes: { status: 'pending', percent: 0 },
        animation: { status: 'pending', percent: 0 },
        audio: { status: 'pending', percent: 0 },
        editing: { status: 'pending', percent: 0 },
        verification: { status: 'pending', percent: 0 },
      },
    };
    onSelectProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-display">Switch or Create Production</h3>
            <p className="text-xs text-slate-400">Select an existing production or start a new researched video episode.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Projects */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Productions
          </div>
          <div className="space-y-2">
            {presetProjects.map((p) => {
              const isCurrent = p.id === currentProject.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{p.id}</span>
                      <span className="text-xs text-slate-400">· {p.series}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{p.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Form */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Create New Production
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold">Episode Title</label>
              <input
                type="text"
                placeholder="e.g. Why AI Agents Are Replacing Traditional Code"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold">Series / Canon</label>
                <input
                  type="text"
                  placeholder="e.g. Tech Deep Dive"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="16:9">16:9 Landscape (YouTube)</option>
                  <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
                  <option value="1:1">1:1 Square (Socials)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              Initialize Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
