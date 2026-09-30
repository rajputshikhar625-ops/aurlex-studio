import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  AlertCircle, 
  HardDrive, 
  ChevronDown, 
  Tv, 
  Briefcase, 
  Calendar, 
  Film, 
  ShieldCheck, 
  Settings,
  Scissors
} from 'lucide-react';
import { HardwareTelemetry, ProjectData } from '../types';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  project: ProjectData;
  telemetry: HardwareTelemetry;
  onOpenNewProject: () => void;
  onTriggerRender: () => void;
  isRendering: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  project,
  telemetry,
  onOpenNewProject,
  onTriggerRender,
  isRendering,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Primary pipeline tabs
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: 'Create' },
    { id: 'intelligence', label: 'Researcher' },
    { id: 'script', label: 'Script' },
    { id: 'characters', label: 'Characters' },
    { id: 'animation', label: 'Animation' },
    { id: 'audio', label: 'Voice & Audio' },
    { id: 'editor', label: 'Editor' },
    { id: 'verification', label: 'Verification QA' },
  ];

  // Satellite studio tabs
  const satelliteNavItems = [
    { id: 'continuity', label: 'Director Continuity', icon: ShieldCheck },
    { id: 'sponsor', label: 'Sponsor Studio', icon: Briefcase },
    { id: 'series', label: 'Channels / Series', icon: Tv },
    { id: 'calendar', label: 'Production Calendar', icon: Calendar },
    { id: 'reference', label: 'Reference Studio', icon: Film },
    { id: 'hardware', label: 'Hardware & GPU', icon: HardDrive },
    { id: 'settings', label: 'Settings / System', icon: Settings },
  ];

  const isSatelliteActive = satelliteNavItems.some((s) => s.id === activeTab);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-4">
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="text-lg lg:text-xl font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors shrink-0"
          >
            Aurlex Studio
          </a>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-3">
            <span className="text-slate-300 font-medium truncate max-w-[160px]">{project.title}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400">Ep {project.episodeNumber.toString().padStart(2, '0')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={onOpenNewProject}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Switch
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links + Dropdown for Satellites */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-400">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMoreOpen(false);
                }}
                className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Satellites Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`py-1 flex items-center gap-1 transition-colors cursor-pointer ${
                isSatelliteActive
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Satellites</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isMoreOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs space-y-1 animate-fadeIn"
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                {satelliteNavItems.map((sat) => {
                  const Icon = sat.icon;
                  const isCur = activeTab === sat.id;
                  return (
                    <button
                      key={sat.id}
                      onClick={() => {
                        setActiveTab(sat.id);
                        setIsMoreOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-amber-500/10 text-amber-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{sat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary actions & telemetry indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('hardware')}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors cursor-pointer"
            title="NVIDIA GTX 1650 4GB VRAM Monitor"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tabular-nums">VRAM {telemetry.gpu.vramPercent}%</span>
            <span className="text-slate-500">|</span>
            <span className="tabular-nums">{telemetry.gpu.temperatureC}°C</span>
          </button>

          <button
            onClick={onTriggerRender}
            disabled={isRendering}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              isRendering
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
            }`}
          >
            {isRendering ? (
              <>
                <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Rendering Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Render Episode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scroll Nav */}
      <div className="xl:hidden mt-2 pt-2 border-t border-slate-800/60 overflow-x-auto flex items-center gap-3 text-xs scrollbar-none">
        {[...primaryNavItems, ...satelliteNavItems].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`pb-1 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === item.id
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
