import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Play, 
  ArrowUpDown, 
  CheckCircle2, 
  Plus, 
  Film, 
  Zap, 
  Layers
} from 'lucide-react';
import { CalendarProductionItem } from '../types';

interface ProductionCalendarViewProps {
  calendarItems: CalendarProductionItem[];
  onUpdateCalendarItem: (item: CalendarProductionItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const ProductionCalendarView: React.FC<ProductionCalendarViewProps> = ({
  calendarItems,
  onUpdateCalendarItem,
  onNavigateTab,
}) => {
  const [items, setItems] = useState<CalendarProductionItem[]>(calendarItems);

  const totalEstimatedMins = items.reduce((acc, it) => acc + it.estimatedRenderMins, 0);

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    // update renderOrder
    const updated = reordered.map((it, idx) => ({ ...it, renderOrder: idx + 1 }));
    setItems(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 14 · Production Calendar & Queue
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Release Schedule & Render Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Orchestrates weekly Shorts, documentaries, and long-form episodes. Controls GPU rendering queue priority.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span>Total Queue Render: </span>
            <span className="text-amber-400 font-bold">{totalEstimatedMins} mins</span>
          </div>
        </div>
      </div>

      {/* Production Queue List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>GPU Render Priority Queue</span>
          <span>Order & Priority</span>
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                    0{item.renderOrder}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.priority === 'Urgent'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : item.priority === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.type} · Target Date: {item.scheduledDate} · Est. Time: {item.estimatedRenderMins}m
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded ${
                    item.status === 'Rendering'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {item.status}
                  </span>

                  {/* Priority Adjusters */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(idx, 'up')}
                      disabled={isFirst}
                      className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveOrder(idx, 'down')}
                      disabled={isLast}
                      className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
