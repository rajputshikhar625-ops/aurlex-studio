import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Layers, 
  Play, 
  Plus, 
  ShieldCheck, 
  FileText,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { SponsorDeal } from '../types';

interface SponsorStudioViewProps {
  sponsorDeals: SponsorDeal[];
  onUpdateSponsorDeal: (deal: SponsorDeal) => void;
  onAddSponsorDeal: (deal: SponsorDeal) => void;
  onNavigateTab: (tab: string) => void;
}

export const SponsorStudioView: React.FC<SponsorStudioViewProps> = ({
  sponsorDeals,
  onUpdateSponsorDeal,
  onAddSponsorDeal,
  onNavigateTab,
}) => {
  const [selectedDealId, setSelectedDealId] = useState<string>(sponsorDeals[0]?.id || 'SPON-001');
  const [isAiDrafting, setIsAiDrafting] = useState<boolean>(false);

  const activeDeal = sponsorDeals.find((d) => d.id === selectedDealId) || sponsorDeals[0];

  const handleFieldChange = (field: keyof SponsorDeal, value: any) => {
    if (!activeDeal) return;
    const updated = { ...activeDeal, [field]: value };
    onUpdateSponsorDeal(updated);
  };

  const handleDraftWithAi = async () => {
    if (!activeDeal) return;
    setIsAiDrafting(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a natural 20-second sponsor integration script for ${activeDeal.brandName} (${activeDeal.productName}) inside a video explaining Indian banking liquidity. Talking points: ${activeDeal.talkingPoints.join(', ')}. Include an organic transition and clear CTA.`,
          systemInstruction: 'You are the Aurlex Sponsor Studio writer. Craft organic, high-converting sponsor segments that respect viewer intelligence.',
        }),
      });
      const data = await res.json();
      if (data.text) {
        handleFieldChange('script', data.text);
      }
    } catch {
      handleFieldChange('script', `Just as central banks keep secure reserve ratios, ${activeDeal.brandName} protects your assets. Learn more at ${activeDeal.productUrl}`);
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleCreateNewDeal = () => {
    const nextId = `SPON-${(sponsorDeals.length + 1).toString().padStart(3, '0')}`;
    const newDeal: SponsorDeal = {
      id: nextId,
      brandName: 'New Partner',
      productName: 'Security or Analytics Suite',
      productUrl: 'https://partner.example.com',
      targetDurationSec: 20.0,
      talkingPoints: ['Key differentiator 1', 'Special viewer offer code AURLEX'],
      script: 'Draft sponsor integration script here...',
      callToAction: 'Visit the link in description.',
      approvalStatus: 'Draft',
      insertTimestampSec: 15.0,
    };
    onAddSponsorDeal(newDeal);
    setSelectedDealId(nextId);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Pillar 12 · Sponsor Studio
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Sponsor Integration & Monetization Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Full brand workflow: Partner Information → Brief → AI Integration Script → Timed Segment Preview → Approval → Timeline Insertion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNewDeal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sponsor Deal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Deals List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Deals ({sponsorDeals.length})
          </div>

          <div className="space-y-2.5">
            {sponsorDeals.map((deal) => {
              const isSelected = deal.id === selectedDealId;
              const isApproved = deal.approvalStatus === 'Approved' || deal.approvalStatus === 'Inserted';

              return (
                <div
                  key={deal.id}
                  onClick={() => setSelectedDealId(deal.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{deal.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {deal.approvalStatus}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white truncate">
                    {deal.brandName}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {deal.productName}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Duration: {deal.targetDurationSec}s</span>
                    <span>Insert: @{deal.insertTimestampSec}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deal Inspector & Script Builder */}
        <div className="lg:col-span-8">
          {activeDeal ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="font-mono text-xs text-amber-400 font-bold">{activeDeal.id}</span>
                  <input
                    type="text"
                    value={activeDeal.brandName}
                    onChange={(e) => handleFieldChange('brandName', e.target.value)}
                    className="mt-1 text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none w-full"
                  />
                  <div className="text-xs text-slate-400">{activeDeal.productName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeDeal.approvalStatus}
                    onChange={(e) => handleFieldChange('approvalStatus', e.target.value as any)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Inserted">Inserted in Master</option>
                  </select>
                </div>
              </div>

              {/* Insertion Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Target Duration</span>
                  <div className="font-mono font-bold text-white tabular-nums">
                    {activeDeal.targetDurationSec}s segment
                  </div>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Timeline Placement</span>
                  <div className="font-mono font-bold text-amber-400 tabular-nums">
                    Mid-roll at {activeDeal.insertTimestampSec}s
                  </div>
                </div>
                <div className="space-y-1 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Partner URL</span>
                  <a
                    href={activeDeal.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-amber-400 truncate block hover:underline"
                  >
                    {activeDeal.productUrl}
                  </a>
                </div>
              </div>

              {/* Sponsor Script & AI Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Sponsor Segment Script
                  </label>
                  <button
                    onClick={handleDraftWithAi}
                    disabled={isAiDrafting}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiDrafting ? 'Drafting Sponsor Beat...' : 'Draft with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={activeDeal.script}
                  onChange={(e) => handleFieldChange('script', e.target.value)}
                  className="w-full text-xs leading-relaxed p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Call to Action */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-300">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={activeDeal.callToAction}
                  onChange={(e) => handleFieldChange('callToAction', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Talking Points List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
                <span className="font-semibold text-slate-400">Mandatory Sponsor Talking Points</span>
                <ul className="space-y-1">
                  {activeDeal.talkingPoints.map((tp, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action bar */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Status: {activeDeal.approvalStatus}
                </span>
                <button
                  onClick={() => {
                    handleFieldChange('approvalStatus', 'Inserted');
                    onNavigateTab('editor');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Insert Segment into Video Timeline →
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
