import React, { useState } from 'react';
import { 
  Tv, 
  BookOpen, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Film,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ChannelSeries, CalendarProductionItem } from '../types';

interface ChannelsSeriesViewProps {
  seriesList: ChannelSeries[];
  calendarItems: CalendarProductionItem[];
  onSelectSeriesForProduction: (series: ChannelSeries) => void;
  onNavigateTab: (tab: string) => void;
}

export const ChannelsSeriesView: React.FC<ChannelsSeriesViewProps> = ({
  seriesList,
  calendarItems,
  onSelectSeriesForProduction,
  onNavigateTab,
}) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(seriesList[0]?.id || 'SER-FIN');
  const activeSeries = seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  const seriesCalendar = calendarItems.filter((c) => c.seriesId === activeSeries?.id);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 13 · Channels / Series
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Channel Franchises & Series Memory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintains permanent world lore, visual bibles, publication cadences, and production queues across multi-episode series.
          </p>
        </div>

        <button
          onClick={() => {
            onSelectSeriesForProduction(activeSeries);
            onNavigateTab('create');
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <span>Start Episode for {activeSeries.title}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Series Roster */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Channel Series ({seriesList.length})
          </div>

          <div className="space-y-2.5">
            {seriesList.map((series) => {
              const isSelected = series.id === selectedSeriesId;
              return (
                <div
                  key={series.id}
                  onClick={() => setSelectedSeriesId(series.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold" style={{ color: series.color }}>
                      {series.niche}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {series.episodesCount} episodes
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {series.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Cadence: {series.cadence}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Series Memory & Production Queue */}
        <div className="lg:col-span-8 space-y-5">
          {activeSeries ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeSeries.color }} />
                    <span className="font-mono text-xs font-bold text-slate-400">{activeSeries.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display mt-1">
                    {activeSeries.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Niche: {activeSeries.niche} · Cadence: {activeSeries.cadence}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Produced</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    {activeSeries.episodesCount} Episodes
                  </div>
                </div>
              </div>

              {/* Visual Bible Rules */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Series Visual Bible & Aesthetic Invariants</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  {activeSeries.visualBibleRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-amber-400 font-mono">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Series Long-Term Lore Memory */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Long-Term Lore Memory (Ep 01 → Ep 17 Continuity)</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  {activeSeries.loreMemory.map((lore, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lore}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Upcoming Production Queue */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-800/60">
                <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Production Calendar Queue ({seriesCalendar.length})</span>
                </h4>
                <div className="space-y-2">
                  {seriesCalendar.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.type} · Target: {item.scheduledDate} · Priority: {item.priority}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
